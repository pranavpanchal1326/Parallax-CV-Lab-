"""Concept renders for PARALLAX, built on the same geometry as the blockout.

Reuses the geometry section of build_blockout.py (everything before the lighting
block), then adds presentation detail: bevels, chairs, lit screens, area lighting,
and the candidate signal-to-pixel ceiling sculpture (CAND04).

Run one view per call (Cycles is slow on CPU):
  blender -b --factory-startup -P spatial/blender/render_hero.py -- iso
  blender -b --factory-startup -P spatial/blender/render_hero.py -- eye

Outputs: spatial/renders/hero_iso.png, spatial/renders/hero_eye.png
These are concept renders. The sculpture is a candidate (CAND04), not a decision.
"""
import math
import os
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build_blockout.py")
VIEW = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "iso"
SAMPLES = int(os.environ.get("PARALLAX_SAMPLES", "96"))

# ---- 1. geometry: run build_blockout.py up to its lighting block ----
src = open(BUILD, encoding="utf8").read()
cut = src.index("# ---- lighting, world, cameras ----")
ns = {"__file__": BUILD, "__name__": "parallax_build"}
exec(compile(src[:cut], BUILD, "exec"), ns)
G, box, mat, PAL, srgb, coll = ns["G"], ns["box"], ns["mat"], ns["PAL"], ns["srgb"], ns["coll"]
C_FURN = ns["C_FURN"]
scene = bpy.context.scene
D = G["meta"]["room"]["depth"]
W = G["meta"]["room"]["width"]


def emissive(name, hexcol, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(hexcol)
    b.inputs["Emission Color"].default_value = srgb(hexcol)
    b.inputs["Emission Strength"].default_value = strength
    b.inputs["Roughness"].default_value = 0.4
    return m


# ---- 2. chairs instead of seat blocks ----
for o in [o for o in scene.objects if "_seat" in o.name]:
    bpy.data.objects.remove(o, do_unlink=True)
chair_mat, frame_mat = mat("seat"), mat("ink")


def chair(cx, cy, facing_north):
    """cx, cy = plan centre of a 0.5 m seat; back on the side away from the desk."""
    box("Chair_seat", cx - 0.22, cy - 0.22, 0.44, 0.44, 0.44, 0.05, chair_mat, C_FURN)
    by = cy + 0.2 if facing_north else cy - 0.25
    box("Chair_back", cx - 0.2, by, 0.4, 0.05, 0.6, 0.32, chair_mat, C_FURN)
    box("Chair_post", cx - 0.02, cy - 0.02, 0.04, 0.04, 0.05, 0.39, frame_mat, C_FURN)
    box("Chair_base", cx - 0.2, cy - 0.2, 0.4, 0.4, 0.0, 0.04, frame_mat, C_FURN)


for f in G["furniture"]:
    if not f.get("seat"):
        continue
    n = 3 if f["type"] == "bench" else 1
    for k in range(n):
        x0 = f["x"] + 0.5 + k * 1.0 if f["type"] == "bench" else f["x"] + f["w"] / 2 - 0.25
        y0 = f["y"] + f["d"] + 0.08 if f["seat"] == "S" else f["y"] - 0.58
        chair(x0 + 0.25, y0 + 0.25, facing_north=(f["seat"] == "S"))
for k in range(4):
    chair(3.65 + k * 0.45, 5.7, facing_north=False)

# ---- 3. lit screens ----
screen_mat = emissive("M_screen", "3346D3", 1.6)
for o in scene.objects:
    if o.name.endswith("_screen"):
        o.data.materials.clear()
        o.data.materials.append(screen_mat)
display = scene.objects.get("COL-D")
if display:
    display.data.materials.clear()
    display.data.materials.append(emissive("M_display", "151922", 0.0))
    box("COL-D_glow", 2.33, 6.88, 1.59, 0.02, 1.03, 0.94, emissive("M_display_img", "6EE7C5", 0.9), C_FURN)

# ---- 4. candidate ceiling sculpture: signal -> samples -> pixels (CAND04) ----
C_ART = coll("Sculpture (candidate CAND04)")
slat = emissive("M_slat", "3346D3", 2.2)
pix = [emissive(f"M_pix{i}", "6EE7C5", s) for i, s in enumerate((0.3, 0.9, 1.8, 3.0))]
rod = mat("ink")
y_mid = 4.65
for i in range(46):
    x = 0.9 + i * 0.12
    h = 0.12 + 0.38 * (0.5 + 0.5 * math.sin(2 * math.pi * x / 2.6))
    box("Slat", x, y_mid - 0.16, 0.035, 0.32, 2.98 - h, h, slat, C_ART)
for i in range(9):
    for j in range(3):
        x, y = 6.6 + i * 0.3, y_mid - 0.35 + j * 0.3
        v = 0.5 + 0.5 * math.sin(2 * math.pi * x / 2.6 + j * 0.8)
        box("Pixel", x, y, 0.2, 0.2, 2.55, 0.2, pix[min(3, int(v * 4))], C_ART)
        box("Rod", x + 0.09, y + 0.09, 0.02, 0.02, 2.75, 0.25, rod, C_ART)

# ---- 4b. stronger zone tints for presentation (same zones as the plan) ----
ZONE_HERO = {"CMP": "CDD5FA", "COL": "D9E978", "S1": "C6B5F0", "FAC": "E7E2D6", "STO": "E7E2D6", "SPN": "F6F3EC"}
for o in scene.objects:
    zid = o.name.replace("Zone_", "") if o.name.startswith("Zone_") else None
    if zid in ZONE_HERO:
        m = bpy.data.materials.new(f"M_zone_{zid}")
        m.use_nodes = True
        m.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = srgb(ZONE_HERO[zid])
        m.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.55
        o.data.materials.clear()
        o.data.materials.append(m)

# ---- 5. bevels for soft highlights ----
for o in scene.objects:
    if o.type == "MESH" and not o.name.startswith(("Zone_", "Floor")):
        bev = o.modifiers.new("Bevel", "BEVEL")
        bev.width = 0.006
        bev.segments = 2
        bev.limit_method = "ANGLE"

# ---- 6. light & world ----
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = srgb("FBF8F1")
bg.inputs["Strength"].default_value = 1.0

sun_d = bpy.data.lights.new("Sun", "SUN")
sun_d.energy = 2.2
sun_d.angle = math.radians(12)
sun = bpy.data.objects.new("Sun", sun_d)
scene.collection.objects.link(sun)
sun.rotation_euler = (math.radians(48), math.radians(8), math.radians(-30))

for zx, zy, zw, zd, e in ((0.4, 0.4, 5.6, 3.2, 260), (0.4, 4.0, 9.2, 1.3, 120), (2.2, 5.6, 4.0, 1.2, 140), (6.6, 5.6, 3.2, 1.2, 160)):
    ld = bpy.data.lights.new("Panel", "AREA")
    ld.shape = "RECTANGLE"
    ld.size, ld.size_y = zw, zd
    ld.energy = e
    lo = bpy.data.objects.new("Panel", ld)
    scene.collection.objects.link(lo)
    lo.location = (zx + zw / 2, -(zy + zd / 2), 2.95)
c1 = bpy.data.lights.new("C1_key", "AREA")
c1.size = 0.6
c1.energy = 120
c1.color = (0.9, 1.0, 0.97)
c1o = bpy.data.objects.new("C1_key", c1)
scene.collection.objects.link(c1o)
c1o.location = (8.4, -1.9, 1.7)
c1o.rotation_euler = (0, math.radians(90), 0)

# ---- 7. camera ----
target = bpy.data.objects.new("Target", None)
scene.collection.objects.link(target)
cam_d = bpy.data.cameras.new("Cam")
cam = bpy.data.objects.new("Cam", cam_d)
scene.collection.objects.link(cam)
tr = cam.constraints.new("TRACK_TO")
tr.target = target
tr.track_axis = "TRACK_NEGATIVE_Z"
tr.up_axis = "UP_Y"
if VIEW == "eye":
    cam.location = (1.0, -6.55, 1.55)
    target.location = (6.8, -1.6, 1.45)
    cam_d.lens = 19
    cam_d.dof.use_dof = True
    cam_d.dof.focus_object = scene.objects.get("CV-06_top")
    cam_d.dof.aperture_fstop = 5.6
    res = (2400, 1350)
else:
    cam_d.type = "ORTHO"
    cam_d.ortho_scale = 14.2
    cam.location = (-6.5, -16.5, 11.5)
    target.location = (W / 2, -D / 2, 0.8)
    res = (2400, 1470)
scene.camera = cam

# ---- 8. render ----
scene.render.engine = "CYCLES"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
try:
    scene.cycles.device = "GPU"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.get_devices()
    if not any(d.use for d in prefs.devices):
        scene.cycles.device = "CPU"
except Exception:
    scene.cycles.device = "CPU"
scene.render.resolution_x, scene.render.resolution_y = res
scene.render.film_transparent = False
try:
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
except TypeError:
    scene.view_settings.view_transform = "Filmic"
out = os.path.join(ns["RENDERS"], f"hero_{VIEW}.png")
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print("HERO_DONE", out, scene.cycles.device, SAMPLES)
