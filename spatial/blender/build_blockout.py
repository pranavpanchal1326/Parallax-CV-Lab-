"""Build the PARALLAX lab blockout from spatial/lab_geometry.json.

Run headless:
  blender -b --factory-startup -P spatial/blender/build_blockout.py

Outputs (relative to the project root):
  spatial/renders/blockout_iso.png      isometric cutaway (shot R02)
  spatial/renders/blockout_entry.png    eye-level view from the entry (shot R01)
  spatial/exports/lab_blockout.glb      interactive export test
  spatial/exports/blockout_stats.json   triangle count, object count, file size
JSON uses x east / y south; Blender uses x east / y north, so y is negated.
"""
import json
import math
import os

import bpy
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
G = json.load(open(os.path.join(ROOT, "spatial", "lab_geometry.json"), encoding="utf8"))
RENDERS = os.path.join(ROOT, "spatial", "renders")
EXPORTS = os.path.join(ROOT, "spatial", "exports")
os.makedirs(RENDERS, exist_ok=True)
os.makedirs(EXPORTS, exist_ok=True)

ROOM = G["meta"]["room"]
W, D, H, T = ROOM["width"], ROOM["depth"], ROOM["height"], ROOM["wall"]
CUT = 1.0  # cutaway height for the south and west walls (G15.05)

# Atlas+ palette (Phase 3 Direction v1)
PAL = {
    "paper": "F4F1E9", "surface": "FFFFFF", "surface2": "EAE6DC", "ink": "20232B",
    "wall": "E9E5DB", "accentSoft": "E6E9FF", "accent": "3346D3", "accent2": "7759C9",
    "marker": "D9EF73", "instBg": "151922", "instAccent": "6EE7C5", "seat": "555B67",
    "danger": "B42318", "ok": "1C7148",
}
ZONE_COL = {"CMP": "accentSoft", "STO": "surface2", "C1": "instBg", "SPN": "paper",
            "FAC": "surface2", "COL": "marker", "S1": "accent2"}
FURN_COL = {"desk": "surface", "cabinet": "surface2", "backdrop": "ink", "table": "surface",
            "light": "instAccent", "tripod": "ink", "display": "ink", "bench": "surface",
            "partition": "ink"}


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0]


_mats = {}


def mat(name, emission=0.0):
    key = (name, emission)
    if key in _mats:
        return _mats[key]
    m = bpy.data.materials.new(f"M_{name}")
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = srgb(PAL[name])
    bsdf.inputs["Roughness"].default_value = 0.8
    if emission:
        bsdf.inputs["Emission Color"].default_value = srgb(PAL[name])
        bsdf.inputs["Emission Strength"].default_value = emission
    m.diffuse_color = srgb(PAL[name])
    _mats[key] = m
    return m


def coll(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def box(name, x, y, w, d, z0, h, material, collection):
    """Axis-aligned box from JSON plan coordinates (x, y = north-west corner)."""
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.active_object
    o.name = name
    o.scale = (w, d, h)
    o.location = (x + w / 2, -(y + d / 2), z0 + h / 2)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(material)
    for c in o.users_collection:
        c.objects.unlink(o)
    collection.objects.link(o)
    return o


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
C_ARCH, C_ZONE, C_FURN, C_SAFE = coll("Architecture"), coll("Zones"), coll("Furniture"), coll("Safety")

# ---- floor, zones ----
box("Floor", -T, -T, W + 2 * T, D + 2 * T, -0.05, 0.05, mat("paper"), C_ARCH)
for z in G["zones"]:
    box(f"Zone_{z['id']}", z["x"] + 0.02, z["y"] + 0.02, z["w"] - 0.04, z["d"] - 0.04, 0.0, 0.004,
        mat(ZONE_COL[z["id"]]), C_ZONE)

# ---- walls with openings ----
open_by_wall = {}
for o in G["openings"]:
    open_by_wall.setdefault(o["wall"], []).append(o)


def wall_run(side):
    """Return wall segments for one side as (x, y, w, d, z0, h)."""
    length = W if side in "NS" else D
    height = CUT if side in "SW" else H
    cuts = sorted(open_by_wall.get(side, []), key=lambda o: o["from"])
    segs, pos = [], 0.0
    for o in cuts:
        if o["from"] > pos:
            segs.append((pos, o["from"], 0.0, height))
        top = 2.1
        if o["type"] == "window":
            segs.append((o["from"], o["to"], 0.0, min(0.9, height)))
        if height > top:
            segs.append((o["from"], o["to"], top, height - top))
        pos = o["to"]
    if pos < length:
        segs.append((pos, length, 0.0, height))
    out = []
    for a, b, z0, h in segs:
        if side == "N":
            out.append((a, -T, b - a, T, z0, h))
        elif side == "S":
            out.append((a, D, b - a, T, z0, h))
        elif side == "W":
            out.append((-T, a, T, b - a, z0, h))
        else:
            out.append((W, a, T, b - a, z0, h))
    return out


for side in "NSEW":
    for i, s in enumerate(wall_run(side)):
        box(f"Wall_{side}{i}", *s, mat("wall"), C_ARCH)
box("Corner_NW", -T, -T, T, T, 0, H, mat("wall"), C_ARCH)
box("Corner_NE", W, -T, T, T, 0, H, mat("wall"), C_ARCH)

# ---- furniture ----
for f in G["furniture"]:
    h = f.get("h", 0.75)
    t = f["type"]
    if t in ("desk", "table", "bench"):
        box(f"{f['id']}_top", f["x"], f["y"], f["w"], f["d"], h - 0.04, 0.04, mat(FURN_COL[t]), C_FURN)
        for lx, ly in ((0.05, 0.05), (f["w"] - 0.09, 0.05), (0.05, f["d"] - 0.09), (f["w"] - 0.09, f["d"] - 0.09)):
            box(f"{f['id']}_leg", f["x"] + lx, f["y"] + ly, 0.04, 0.04, 0, h - 0.04, mat("seat"), C_FURN)
        if f.get("seat") and not f.get("accessible"):
            n = 3 if t == "bench" else 1
            for k in range(n):
                cx = f["x"] + 0.5 + k * 1.0 if t == "bench" else f["x"] + f["w"] / 2 - 0.25
                cy = f["y"] + f["d"] + 0.08 if f["seat"] == "S" else f["y"] - 0.58
                box(f"{f['id']}_seat{k}", cx, cy, 0.5, 0.5, 0, 0.46, mat("seat"), C_FURN)
        if t == "desk" and f["id"].startswith("CV"):
            if f.get("seat") == "E":
                box(f"{f['id']}_screen", f["x"] + 0.12, f["y"] + f["d"] / 2 - 0.3, 0.03, 0.6, h + 0.12, 0.38, mat("ink"), C_FURN)
            else:
                box(f"{f['id']}_screen", f["x"] + f["w"] / 2 - 0.3, f["y"] + 0.08, 0.6, 0.03, h + 0.12, 0.38, mat("ink"), C_FURN)
    elif t == "light":
        box(f"{f['id']}_stand", f["x"] + 0.27, f["y"] + 0.27, 0.06, 0.06, 0, h, mat("ink"), C_FURN)
        box(f"{f['id']}_panel", f["x"], f["y"] + 0.2, f["w"], 0.06, h - 0.45, 0.45, mat("instAccent", 2.0), C_FURN)
    elif t == "tripod":
        box(f"{f['id']}_mast", f["x"] + 0.28, f["y"] + 0.28, 0.04, 0.04, 0, h, mat("ink"), C_FURN)
        box(f"{f['id']}_camera", f["x"] + 0.18, f["y"] + 0.2, 0.24, 0.2, h, 0.14, mat("ink"), C_FURN)
    else:
        box(f["id"], f["x"], f["y"], f["w"], f["d"], 0 if t != "display" else 1.0, h, mat(FURN_COL[t]), C_FURN)

# ---- safety markers (wall-mounted blocks) ----
SAFE_COL = {"extinguisher": "danger", "firstaid": "ok", "epo": "danger", "callpoint": "danger",
            "cctv": "ink", "exitsign": "ok"}
for s in G["safety"]:
    z = 2.3 if s["type"] in ("cctv", "exitsign") else (s["mount"] - 0.08 if "mount" in s else s.get("mount_top", 1.2) - 0.16)
    box(s["id"], s["x"] - 0.05, s["y"] - 0.05, 0.1, 0.1, z, 0.16, mat(SAFE_COL[s["type"]]), C_SAFE)

# ---- lighting, world, cameras ----
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = srgb(PAL["paper"])
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.9

sun_data = bpy.data.lights.new("Sun", "SUN")
sun_data.energy = 3.0
sun = bpy.data.objects.new("Sun", sun_data)
scene.collection.objects.link(sun)
sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(-35))

target = bpy.data.objects.new("Target", None)
scene.collection.objects.link(target)
target.location = (W / 2, -D / 2, 0.6)


def camera(name, loc, ortho=None, lens=24):
    cd = bpy.data.cameras.new(name)
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    else:
        cd.lens = lens
    cam = bpy.data.objects.new(name, cd)
    scene.collection.objects.link(cam)
    cam.location = loc
    tr = cam.constraints.new("TRACK_TO")
    tr.target = target
    tr.track_axis = "TRACK_NEGATIVE_Z"
    tr.up_axis = "UP_Y"
    return cam


cam_iso = camera("Cam_R02_iso", (-7.0, -17.0, 13.0), ortho=15.5)
cam_entry = camera("Cam_R01_entry", (0.7, -4.7, 1.6), lens=18)

engine_used = None
for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "BLENDER_WORKBENCH"):
    try:
        scene.render.engine = eng
        engine_used = eng
        break
    except TypeError:
        continue
scene.render.resolution_x = 1800
scene.render.resolution_y = 1100
scene.render.film_transparent = False
scene.view_settings.view_transform = "Standard"


def render(cam, name):
    scene.camera = cam
    scene.render.filepath = os.path.join(RENDERS, name)
    bpy.ops.render.render(write_still=True)


render(cam_iso, "blockout_iso.png")
cam_entry.constraints["Track To"].target = None
cam_entry.constraints.remove(cam_entry.constraints["Track To"])
cam_entry.rotation_euler = (math.radians(84), 0, math.radians(-88))
render(cam_entry, "blockout_entry.png")

# ---- export test ----
glb = os.path.join(EXPORTS, "lab_blockout.glb")
bpy.ops.object.select_all(action="DESELECT")
for o in scene.objects:
    if o.type == "MESH":
        o.select_set(True)
bpy.ops.export_scene.gltf(filepath=glb, export_format="GLB", use_selection=True)

tris = 0
meshes = [o for o in scene.objects if o.type == "MESH"]
dg = bpy.context.evaluated_depsgraph_get()
for o in meshes:
    me = o.evaluated_get(dg).to_mesh()
    me.calc_loop_triangles()
    tris += len(me.loop_triangles)
    o.evaluated_get(dg).to_mesh_clear()

stats = {
    "engine": engine_used,
    "blender": bpy.app.version_string,
    "geometry_revision": G["meta"]["revision"],
    "mesh_objects": len(meshes),
    "triangles": tris,
    "glb_bytes": os.path.getsize(glb),
    "budget_triangles": 150000,
    "budget_bytes": 5 * 1024 * 1024,
}
json.dump(stats, open(os.path.join(EXPORTS, "blockout_stats.json"), "w"), indent=2)
print("BLOCKOUT_STATS", json.dumps(stats))
