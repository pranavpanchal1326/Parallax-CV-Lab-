import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { answer, catalog, inspectProvider, AssistantError, validateRequest } from './assistant.mjs';

const origins = new Set([4180,4190,4191].flatMap(p => [`http://127.0.0.1:${p}`, `http://localhost:${p}`]));
const COOKIE = 'parallax_assistant_session';
const lifetime = 30 * 60 * 1000;
export function createAssistantServer({ respond = answer, getCatalog = catalog, provider = inspectProvider } = {}) {
  const sessions = new Map();
  let pending = 0;
  return createServer(async (req, res) => {
    const origin = req.headers.origin;
    const host = req.headers.host?.split(':')[0];
    const send = (status, value) => { if (!res.destroyed) { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}); res.end(JSON.stringify(value)); } };
    if (!['127.0.0.1','localhost'].includes(host) || (origin && !origins.has(origin))) return send(403, {code:'origin_rejected', message:'Use the local project browser.'});
    if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Access-Control-Allow-Credentials','true'); res.setHeader('Vary','Origin'); }
    if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Headers','Content-Type'); res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS'); return send(200, {}); }
    const path = new URL(req.url, 'http://127.0.0.1').pathname;
    try {
      if (req.method === 'GET' && path === '/api/assistant/catalog') return send(200, getCatalog());
      if (req.method === 'GET' && path === '/api/assistant/status') return send(200, {scope:'AI-L1 · public project guides only', provider:await provider()});
      if (!origin && req.headers['sec-fetch-site'] === 'cross-site') return send(403, {code:'origin_rejected', message:'Use the local project browser.'});
      const now = Date.now();
      for (const [id,s] of sessions) if (s.touched + lifetime < now && !s.active) sessions.delete(id);
      const supplied = req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
      let session = supplied && sessions.get(supplied);
      if (!session) {
        if (sessions.size >= 100) return send(429,{code:'busy',message:'The local review session limit was reached. Try later.'});
        const id = randomBytes(24).toString('hex'); session = {touched:now, requests:new Map(), reports:[], active:0}; sessions.set(id, session);
        res.setHeader('Set-Cookie',`${COOKIE}=${id}; HttpOnly; SameSite=Strict; Path=/api/assistant; Max-Age=1800`);
      }
      session.touched = now;
      if (req.method === 'GET' && path === '/api/assistant/reports') return send(200,{reports:session.reports});
      if (req.method !== 'POST' || !['/api/assistant','/api/assistant/report'].includes(path)) return send(404,{code:'not_found',message:'Unknown assistant endpoint.'});
      if (!req.headers['content-type']?.startsWith('application/json')) return send(415,{code:'invalid_request',message:'Use a JSON request.'});
      let body = ''; for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body)>8000) return send(413,{code:'invalid_request',message:'The request is too large.'}); }
      let input; try { input = JSON.parse(body); } catch { return send(400,{code:'invalid_request',message:'The request is not valid JSON.'}); }
      if (path.endsWith('/report')) {
        if (!input || Object.keys(input).some(k=>!['answerId','reason'].includes(k)) || !['unclear','irrelevant','source-problem'].includes(input.reason)) return send(400,{code:'invalid_request',message:'Choose a review reason.'});
        const saved = [...session.requests.values()].find(r=>r.result?.answerId === input.answerId)?.result;
        if (!saved) return send(404,{code:'not_found',message:'This answer does not belong to your current local review session.'});
        const existing = session.reports.find(r=>r.answerId===input.answerId);
        if (existing) return send(200, existing);
        const record = {answerId:saved.answerId, reason:input.reason, status:'pending local review', createdAt:new Date().toISOString(), guide:saved.guide, fingerprint:saved.fingerprint, question:saved.question, passages:saved.passages};
        session.reports.push(record); return send(201,record);
      }
      input = validateRequest(input);
      const fingerprint = createHash('sha256').update(JSON.stringify(input)).digest('hex');
      const old = session.requests.get(input?.requestId);
      if (old) {
        if (old.fingerprint !== fingerprint) return send(409,{code:'request_conflict',message:'This request ID already has different content.'});
        if (old.result) {
          if (getCatalog().fingerprint !== old.result.fingerprint) return send(409,{code:'stale_context',message:'The guides changed after this answer. Refresh the guides.'});
          return send(200,old.result);
        }
        return send(409,{code:'request_pending',message:'That request is still running or ended without a verified answer. Use a new request ID.'});
      }
      if (session.requests.size >= 40 || pending >= 2) return send(429,{code:'busy',message:'The local assistant is busy or this session reached its question limit. Read the guide and try later.'});
      const entry = {fingerprint}; session.requests.set(input?.requestId,entry);
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(),150000);
      const onClose = () => { if (!res.writableEnded) controller.abort(); };
      res.on('close', onClose); session.active++; pending++;
      try { entry.result = await respond(input,{signal:controller.signal}); return send(200,entry.result); }
      finally { clearTimeout(timeout); res.off('close',onClose); session.active--; pending--; }
    } catch (error) {
      if (error instanceof AssistantError) send(error.status,{code:error.code,message:error.message});
      else send(500,{code:'service_error',message:'The assistant could not complete this request. Your browser record has not changed.'});
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createAssistantServer();
  server.listen(4192,'127.0.0.1',()=>console.log('PARALLAX assistant · http://127.0.0.1:4192 · local Ollama / public guides only'));
}
