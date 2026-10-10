const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.glb':'model/gltf-binary','.md':'text/plain','.svg':'image/svg+xml'};
const port=Number(process.argv[2]||process.env.PARALLAX_REVIEW_PORT||4173);
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const p=path.resolve(root,'.'+(pathname==='/'?'/design/review.html':pathname));
 if(!p.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);return res.end('File unavailable')}res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)});
}).listen(port,'127.0.0.1',()=>console.log('PARALLAX review: http://127.0.0.1:'+port));
