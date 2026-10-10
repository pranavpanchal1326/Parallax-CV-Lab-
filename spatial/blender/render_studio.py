"""P4-D studio presentation. Procedural, reproducible; no external assets.
Run: blender -b --factory-startup -P spatial/blender/render_studio.py -- iso
Views: iso / eye / plan. Geometry comes only from lab_geometry.json.
"""
import bpy, os, sys, math, json
from mathutils import Vector
HERE=os.path.dirname(__file__)
BUILD=os.path.join(HERE,'build_blockout.py')
src=open(BUILD,encoding='utf8').read()
ns={'__file__':BUILD,'__name__':'studio'}
exec(compile(src[:src.index('# ---- lighting, world, cameras ----')],BUILD,'exec'),ns)
G,box,mat,coll,srgb= [ns[k] for k in ('G','box','mat','coll','srgb')]
scene=bpy.context.scene
view=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'iso'
C=coll('Studio detail · conceptual equipment')
A=coll('Signal to pixel · candidate artwork')
def material(name,color,metal=0,emit=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    b=m.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=srgb(color)
    b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=.38
    b.inputs['Emission Color'].default_value=srgb(color);b.inputs['Emission Strength'].default_value=emit
    return m
ink=material('Graphite alloy','202B36',.55)
oak=material('Warm ash','B89D78')
blue=material('Ultramarine enamel','3346D3',.3)
mint=material('Phosphor','6EE7C5',0,.7)
screen=material('Screen glass','101D2B',.15)
white=material('Porcelain','E7E8E3')
lime=material('Chartreuse detail','D9EF73')
def cube(name,x,y,w,d,z,h,m=ink):return box(name,x,y,w,d,z,h,m,C)
def rod(name,a,b,r=.015,m=ink,collection=C):
    a,b=Vector(a),Vector(b);delta=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=delta.length,location=(a+b)/2)
    o=bpy.context.object;o.name=name;o.rotation_euler=delta.to_track_quat('Z','Y').to_euler();o.data.materials.append(m)
    for c in list(o.users_collection):c.objects.unlink(o)
    collection.objects.link(o);return o
def label(name,text,x,y,z,size=.1,m=ink,wall=False):
    curve=bpy.data.curves.new(name,'FONT');curve.body=text;curve.size=size;curve.extrude=.0005
    o=bpy.data.objects.new(name,curve);C.objects.link(o);o.location=(x,-y,z);o.data.materials.append(m)
    if wall:o.rotation_euler=(math.pi/2,0,0)
    return o
for o in list(scene.objects):
    if '_seat' in o.name:bpy.data.objects.remove(o,do_unlink=True)
    elif o.name.endswith('_top'):
        o.data.materials.clear();o.data.materials.append(oak if o.name.startswith(('COL','FAC')) else white)
    elif '_leg' in o.name:
        o.data.materials.clear();o.data.materials.append(ink)
    elif o.name.startswith('Zone_'):
        zid=o.name[5:];colors={'CMP':'D5DAE5','C1':'252D36','SPN':'E9E5DC','S1':'CFD8D8','COL':'DED9C7','FAC':'DED9C7','STO':'D5DAE5'}
        o.data.materials.clear();o.data.materials.append(material('Floor '+zid,colors[zid]))
def chair(cx,cy,north):
    cube('Upholstered seat',cx-.23,cy-.22,.46,.44,.43,.065,blue)
    by=cy+.19 if north else cy-.24
    cube('Mesh back',cx-.22,by,.44,.05,.53,.34,ink)
    rod('Gas lift',(cx,-cy,.10),(cx,-cy,.44),.027)
    for a in range(5):
        t=a*math.tau/5;px=cx+.24*math.cos(t);py=-cy+.24*math.sin(t)
        rod('Five star base',(cx,-cy,.12),(px,py,.065),.018)
        rod('Caster',(px,py,.025),(px,py,.075),.028)
    for sx in (-.26,.24):
        cube('Armrest',cx+sx,cy-.12,.035,.24,.62,.025)
for f in G['furniture']:
    if f.get('seat') and not f.get('accessible'):
        for k in range(3 if f['type']=='bench' else 1):
            cx=f['x']+.75+k if f['type']=='bench' else f['x']+f['w']/2
            cy=f['y']+f['d']+.33 if f['seat']=='S' else f['y']-.33
            chair(cx,cy,f['seat']=='S')
    if f['id'].startswith('CV-') or f['id']=='FAC-1':
        x,y,w,d,h=[f[k] for k in ('x','y','w','d','h')]
        if f.get('seat')=='E':
            cube(f['id']+' keyboard',x+.36,y+.46,.20,.47,h,.018)
            cube(f['id']+' monitor foot',x+.08,y+.53,.18,.34,h,.025)
            cube(f['id']+' monitor riser',x+.13,y+.65,.04,.08,h,.15)
        else:
            cube(f['id']+' keyboard',x+w/2-.23,y+.42,.46,.16,h,.018)
            cube(f['id']+' monitor foot',x+w/2-.14,y+.12,.28,.16,h,.025)
            cube(f['id']+' monitor riser',x+w/2-.02,y+.16,.04,.04,h,.15)
            if f['id'].startswith('CV'):
                face=scene.objects.get(f['id']+'_screen');face.data.materials.clear();face.data.materials.append(screen)
                for j in range(22):
                    px=x+w/2-.27+j*.024;pz=h+.31+.085*math.sin(j*.47)
                    cube(f['id']+' example trace',px,y+.115,.015,.007,pz,.012,mint)
        label(f['id']+' identity',f['id'],x+.04,y+d-.06,h+.004,.065)
for i in range(4):chair(3.4+i*.6,5.72,False)
# Bench instruments are illustrative forms, not manufacturer-verified inventories.
for i in range(3):
    x=6.96+i*.95
    cube('S1 oscilloscope housing',x,6.65,.53,.28,.9,.28,white)
    cube('S1 instrument display',x+.03,6.635,.32,.015,.94,.18,screen)
    for j in range(16):cube('S1 example waveform',x+.04+j*.018,6.626,.012,.007,1.025+.04*math.sin(j*.8),.01,mint)
    for j in range(3):rod('Instrument dial',(x+.42,-6.62,.96+j*.07),(x+.42,-6.645,.96+j*.07),.02,ink)
    cube('Signal generator',x+.60,6.7,.25,.22,.9,.16,ink)
    label('Bench identifier','S1 / '+str(i+1),x,6.43,.905,.065)
# Real tripod legs, lens and softbox frame within declared equipment footprints.
for f in G['furniture']:
    if f['type'] not in ('light','tripod'):continue
    cx,cy=f['x']+f['w']/2,f['y']+f['d']/2
    for t in (0,math.tau/3,2*math.tau/3):
        rod(f['id']+' leg',(cx,-cy,.82),(cx+.27*math.cos(t),-cy+.27*math.sin(t),.035),.017)
    if f['type']=='tripod':
        rod('Camera lens',(cx+.10,-cy,1.57),(cx+.24,-cy,1.57),.057)
        cube('Camera viewfinder',cx-.08,cy-.05,.07,.10,1.64,.06)
    else:
        cube('Softbox edge',f['x']-.005,cy-.045,.61,.08,1.34,.47,ink)
        cube('Diffuser',f['x']+.015,cy-.055,.57,.015,1.36,.43,white)
cube('Calibration target',9.45,1.77,.2,.26,.75,.22,white)
for i in range(4):
    for j in range(4):
        if (i+j)%2==0:cube('Target checker',9.444,1.78+j*.055,.007,.055,.78+i*.045,.045)
# Storage expresses three identifiable kits; doors remain closed in this view.
for i in range(3):
    y=.35+i*.66
    cube('Kit cabinet seam',6.393,y,.01,.59,.06,1.76,white)
    cube('Kit cabinet handle',6.36,y+.08,.035,.025,.9,.20)
    label('Kit label','KIT 0'+str(i+1),6.43,y+.08,1.91,.075)
# Wall brand, acoustic battens, matched zone identifiers.
for i in range(38):cube('Acoustic batten',.1+i*.165,.004,.035,.035,1.4,1.48,oak)
label('Lab wordmark','PARALLAX',.35,.055,2.36,.38,ink,True)
label('Wall subtitle','SIGNAL  /  COMPUTER VISION',.37,.058,2.13,.105,ink,True)
for text,x,y in [('01 / COMPUTE',.24,1.96),('02 / CAPTURE',7.4,3.66),('03 / SIGNAL',7.0,6.23),('04 / DISCUSS',3.25,6.88)]:
    label(text,text,x,y,.015,.10,white if 'CAPTURE' in text else ink)
cube('Demonstration frame',2.28,6.865,1.69,.07,.98,1.04,ink)
cube('Demonstration glass',2.32,6.852,1.61,.012,1.02,.96,screen)
label('Demo title','PERCEPTION / 01',2.40,6.84,1.81,.10,mint,True)
for i in range(18):cube('Demo sample',2.43+i*.078,6.836,.040,.005,1.25+.20*math.sin(i*.38),.06,mint)
# High-level hanging installation: analogue waveform resolves into digital samples.
for i in range(44):
    x=.85+i*.125;h=.13+.30*(.5+.5*math.sin(i*.30))
    box('Analogue fin',x,4.50,.028,.30,2.98-h,h,blue,A)
for i in range(10):
    for j in range(3):
        x=6.55+i*.27;y=4.31+j*.27;z=2.58+.07*math.sin(i*.5+j)
        box('Digital sample',x,y,.13,.13,z,.13,mint if (i+j)%3 else lime,A)
        rod('Suspension',(x+.065,-y-.065,z+.13),(x+.065,-y-.065,2.98),.004,ink,A)
for f in G['accessible_clear_floors']:
    # Thin corner marks only, leaving the dedicated floor physically empty.
    for x,y in [(f['x'],f['y']),(f['x']+f['w']-.13,f['y']),(f['x'],f['y']+f['d']-.018),(f['x']+f['w']-.13,f['y']+f['d']-.018)]:
        cube('Access floor corner',x,y,.13,.018,.007,.002,blue)
label('Access label','CV-04 / CLEAR APPROACH',.90,3.56,.016,.07,blue)
# Replace foundation safety cubes with recognisable schematic devices.
red=material('Safety red','B42318')
green=material('Safety green','1C7148')
for s in G['safety']:
    old=scene.objects.get(s['id'])
    if old:bpy.data.objects.remove(old,do_unlink=True)
    x,y=s['x'],s['y'];side=1 if x<5 else -1
    if s['type']=='extinguisher':
        rod(s['id']+' cylinder',(x,-y,.48),(x,-y,.89),.065,red)
        rod(s['id']+' valve',(x,-y,.89),(x,-y,.96),.02)
        cube(s['id']+' handle',x-.05,y-.025,.1,.05,.955,.018)
        rod(s['id']+' hose',(x+side*.05,-y,.9),(x+side*.095,-y,.62),.009)
    elif s['type']=='exitsign':
        cube(s['id']+' sign',x-.025,y-.18,.05,.36,2.24,.18,green)
        o=label(s['id']+' text','EXIT',x+side*.029,y+side*.14,2.27,.085,white)
        o.rotation_euler=(math.pi/2,0,side*math.pi/2)
    elif s['type']=='cctv':
        cube(s['id']+' camera',x-.06,y-.04,.12,.08,2.3,.07,white)
        rod(s['id']+' lens',(x,-y-.04,2.335),(x,-y-.058,2.335),.025)
    else:
        z=s.get('mount',1.1)
        cube(s['id']+' box',x-.035,y-.055,.07,.11,z-.055,.11,green if s['type']=='firstaid' else white)
        if s['type']=='firstaid':
            cube(s['id']+' cross horizontal',x+side*.04-.01,y-.036,.02,.072,z-.009,.018,white)
            cube(s['id']+' cross vertical',x+side*.04-.01,y-.009,.02,.018,z-.036,.072,white)
        else:rod(s['id']+' button',(x,-y,z),(x+side*.045,-y,z),.022,red)
for o in list(scene.objects):
    if o.type=='MESH' and not o.name.startswith(('Zone','Floor')):
        b=o.modifiers.new('Edge highlight','BEVEL');b.width=.005;b.segments=2
        b.limit_method='ANGLE'
world=bpy.data.worlds.new('Studio environment');scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=srgb('DBE1EB')
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.35
def light(name,loc,power,size,target):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=loc
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
light('Large studio key',(-3,-5,10),1800,8,(4,-3,0))
light('Warm fill',(8,-8,6),1100,7,(4,-3,1))
light('North wash',(3,1,5),850,5,(4,-3,1))
light('Capture soft light',(8.4,-.8,2.1),90,1,(9.55,-1.9,.9))
# Pedestal and surround make the isometric a deliberate exhibition object.
cube('Presentation plinth',-.25,-.25,10.5,7.5,-.3,.24,ink)
cube('Studio ground',-200,-200,400,400,-.34,.02,material('Backdrop','CCD1DB'))
camd=bpy.data.cameras.new('Studio camera');cam=bpy.data.objects.new('Studio camera',camd);scene.collection.objects.link(cam)
target=(5,-3.5,.7)
if view=='eye':cam.location=(.9,-5.05,1.68);target=(6.4,-1.5,1.35);camd.lens=21
elif view=='plan':cam.location=(5,-3.5,18);target=(5,-3.5,0);camd.type='ORTHO';camd.ortho_scale=12.3
else:cam.location=(-7.8,-15.6,11.8);camd.type='ORTHO';camd.ortho_scale=14.8
cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=int(os.environ.get('PARALLAX_SAMPLES','24'));scene.cycles.use_denoising=True
scene.render.resolution_x=1800;scene.render.resolution_y=1250 if view!='eye' else 1050
scene.view_settings.view_transform='AgX'
scene.render.filepath=os.path.join(ns['RENDERS'],'studio_'+view+'.png')
if view=='iso':
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ns['ROOT'],'spatial','exports','lab_studio.blend'))
    bpy.ops.object.select_all(action='DESELECT')
    for o in list(scene.objects):
        if o.type=='FONT':
            bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
    for o in scene.objects:
        if o.type=='MESH' and o.name!='Studio ground':o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(ns['EXPORTS'],'lab_studio.glb'),export_format='GLB',use_selection=True)
bpy.ops.render.render(write_still=True)
print('STUDIO_DONE',view,scene.render.filepath)
