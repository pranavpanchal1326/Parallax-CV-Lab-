"""P8-B look development. Builds the identical P8-A scene (render_phase8.py), then upgrades only
materials, lighting, world, lens and post. Geometry is unchanged; P8-A outputs are untouched.

Run: blender -b --factory-startup -P spatial/blender/render_phase8b.py -- shots H01 R02 R03 ...
     blender -b --factory-startup -P spatial/blender/render_phase8b.py -- anim A01
Env: PARALLAX_SAMPLES (default 160), PARALLAX_RESTRICTED=1, PARALLAX_PREVIEW=1 (half resolution).
Outputs: spatial/renders/phase-08b/
All materials are procedural (no downloaded textures). Equipment forms remain illustrative.
"""
import bpy, os, sys, math, json
from mathutils import Vector

HERE = os.path.dirname(__file__)
P8 = os.path.join(HERE, 'render_phase8.py')
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else ['shots', 'R02']
mode, shots = args[0], args[1:]
saved = sys.argv
sys.argv = [sys.argv[0], '--', 'build']
ns = {'__file__': P8, '__name__': 'p8'}
exec(compile(open(P8, encoding='utf8').read(), P8, 'exec'), ns)
sys.argv = saved
scene = bpy.context.scene
cube, label, material = ns['cube'], ns['label'], ns['material']
INTERIOR, SIGNS, interior = ns['INTERIOR'], ns['SIGNS'], ns['interior']
ROOT = ns['ROOT']
OUT = os.path.join(ROOT, 'spatial', 'renders', 'phase-08b')
os.makedirs(OUT, exist_ok=True)
PREVIEW = os.environ.get('PARALLAX_PREVIEW') == '1'


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0]


# ---------------------------------------------------------------- procedural materials
def fresh(m):
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    b = nt.nodes.new('ShaderNodeBsdfPrincipled')
    nt.links.new(b.outputs[0], out.inputs['Surface'])
    return nt, b


def coords(nt, scale=(1, 1, 1)):
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = scale
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    return mp.outputs['Vector']


def ramp(nt, src, stops):
    r = nt.nodes.new('ShaderNodeValToRGB')
    el = r.color_ramp.elements
    el[0].position, el[0].color = stops[0][0], srgb(stops[0][1])
    el[1].position, el[1].color = stops[-1][0], srgb(stops[-1][1])
    for pos, col in stops[1:-1]:
        e = el.new(pos); e.color = srgb(col)
    nt.links.new(src, r.inputs['Fac'])
    return r.outputs['Color']


def bump(nt, b, height, strength):
    bp = nt.nodes.new('ShaderNodeBump')
    bp.inputs['Strength'].default_value = strength
    nt.links.new(height, bp.inputs['Height'])
    nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])


def terrazzo(m, base='E9E6DE', chip='B9B3A6', chip2='3346D3'):
    nt, b = fresh(m)
    v = coords(nt)
    n1 = nt.nodes.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = 2.2; n1.inputs['Detail'].default_value = 6
    nt.links.new(v, n1.inputs['Vector'])
    cloud = ramp(nt, n1.outputs['Fac'], [(.35, 'DEDAD0'), (.65, base)])
    vor = nt.nodes.new('ShaderNodeTexVoronoi'); vor.inputs['Scale'].default_value = 38
    nt.links.new(v, vor.inputs['Vector'])
    chips = ramp(nt, vor.outputs['Distance'], [(0, chip), (.09, chip), (.1, 'FFFFFF'), (1, 'FFFFFF')])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = .55
    nt.links.new(cloud, mix.inputs['A']); nt.links.new(chips, mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = .22
    b.inputs['Coat Weight'].default_value = .35; b.inputs['Coat Roughness'].default_value = .08
    bump(nt, b, n1.outputs['Fac'], .02)


def plaster(m, base='ECE8DF'):
    nt, b = fresh(m)
    v = coords(nt, (3, 3, 3))
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 9; n.inputs['Detail'].default_value = 10
    nt.links.new(v, n.inputs['Vector'])
    nt.links.new(ramp(nt, n.outputs['Fac'], [(.3, 'E2DDD2'), (.7, base)]), b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = .88
    bump(nt, b, n.outputs['Fac'], .015)


def wood(m, a='C9AC85', c='9C7B57', along='X'):
    nt, b = fresh(m)
    # Long grain: bands vary ACROSS the board (Y), stretched along it (X), gently distorted; fine fibre noise on top.
    v = coords(nt, (.35, 1, 1) if along == 'X' else (1, .35, 1))
    w = nt.nodes.new('ShaderNodeTexWave'); w.wave_type = 'BANDS'; w.bands_direction = 'Y' if along == 'X' else 'X'
    w.inputs['Scale'].default_value = 7; w.inputs['Distortion'].default_value = 3.4; w.inputs['Detail'].default_value = 3; w.inputs['Detail Scale'].default_value = 1.2
    nt.links.new(v, w.inputs['Vector'])
    fib = nt.nodes.new('ShaderNodeTexNoise'); fib.inputs['Scale'].default_value = 160; fib.inputs['Detail'].default_value = 2
    v2 = coords(nt, (.08, 1, 1) if along == 'X' else (1, .08, 1)); nt.links.new(v2, fib.inputs['Vector'])
    grain = ramp(nt, w.outputs['Fac'], [(0, c), (.45, a), (1, 'D2B994')])
    mixg = nt.nodes.new('ShaderNodeMix'); mixg.data_type = 'RGBA'; mixg.blend_type = 'OVERLAY'; mixg.inputs['Factor'].default_value = .18
    nt.links.new(grain, mixg.inputs['A']); nt.links.new(fib.outputs['Color'], mixg.inputs['B'])
    nt.links.new(mixg.outputs['Result'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = .42
    b.inputs['Coat Weight'].default_value = .25; b.inputs['Coat Roughness'].default_value = .2
    bump(nt, b, w.outputs['Fac'], .01)


def simple(m, color, rough, metal=0, coat=0, sheen=0, emit=0, emit_col=None, transmission=0):
    nt, b = fresh(m)
    b.inputs['Base Color'].default_value = srgb(color)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Sheen Weight'].default_value = sheen
    b.inputs['Transmission Weight'].default_value = transmission
    if emit:
        b.inputs['Emission Color'].default_value = srgb(emit_col or color)
        b.inputs['Emission Strength'].default_value = emit
    return b


def fabric(m, color='3346D3'):
    nt, b = fresh(m)
    v = coords(nt, (60, 60, 60))
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 4; n.inputs['Detail'].default_value = 2
    nt.links.new(v, n.inputs['Vector'])
    nt.links.new(ramp(nt, n.outputs['Fac'], [(.3, '2B3BB4'), (.7, color)]), b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = .92
    b.inputs['Sheen Weight'].default_value = .7; b.inputs['Sheen Tint'].default_value = srgb('9DA8FF')
    bump(nt, b, n.outputs['Fac'], .25)


M = bpy.data.materials
for m in list(M):
    if not m.use_nodes:
        continue
    n = m.name
    if n == 'M_paper': terrazzo(m)
    elif n == 'M_wall': plaster(m)
    elif n == 'Warm ash': wood(m)
    elif n == 'Porcelain': simple(m, 'ECEDE8', .26, coat=.4)
    elif n in ('Graphite alloy', 'M_ink'): simple(m, '232A35', .32, metal=.75)
    elif n == 'M_seat': simple(m, '2A313C', .35, metal=.6)
    elif n == 'Screen glass': simple(m, '0C141E', .06, coat=1)
    elif n == 'Phosphor': simple(m, '6EE7C5', .4, emit=3)
    elif n == 'Chartreuse detail': simple(m, 'D9EF73', .4, emit=2)
    elif n == 'Ultramarine enamel': fabric(m)
    elif n == 'Backdrop': simple(m, '1B2230', .55, coat=.2)
    elif n.startswith('Floor C1'): simple(m, '232A33', .7)
    elif n.startswith('Floor '):
        col = {'CMP': 'D9DDE6', 'SPN': 'ECE8E0', 'S1': 'D3DCDA', 'COL': 'E4DECD', 'FAC': 'E4DECD', 'STO': 'DADDE4'}.get(n[6:], 'E3E0D8')
        terrazzo(m, base=col, chip='A8A39A')
    elif n == 'M_instAccent': simple(m, '6EE7C5', .4, emit=4)

# the sculpture's fins get their own lacquer (the chairs keep the fabric)
lacquer = bpy.data.materials.new('Lacquer ultramarine'); lacquer.use_nodes = True
simple(lacquer, '2F43D8', .16, metal=.15, coat=1)
for o in bpy.data.collections['Signal to pixel · candidate artwork'].objects:
    if o.type == 'MESH' and o.name.startswith('Analogue fin'):
        o.data.materials.clear(); o.data.materials.append(lacquer)

# window glazing for W1 (south wall x 4.4–6.2, z 0.9–2.1)
glass = bpy.data.materials.new('Window glass'); glass.use_nodes = True
simple(glass, 'DDE8F0', .02, transmission=1)
g = cube('W1 glazing', 4.4, 7.08, 1.8, .02, .9, 1.2, glass)
for c in list(g.users_collection): c.objects.unlink(g)
INTERIOR.objects.link(g)

# a little life: two plants and notebooks (illustrative props, outside every clearance zone)
leaf = bpy.data.materials.new('Leaf'); leaf.use_nodes = True; simple(leaf, '3E6B4A', .55, sheen=.3)
pot = bpy.data.materials.new('Terracotta'); pot.use_nodes = True; simple(pot, 'B9694A', .7)
paper = bpy.data.materials.new('Notebook paper'); paper.use_nodes = True; simple(paper, 'F3EFE6', .8)
PROPS = bpy.data.collections.new('P8-B · illustrative props'); scene.collection.children.link(PROPS)


def link(o):
    for c in list(o.users_collection): c.objects.unlink(o)
    PROPS.objects.link(o); return o


def plant(x, y):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=.16, depth=.42, location=(x, -y, .21)); link(bpy.context.object).data.materials.append(pot)
    for i in range(14):
        a = i * 2.4; r = .05 + .02 * (i % 3); h = .55 + .045 * i
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=.12, location=(x + r * math.cos(a), -y + r * math.sin(a), h))
        o = link(bpy.context.object); o.scale = (1.0, .35, .08); o.rotation_euler = (0.5 * math.cos(a), .6, a); o.data.materials.append(leaf)


plant(9.7, 6.75); plant(.35, 5.15)
for i, (x, y, r) in enumerate([(3.3, 6.15, .2), (4.55, 6.3, -.15), (3.9, 6.45, .05)]):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -y, .772 + .006 * i)); o = link(bpy.context.object)
    o.scale = (.21, .15, .012); o.rotation_euler = (0, 0, r); o.data.materials.append(paper)

for o in PROPS.objects:
    bv = o.modifiers.new('Soft edge', 'BEVEL'); bv.width = .004; bv.segments = 2

# ---------------------------------------------------------------- world, sun and light rig
world = scene.world
wt = world.node_tree
for n in list(wt.nodes): wt.nodes.remove(n)
sky = wt.nodes.new('ShaderNodeTexSky'); sky.sky_type = 'MULTIPLE_SCATTERING'
for k, v in (('sun_elevation', math.radians(24)), ('sun_rotation', math.radians(200)), ('altitude', 300), ('air_density', 1.0), ('dust_density', 1.6)):
    if hasattr(sky, k): setattr(sky, k, v)
bg = wt.nodes.new('ShaderNodeBackground'); bg.inputs['Strength'].default_value = .18
wo = wt.nodes.new('ShaderNodeOutputWorld')
wt.links.new(sky.outputs['Color'], bg.inputs['Color']); wt.links.new(bg.outputs[0], wo.inputs['Surface'])

for name in ('Sun', 'Large studio key', 'Warm fill', 'North wash'):
    o = scene.objects.get(name)
    if o: o.hide_render = True

sund = bpy.data.lights.new('P8-B sun', 'SUN'); sund.energy = 4.2; sund.angle = math.radians(1.2); sund.color = (1.0, .86, .7)
sun = bpy.data.objects.new('P8-B sun', sund); scene.collection.objects.link(sun)
# from the south-west, low: rakes through W1 and across the iso cutaway
sun.rotation_euler = (math.radians(62), 0, math.radians(200))


def area(name, loc, target, power, size, color=(1, 1, 1)):
    d = bpy.data.lights.new(name, 'AREA'); d.energy = power; d.shape = 'DISK'; d.size = size; d.color = color
    o = bpy.data.objects.new(name, d); scene.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(target) - o.location).to_track_quat('-Z', 'Y').to_euler(); return o


ISO_LIGHTS = [area('Iso cool fill', (14, -2, 9), (5, -3.5, 0), 1400, 9, (.78, .86, 1.0)),
              area('Iso rim', (5, 8, 6), (5, -3.5, 1), 900, 6, (.9, .93, 1.0))]
INT_LIGHTS = [area('Window bounce', (5.3, -6.4, 1.6), (5.3, -3, 1), 140, 1.6, (1, .9, .8))]
for o in ISO_LIGHTS + INT_LIGHTS:
    o.visible_glossy = False   # no disc reflections in the glossy plinth

# ---------------------------------------------------------------- R09: KIT-C1-v1 laid out (knolling), G17.09
KX, KY = 40.0, 0.0
KIT = bpy.data.collections.new('P8-B · R09 kit layout'); scene.collection.children.link(KIT)
graphite = bpy.data.materials.new('Kit graphite'); graphite.use_nodes = True; simple(graphite, '262D38', .32, metal=.7)
mat_plinth = bpy.data.materials.new('Kit plinth'); mat_plinth.use_nodes = True; simple(mat_plinth, '161B24', .62)
diff = bpy.data.materials.new('Diffuser'); diff.use_nodes = True; simple(diff, 'F4F6FB', .5, emit=.15)
whitem = bpy.data.materials.new('Kit white'); whitem.use_nodes = True; simple(whitem, 'EEF0F3', .4)
mint = bpy.data.materials.new('Kit mint'); mint.use_nodes = True; simple(mint, '6EE7C5', .4, emit=1.2)
lens_glass = bpy.data.materials.new('Lens glass'); lens_glass.use_nodes = True; simple(lens_glass, '0B1220', .03, coat=1)


def kbox(name, x, y, w, d, h, m, z=0.0, rz=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(KX + x, KY + y, z + h / 2)); o = bpy.context.object; o.name = name
    o.scale = (w, d, h); o.rotation_euler = (0, 0, rz); bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(m); bv = o.modifiers.new('Edge', 'BEVEL'); bv.width = .004; bv.segments = 3
    for c in list(o.users_collection): c.objects.unlink(o)
    KIT.objects.link(o); return o


def kcyl(name, x, y, r, length, m, z, axis='X', verts=40):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=length, location=(KX + x, KY + y, z)); o = bpy.context.object; o.name = name
    if axis == 'X': o.rotation_euler = (0, math.pi / 2, 0)
    elif axis == 'Y': o.rotation_euler = (math.pi / 2, 0, 0)
    o.data.materials.append(m)
    for c in list(o.users_collection): c.objects.unlink(o)
    KIT.objects.link(o); return o


def ktext(text, x, y, size=.032, m=None, z=.002):
    cu = bpy.data.curves.new('Label ' + text, 'FONT'); cu.body = text; cu.size = size; cu.extrude = .0004
    o = bpy.data.objects.new('Label ' + text, cu); o.location = (KX + x, KY + y, z); o.data.materials.append(m or whitem); KIT.objects.link(o); return o


kbox('Kit plinth', 0, 0, 2.9, 1.9, .1, mat_plinth, z=-.1)
# C1-CAM: body, grip, lens
kbox('C1-CAM body', -.95, .45, .15, .1, .095, graphite); kbox('C1-CAM grip', -1.0, .45, .04, .1, .11, graphite)
kcyl('C1-CAM lens', -.83, .45, .038, .11, graphite, .048); kcyl('C1-CAM lens glass', -.774, .45, .03, .004, lens_glass, .048)
ktext('C1-CAM', -1.03, .31); ktext('camera + lens · 1', -1.03, .27, .022)
# TRP-04: folded legs + head
for i in range(3): kcyl('TRP-04 leg', -.25, .52 + i * .035, .012, .82, graphite, .012)
kbox('TRP-04 head', .2, .555, .09, .09, .06, graphite)
ktext('TRP-04', -.62, .43); ktext('tripod + mount · 1', -.62, .39, .022)
# LGT-01 x2: softboxes
for i, (lx, nm) in enumerate(((-.85, 'C1-L1'), (-.18, 'C1-L2'))):
    kbox(nm + ' frame', lx, -.35, .6, .45, .03, graphite); kbox(nm + ' diffuser', lx, -.35, .56, .41, .005, diff, z=.03)
    ktext(nm, lx - .28, -.62); ktext('LGT-01 · softbox', lx - .28, -.66, .022)
# CAL-01: checker target
kbox('CAL-01 board', .55, -.3, .32, .42, .012, whitem)
for r in range(8):
    for c in range(6):
        if (r + c) % 2 == 0: kbox('CAL-01 square', .55 - .125 + c * .05, -.3 - .175 + r * .05, .05, .05, .002, graphite, z=.012)
ktext('CAL-01', .4, -.6); ktext('calibration target · 1', .4, -.64, .022)
# CBL-11 coiled cable
for i in range(3):
    bpy.ops.mesh.primitive_torus_add(major_radius=.09 + i * .012, minor_radius=.006, location=(KX + .58, KY + .48, .008)); t = bpy.context.object
    t.name = 'CBL-11 coil'; t.data.materials.append(graphite)
    for c in list(t.users_collection): c.objects.unlink(t)
    KIT.objects.link(t)
ktext('CBL-11', .47, .32); ktext('USB-C cable · spare', .47, .28, .022)
# manifest strip
kbox('Manifest accent', .94, .0, .006, 1.5, .002, mint)
ktext('KIT-C1-v1', .98, .62, .05, mint); ktext('6 items · return complete', .98, .56, .024)
for i, line in enumerate(['C1-CAM  ·  1', 'TRP-04  ·  1', 'LGT-01  ·  2', 'CAL-01  ·  1', 'CV-02  ·  fixed', 'C1  ·  zone']):
    ktext(line, .98, .44 - i * .07, .026)
ktext('ILLUSTRATIVE FORMS · NOT MANUFACTURER MODELS', -1.38, -.88, .02)
KIT_LIGHTS = [area('Kit key', (KX - 1.2, KY + 1.4, 3.2), (KX, KY, 0), 420, 2.5, (1, .95, .9)),
              area('Kit fill', (KX + 2.0, KY - 1.2, 2.6), (KX, KY, 0), 160, 3, (.8, .87, 1))]
for o in KIT_LIGHTS: o.visible_glossy = False

# ---------------------------------------------------------------- render + post
prefs = bpy.context.preferences.addons['cycles'].preferences
try:
    prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
    for d in prefs.devices: d.use = d.type == 'OPTIX'
    scene.cycles.device = 'GPU'
except Exception:
    scene.cycles.device = 'CPU'
scene.render.engine = 'CYCLES'
scene.cycles.samples = int(os.environ.get('PARALLAX_SAMPLES', '160'))
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.view_settings.view_transform = 'AgX'
try:
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass


def build_post():
    """Bloom-like glare for the phosphor accents and a gentle vignette."""
    try:
        ng = bpy.data.node_groups.new('P8-B post', 'CompositorNodeTree')
        scene.compositing_node_group = ng
        rl = ng.nodes.new('CompositorNodeRLayers')
        out = ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
        go = ng.nodes.new('NodeGroupOutput')
        gl = ng.nodes.new('CompositorNodeGlare')
        for k, v in (('glare_type', 'FOG_GLOW'), ('quality', 'HIGH'), ('size', 7), ('threshold', 2.6)):
            try: setattr(gl, k, v)
            except Exception: pass
        for nm, v in (('Threshold', 2.6), ('Strength', .45), ('Size', .55)):
            if nm in gl.inputs: gl.inputs[nm].default_value = v
        ng.links.new(rl.outputs['Image'], gl.inputs['Image'])
        el = ng.nodes.new('CompositorNodeEllipseMask')
        for nm, v in (('Width', .92), ('Height', .9)):
            if nm in el.inputs: el.inputs[nm].default_value = v
        bl = ng.nodes.new('CompositorNodeBlur')
        for nm, v in (('Size', (200, 200)),):
            if nm in bl.inputs:
                try: bl.inputs[nm].default_value = v
                except Exception: pass
        ng.links.new(el.outputs[0], bl.inputs[0])
        mix = ng.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
        mix.inputs['Factor'].default_value = .22
        ng.links.new(gl.outputs['Image'], mix.inputs['A'])
        inv = ng.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1
        ng.links.new(bl.outputs[0], inv.inputs[1])
        ramp2 = ng.nodes.new('ShaderNodeMath'); ramp2.operation = 'SUBTRACT'; ramp2.inputs[0].default_value = 1
        ng.links.new(inv.outputs[0], ramp2.inputs[1])
        ng.links.new(ramp2.outputs[0], mix.inputs['B'])
        ng.links.new(gl.outputs['Image'], go.inputs[0])
        return True
    except Exception as e:
        print('P8B_POST_SKIPPED', e)
        return False


POST = build_post()

# ---------------------------------------------------------------- shots
SHOTS = {
    'H01': dict(file='H01_spine_golden.png', loc=(.45, -4.7, 1.45), target=(9.2, -4.3, 2.05), lens=20, res=(2400, 1350), dof=None, interior=True,
                purpose='Hero: down the spine at golden hour, sculpture overhead, signs and stations in depth'),
    'R01': dict(file='R01_entry.png', loc=(.55, -4.65, 1.62), target=(8.2, -2.6, 1.15), lens=17, res=(2400, 1400), interior=True, purpose='Entry perspective'),
    'R02': dict(file='R02_iso_cutaway.png', loc=(-7.8, -15.6, 11.8), target=(5, -3.5, .7), ortho=14.8, res=(2400, 1666), interior=False, purpose='Isometric cutaway, studio-lit on a graphite plinth'),
    'R03': dict(file='R03_student_eye.png', loc=(3.5, -3.75, 1.2), target=(3.5, -.8, 1.02), lens=30, res=(2400, 1400), dof=(1.05, 2.0), interior=True, purpose='Student eye at CV-05, shallow depth of field'),
    'R04': dict(file='R04_capture.png', loc=(9.8, -3.72, 2.45), target=(8.35, -1.7, .95), lens=17, res=(2400, 1400), dof=(2.6, 4.0), interior=True, purpose='Controlled capture C1'),
    'R05': dict(file='R05_signal_bench.png', loc=(8.3, -4.0, 2.25), target=(8.3, -6.75, .85), lens=19, res=(2400, 1400), interior=True, purpose='Signal bench S1'),
    'R06': dict(file='R06_collaboration.png', loc=(5.6, -4.25, 1.6), target=(3.1, -6.6, .95), lens=22, res=(2400, 1400), dof=(2.6, 4.0), interior=True, purpose='Collaboration table in window light'),
    'R07': dict(file='R07_storage.png', loc=(4.55, -3.3, 1.75), target=(6.5, -1.15, 1.0), lens=19, res=(2400, 1400), interior=True, purpose='Kit storage STO-1'),
    'R09': dict(file='R09_kit_layout.png', loc=(40.0, 0.0, 6.0), target=(40.0, 0.0, 0.0), ortho=3.1, res=(2400, 1600), interior=False,
                purpose='KIT-C1-v1 laid out: every portable item with its ID, as the return check sees it'),
    'R10': dict(file='R10_sculpture.png', loc=(5.0, -3.95, 1.3), target=(6.55, -4.55, 2.68), lens=21, res=(2400, 1400), dof=(2.05, 2.8), interior=True,
                purpose='Signal-to-pixel sculpture: the analogue waveform resolving into samples'),
}


def shoot(key):
    s = SHOTS[key]
    camd = bpy.data.cameras.new('P8B ' + key); cam = bpy.data.objects.new('P8B ' + key, camd); scene.collection.objects.link(cam)
    cam.location = s['loc']
    if 'ortho' in s:
        camd.type = 'ORTHO'; camd.ortho_scale = s['ortho']
    else:
        camd.lens = s['lens']
    camd.clip_start = .05
    if s.get('dof'):
        camd.dof.use_dof = True; camd.dof.focus_distance, camd.dof.aperture_fstop = s['dof']
    cam.rotation_euler = (Vector(s['target']) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    interior(s['interior'])
    kit = key == 'R09'
    for o in KIT_LIGHTS: o.hide_render = not kit
    for gn in bpy.data.node_groups:
        if gn.name == 'P8-B post':
            for nd in gn.nodes:
                if nd.bl_idname == 'CompositorNodeGlare':
                    if 'Threshold' in nd.inputs: nd.inputs['Threshold'].default_value = 2.6 if s['interior'] else 5.0
                    else:
                        try: nd.threshold = 2.6 if s['interior'] else 5.0
                        except Exception: pass
    for o in ISO_LIGHTS: o.hide_render = s['interior'] or kit
    for o in INT_LIGHTS: o.hide_render = not s['interior']
    ground = scene.objects.get('Studio ground'); plinth = scene.objects.get('Presentation plinth')
    for o in (ground, plinth):
        if o: o.hide_render = s['interior']
    bg.inputs['Strength'].default_value = .35 if s['interior'] else .12
    scene.view_settings.exposure = -.55 if s['interior'] else 0
    for o in INTERIOR.objects:
        if o.type == 'LIGHT': o.data.energy = 38
    scene.camera = cam
    w, h = s['res']
    if PREVIEW: w, h = w // 2, h // 2
    scene.render.resolution_x, scene.render.resolution_y = w, h
    name = s['file'] if os.environ.get('PARALLAX_RESTRICTED') != '1' else s['file'].replace('.png', '_restricted.png')
    scene.render.filepath = os.path.join(OUT, name)
    bpy.ops.render.render(write_still=True)
    print('P8B_SHOT', key, scene.render.filepath)


if mode == 'shots':
    for k in shots or list(SHOTS): shoot(k)
    json.dump({'post': POST, 'shots': {k: {'file': v['file'], 'purpose': v['purpose']} for k, v in SHOTS.items()}},
              open(os.path.join(OUT, 'shot-list.json'), 'w'), indent=2)

# ---------------------------------------------------------------- A01: slow orbit of the cutaway (G17.11)
if mode == 'anim':
    interior(False)
    for o in ISO_LIGHTS: o.hide_render = False
    for o in INT_LIGHTS: o.hide_render = True
    bg.inputs['Strength'].default_value = .12
    pivot = bpy.data.objects.new('Orbit pivot', None); scene.collection.objects.link(pivot); pivot.location = (5, -3.5, .6)
    camd = bpy.data.cameras.new('A01'); camd.type = 'ORTHO'; camd.ortho_scale = 15.2
    cam = bpy.data.objects.new('A01', camd); scene.collection.objects.link(cam); cam.parent = pivot
    cam.location = (-12.8, -12.0, 11.8)
    tr = cam.constraints.new('TRACK_TO'); tr.target = pivot; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
    scene.camera = cam
    frames = int(os.environ.get('PARALLAX_FRAMES', '192'))
    scene.frame_start, scene.frame_end = 1, frames; scene.render.fps = 24
    pivot.rotation_euler = (0, 0, math.radians(-18)); pivot.keyframe_insert('rotation_euler', frame=1)
    pivot.rotation_euler = (0, 0, math.radians(42)); pivot.keyframe_insert('rotation_euler', frame=frames)
    for fc in pivot.animation_data.action.fcurves if hasattr(pivot.animation_data.action, 'fcurves') else []:
        for k in fc.keyframe_points: k.interpolation = 'BEZIER'
    scene.render.resolution_x, scene.render.resolution_y = (1600, 900) if not PREVIEW else (800, 450)
    scene.cycles.samples = int(os.environ.get('PARALLAX_SAMPLES', '48'))
    target = os.path.join(OUT, 'A01_orbit.mp4')
    try:
        ims = scene.render.image_settings
        if hasattr(ims, 'media_type'): ims.media_type = 'VIDEO'
        ims.file_format = 'FFMPEG'
        scene.render.ffmpeg.format = 'MPEG4'; scene.render.ffmpeg.codec = 'H264'
        scene.render.ffmpeg.constant_rate_factor = 'HIGH'; scene.render.ffmpeg.gopsize = 24
        scene.render.filepath = target
    except Exception as e:
        print('P8B_FFMPEG_UNAVAILABLE', e)
        seq = os.path.join(OUT, 'A01_frames'); os.makedirs(seq, exist_ok=True)
        scene.render.image_settings.file_format = 'JPEG'; scene.render.filepath = os.path.join(seq, 'f_')
    bpy.ops.render.render(animation=True)
    print('P8B_ANIM', scene.render.filepath, frames)
