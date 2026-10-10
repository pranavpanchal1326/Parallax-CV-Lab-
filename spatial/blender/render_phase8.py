"""P8-A presentation shots and interactive export. Builds on render_studio.py (P4-D) without editing it.

Run (from project root):
  blender -b --factory-startup -P spatial/blender/render_phase8.py -- shots R01 R02 ...
  blender -b --factory-startup -P spatial/blender/render_phase8.py -- export
Env: PARALLAX_SAMPLES (default 96), PARALLAX_RESTRICTED=1 adds the S-05 hang tag to C1-CAM.

Adds Phase 7 physical system to the shared model: S-02 zone headers, S-03 station plates, W wall display.
Geometry still comes only from lab_geometry.json. Equipment forms remain illustrative.
"""
import bpy, os, sys, math, json
from mathutils import Vector

HERE = os.path.dirname(__file__)
STUDIO = os.path.join(HERE, 'render_studio.py')
src = open(STUDIO, encoding='utf8').read()
cut = src.index("camd=bpy.data.cameras.new('Studio camera')")
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['shots', 'R02']
mode, shots = args[0], args[1:]
ns = {'__file__': STUDIO, '__name__': 'studio'}
saved_argv = sys.argv
sys.argv = [sys.argv[0], '--', 'iso']
exec(compile(src[:cut], STUDIO, 'exec'), ns)
sys.argv = saved_argv
scene = bpy.context.scene
cube, label, material, G, mat_ink, mat_white, mat_screen, mat_mint, C = (
    ns['cube'], ns['label'], ns['material'], ns['G'], ns['ink'], ns['white'], ns['screen'], ns['mint'], ns['C'])
blue, red = ns['blue'], ns['red']
ROOT = ns['ns']['ROOT']
RENDERS = os.path.join(ROOT, 'spatial', 'renders', 'phase-08')
EXPORTS = os.path.join(ROOT, 'spatial', 'exports')
os.makedirs(RENDERS, exist_ok=True)
restricted = os.environ.get('PARALLAX_RESTRICTED') == '1'


def facing_label(name, text, x, y, z, size, m, rot_z=0.0):
    o = label(name, text, x, y, z, size, m, True)
    o.rotation_euler = (math.pi / 2, 0, rot_z)
    return o


# ---- S-02 zone headers (suspended, bottom edge 2.12 m, clear of the 1.5 m spine below) ----
SIGNS = bpy.data.collections.new('P8 · Signage S-02 S-03 S-05 · display W')
scene.collection.children.link(SIGNS)
for code, purpose, x, y, faces_south in [('CMP', 'COMPUTING', 2.3, 3.86, True), ('C1', 'CONTROLLED CAPTURE', 7.55, 3.86, True), ('S1', 'SIGNAL BENCH', 7.55, 5.38, False)]:
    w = 0.9
    panel = cube('S-02 ' + code + ' panel', x, y, w, .025, 2.12, .16, mat_white)
    band = cube('S-02 ' + code + ' code band', x if faces_south else x + w - .2, y + .004 if faces_south else y - .004, .2, .025, 2.12, .16, blue)
    for o in (panel, band):
        o.users_collection[0].objects.unlink(o); SIGNS.objects.link(o)
    rod = ns['rod']
    for dx in (.08, w - .08):
        rod('S-02 hanger', (x + dx, -y - .012, 2.28), (x + dx, -y - .012, 2.98), .004, mat_ink, SIGNS)
    if faces_south:
        facing_label('S-02 code', code, x + .03, y + .03, 2.165, .075, mat_white)
        facing_label('S-02 purpose', purpose, x + .23, y + .03, 2.175, .05, mat_ink)
    else:
        facing_label('S-02 code', code, x + w - .03, y - .006, 2.165, .075, mat_white, math.pi)
        facing_label('S-02 purpose', purpose, x + w - .23, y - .006, 2.175, .05, mat_ink, math.pi)

# ---- S-03 station plates on desk front edges ----
for f in G['furniture']:
    if not f['id'].startswith('CV-') or f.get('seat') != 'S':
        continue
    px, py = f['x'] + f['w'] / 2 - .075, f['y'] + f['d']
    plate = cube('S-03 ' + f['id'] + ' plate', px, py, .15, .008, f['h'] - .12, .1, mat_white)
    plate.users_collection[0].objects.unlink(plate); SIGNS.objects.link(plate)
    facing_label('S-03 ' + f['id'] + ' text', f['id'], px + .018, py + .01, f['h'] - .085, .04, mat_ink)

# ---- W wall display on the west wall, north of D1 ----
disp = cube('W wall display frame', 0.0, 2.95, .045, 1.08, 1.55, .62, mat_ink)
glass = cube('W wall display glass', .046, 2.98, .004, 1.02, 1.58, .56, mat_screen)
for o in (disp, glass):
    o.users_collection[0].objects.unlink(o); SIGNS.objects.link(o)
for text, z, s, m in [('NOW IN THE LAB', 2.02, .045, mat_mint), ('Open lab 13:00-17:00', 1.9, .06, mat_white), ('C1  S1  CMP', 1.68, .05, mat_mint)]:
    o = label('W display text', text, .05, 3.05, z, s, m)
    o.rotation_euler = (math.pi / 2, 0, -math.pi / 2)

# ---- S-05 restriction hang tag (Phase 7 RST-0417), optional ----
if restricted:
    tag = cube('S-05 C1-CAM restriction tag', 7.42, 2.22, .16, .006, 1.22, .26, red)
    tag.users_collection[0].objects.unlink(tag); SIGNS.objects.link(tag)
    ns['rod']('S-05 cord', (7.5, -2.2, 1.48), (7.5, -1.95, 1.56), .003, mat_ink, SIGNS)
    facing_label('S-05 text', 'NOT IN USE', 7.435, 2.23, 1.40, .028, mat_white)
    facing_label('S-05 ref', 'RST-0417', 7.445, 2.23, 1.30, .022, mat_white)

# ---- interior ceiling and luminaires: only for eye-level shots (ortho shots keep the open cutaway) ----
INTERIOR = bpy.data.collections.new('P8 · Interior ceiling (eye-level shots only)')
scene.collection.children.link(INTERIOR)
ceil = cube('Ceiling', -.2, -.2, 10.4, 7.4, 3.0, .05, mat_white)
ceil.users_collection[0].objects.unlink(ceil); INTERIOR.objects.link(ceil)
glow = material('Luminaire diffuser', 'F4F6FB', 0, 2.5)
for lx in (1.2, 3.6, 6.0, 8.4):
    for ly in (1.2, 3.0, 6.1):
        p = cube('Luminaire', lx - .6, ly - .15, 1.2, .3, 2.985, .015, glow)
        p.users_collection[0].objects.unlink(p); INTERIOR.objects.link(p)
        d = bpy.data.lights.new('Interior panel', 'AREA'); d.energy = 75; d.shape = 'RECTANGLE'; d.size = 1.2; d.size_y = .3
        lo = bpy.data.objects.new('Interior panel', d); INTERIOR.objects.link(lo); lo.location = (lx, -ly, 2.95)


# Full-height south and west walls above the 1 m cutaway, keeping the D1 door and W1 window openings.
for name, x, y, w, d, z0, h in [
        ('Interior wall S west', 0, 7.0, 4.4, .2, 1.0, 2.0), ('Interior wall S window head', 4.4, 7.0, 1.8, .2, 2.1, .9),
        ('Interior wall S east', 6.2, 7.0, 3.8, .2, 1.0, 2.0),
        ('Interior wall W north', -.2, 0, .2, 4.15, 1.0, 2.0), ('Interior wall W door head', -.2, 4.15, .2, 1.0, 2.1, .9),
        ('Interior wall W south', -.2, 5.15, .2, 1.85, 1.0, 2.0)]:
    o = cube(name, x, y, w, d, z0, h, mat_white)
    o.users_collection[0].objects.unlink(o); INTERIOR.objects.link(o)

# P4 artefact: the demonstration title faced the wall (mirrored). Turn it to face the room.
demo = scene.objects.get('Demo title')
if demo:
    demo.rotation_euler = (math.pi / 2, 0, math.pi)
    demo.location.x += .98


def interior(on):
    for o in INTERIOR.objects:
        o.hide_render = not on


for o in SIGNS.objects:
    if o.type == 'MESH':
        b = o.modifiers.new('Edge highlight', 'BEVEL'); b.width = .003; b.segments = 2; b.limit_method = 'ANGLE'

# ---- shots (G17) ----
SHOTS = {
    'R01': dict(file='R01_entry.png', loc=(.55, -4.65, 1.62), target=(8.2, -2.6, 1.15), lens=17, res=(1800, 1050),
                purpose='Entry perspective: spatial identity from D1'),
    'R02': dict(file='R02_iso_cutaway.png', loc=(-7.8, -15.6, 11.8), target=(5, -3.5, .7), ortho=14.8, res=(1800, 1250),
                purpose='Isometric cutaway showing every zone and the P7 signage'),
    'R03': dict(file='R03_student_eye.png', loc=(3.5, -3.75, 1.2), target=(3.5, -.8, 1.02), lens=22, res=(1800, 1050),
                purpose='Student-eye view at CV-05'),
    'R04': dict(file='R04_capture.png', loc=(9.8, -3.72, 2.45), target=(8.35, -1.7, .95), lens=17, res=(1800, 1050),
                purpose='Controlled capture: camera, lights, target and stage on the 2.05 m axis'),
    'R05': dict(file='R05_signal_bench.png', loc=(8.3, -4.0, 2.25), target=(8.3, -6.75, .85), lens=19, res=(1800, 1050),
                purpose='Signal bench S1 with illustrative instruments'),
    'R06': dict(file='R06_collaboration.png', loc=(5.6, -4.25, 1.6), target=(3.1, -6.6, .95), lens=22, res=(1800, 1050),
                purpose='Collaboration table and demonstration display'),
    'R07': dict(file='R07_storage.png', loc=(4.55, -3.3, 1.75), target=(6.5, -1.15, 1.0), lens=19, res=(1800, 1050),
                purpose='Kit storage STO-1 beside the computing aisle'),
    'R08': dict(file='R08_plan.png', loc=(5, -3.5, 18), target=(5, -3.5, 0), ortho=12.3, res=(1800, 1250),
                purpose='Top plan base for the services and circulation overlay'),
}

prefs = bpy.context.preferences.addons['cycles'].preferences
try:
    prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
    for d in prefs.devices:
        d.use = d.type == 'OPTIX'
    scene.cycles.device = 'GPU'
except Exception:
    scene.cycles.device = 'CPU'
scene.render.engine = 'CYCLES'
scene.cycles.samples = int(os.environ.get('PARALLAX_SAMPLES', '96'))
scene.cycles.use_denoising = True
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'


def shoot(key):
    s = SHOTS[key]
    camd = bpy.data.cameras.new('Cam ' + key)
    cam = bpy.data.objects.new('Cam ' + key, camd)
    scene.collection.objects.link(cam)
    cam.location = s['loc']
    if 'ortho' in s:
        camd.type = 'ORTHO'; camd.ortho_scale = s['ortho']; interior(False)
    else:
        camd.lens = s['lens']; interior(True)
    camd.clip_start = .05
    cam.rotation_euler = (Vector(s['target']) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    scene.camera = cam
    scene.render.resolution_x, scene.render.resolution_y = s['res']
    name = s['file'] if not restricted else s['file'].replace('.png', '_restricted.png')
    scene.render.filepath = os.path.join(RENDERS, name)
    bpy.ops.render.render(write_still=True)
    print('P8_SHOT', key, scene.render.filepath)


if mode == 'shots':
    for k in shots or list(SHOTS):
        shoot(k)
    json.dump({k: {kk: vv for kk, vv in v.items() if kk in ('file', 'purpose', 'loc', 'target', 'lens', 'ortho')} for k, v in SHOTS.items()},
              open(os.path.join(RENDERS, 'shot-list.json'), 'w'), indent=2)

# ---- optimised interactive export: one node per resource ID (G15.04, G15.07) ----
if mode == 'export':
    for name in ('Presentation plinth', 'Studio ground'):
        o = scene.objects.get(name)
        if o: bpy.data.objects.remove(o, do_unlink=True)
    for o in list(INTERIOR.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.object.select_all(action='DESELECT')
    for o in list(scene.objects):
        if o.type == 'FONT':
            bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.object.convert(target='MESH'); o.select_set(False)
    for o in scene.objects:
        if o.type == 'MESH':
            for m in list(o.modifiers): o.modifiers.remove(m)
    furn_ids = sorted([f['id'] for f in G['furniture']], key=len, reverse=True)
    safety_ids = sorted([s['id'] for s in G['safety']], key=len, reverse=True)
    zone_ids = [z['id'] for z in G['zones']]

    def resource_of(o):
        n = o.name
        if n.startswith('S-0') or n.startswith('W '):
            if n.startswith('S-03 '): return n.split(' ')[1]
            if n.startswith('S-05 '): return 'C1-CAM'
            return 'SIGN-S-02' if n.startswith('S-02') else 'SIGN-W'
        for fid in furn_ids:
            if n.startswith(fid): return fid
        for sid in safety_ids:
            if n.startswith(sid): return 'SAFETY-' + sid
        if n.startswith('Zone_'): return 'ZONE-' + n[5:]
        if n.startswith(('Wall_', 'Corner_', 'Floor', 'Acoustic', 'Lab wordmark', 'Wall subtitle')): return 'ARCHITECTURE'
        if n.startswith('S1 ') or 'oscilloscope' in n or 'Signal generator' in n or 'Instrument dial' in n or 'Bench identifier' in n: return 'S1-B'
        if n.startswith(('Camera lens', 'Camera viewfinder')): return 'C1-CAM'
        if n.startswith(('Calibration target', 'Target checker')): return 'CAL-01'
        if n.startswith(('Softbox', 'Diffuser')): return 'LGT-01'
        if n.startswith('Kit cabinet') or n == 'Kit label': return 'STO-1'
        if n.startswith(('Demonstration', 'Demo ')): return 'COL-D'
        if o.users_collection and o.users_collection[0].name.startswith('Signal to pixel'): return 'ARTWORK-CAND04'
        if n.startswith('Access'): return 'ZONE-CV-04-APPROACH'
        return 'FURNISHING'
    groups = {}
    for o in list(scene.objects):
        if o.type == 'MESH':
            groups.setdefault(resource_of(o), []).append(o)
    for rid, objs in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs: o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        if len(objs) > 1: bpy.ops.object.join()
        j = bpy.context.view_layer.objects.active
        j.name = rid; j.data.name = rid
    bpy.ops.object.select_all(action='DESELECT')
    for o in scene.objects:
        if o.type == 'MESH': o.select_set(True)
    out = os.path.join(EXPORTS, 'lab_interactive.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_draco_mesh_compression_enable=False)
    dg = bpy.context.evaluated_depsgraph_get(); tris = 0
    for o in scene.objects:
        if o.type == 'MESH':
            me = o.evaluated_get(dg).to_mesh(); me.calc_loop_triangles(); tris += len(me.loop_triangles); o.evaluated_get(dg).to_mesh_clear()
    stats = {'revision': 'P8-A', 'nodes': sorted(groups.keys()), 'node_count': len(groups), 'triangles': tris,
             'bytes': os.path.getsize(out), 'budget_triangles': 150000, 'budget_bytes': 5 * 1024 * 1024}
    json.dump(stats, open(os.path.join(EXPORTS, 'interactive_stats.json'), 'w'), indent=2)
    print('P8_EXPORT', json.dumps({k: stats[k] for k in ('node_count', 'triangles', 'bytes')}))
