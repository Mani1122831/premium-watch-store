import bpy
import math

# -------------------------------------------------------------
# TITANOVA ATELIER - P006 TITANOVA PEARL SILVER 3D ASSEMBLY
# Product-Specific 10-Component Exploded View & Animation
# -------------------------------------------------------------

def create_p006_assembly():
    # Clear existing mesh objects in scene (preserve lights/cameras or re-create)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Unit settings: Metric (meters/millimeters)
    bpy.context.scene.unit_settings.system = 'METRIC'
    bpy.context.scene.unit_settings.scale_length = 0.001 # 1 Blender Unit = 1 mm

    # Colors and Dimensions (Pearl Silver Women's 36mm luxury watch)
    R_CASE = 18.0      # 36mm diameter
    R_BEZEL = 17.2
    R_DIAL = 14.8
    R_CRYSTAL = 17.0
    R_MOV = 14.2
    H_CASE = 4.5

    # ---------------------------------------------------------
    # MATERIALS DEFINITION
    # ---------------------------------------------------------
    def create_material(name, base_color, metallic=0.0, roughness=0.1, transmission=0.0, ior=1.45):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            # Blender 4+ / 5+ socket names
            if "Base Color" in bsdf.inputs:
                bsdf.inputs["Base Color"].default_value = base_color
            if "Metallic" in bsdf.inputs:
                bsdf.inputs["Metallic"].default_value = metallic
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = roughness
            if "Transmission Weight" in bsdf.inputs:
                bsdf.inputs["Transmission Weight"].default_value = transmission
            elif "Transmission" in bsdf.inputs:
                bsdf.inputs["Transmission"].default_value = transmission
            if "IOR" in bsdf.inputs:
                bsdf.inputs["IOR"].default_value = ior
        return mat

    mat_steel = create_material("Steel_316L_Polished", (0.85, 0.86, 0.88, 1.0), metallic=0.95, roughness=0.08)
    mat_steel_brushed = create_material("Steel_316L_Brushed", (0.80, 0.81, 0.83, 1.0), metallic=0.90, roughness=0.25)
    mat_mop = create_material("Mother_Of_Pearl_Iridescent", (0.92, 0.94, 0.96, 1.0), metallic=0.10, roughness=0.15)
    mat_sapphire = create_material("Sapphire_Crystal_AR", (0.95, 0.97, 1.0, 1.0), metallic=0.0, roughness=0.02, transmission=0.95, ior=1.77)
    mat_gold = create_material("Gold_Movement_Accent", (0.95, 0.78, 0.25, 1.0), metallic=0.92, roughness=0.12)
    mat_ruby = create_material("Synthetic_Ruby_Bearing", (0.85, 0.05, 0.15, 1.0), metallic=0.0, roughness=0.05, transmission=0.80, ior=1.76)
    mat_blued = create_material("Blued_Steel_Seconds", (0.08, 0.22, 0.65, 1.0), metallic=0.85, roughness=0.10)
    mat_diamond = create_material("Diamond_Hour_Marker", (1.0, 1.0, 1.0, 1.0), metallic=0.0, roughness=0.01, transmission=0.92, ior=2.42)
    mat_mesh = create_material("Milanese_Mesh_Silver", (0.82, 0.83, 0.85, 1.0), metallic=0.95, roughness=0.20)

    # ---------------------------------------------------------
    # 10 SEPARATE OBJECTS (Vertical Exploded Layout)
    # Exploded Z positions vs Assembled Z positions (in mm)
    # ---------------------------------------------------------
    # 1. Crystal (Top)
    bpy.ops.mesh.primitive_cylinder_add(radius=R_CRYSTAL, depth=1.2, vertices=64, location=(0, 0, 0))
    obj_crystal = bpy.context.active_object
    obj_crystal.name = "1_Crystal"
    obj_crystal.data.materials.append(mat_sapphire)

    # 2. Bezel
    bpy.ops.mesh.primitive_torus_add(major_radius=R_BEZEL - 0.8, minor_radius=0.8, major_segments=64, minor_segments=24, location=(0, 0, 0))
    obj_bezel = bpy.context.active_object
    obj_bezel.name = "2_Bezel"
    obj_bezel.data.materials.append(mat_steel)

    # 6. Seconds Hand
    bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=R_DIAL * 0.95, vertices=16, location=(0, R_DIAL * 0.40, 0))
    obj_sec_hand = bpy.context.active_object
    obj_sec_hand.name = "6_Seconds_Hand"
    obj_sec_hand.rotation_euler = (math.radians(90), 0, 0)
    obj_sec_hand.data.materials.append(mat_blued)

    # 5. Minute Hand
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, R_DIAL * 0.42, 0))
    obj_min_hand = bpy.context.active_object
    obj_min_hand.name = "5_Minute_Hand"
    obj_min_hand.scale = (0.7, R_DIAL * 0.85, 0.3)
    obj_min_hand.data.materials.append(mat_steel)

    # 4. Hour Hand
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, R_DIAL * 0.30, 0))
    obj_hour_hand = bpy.context.active_object
    obj_hour_hand.name = "4_Hour_Hand"
    obj_hour_hand.scale = (0.9, R_DIAL * 0.58, 0.35)
    obj_hour_hand.data.materials.append(mat_steel)

    # 3. Dial (Mother of Pearl)
    bpy.ops.mesh.primitive_cylinder_add(radius=R_DIAL, depth=0.6, vertices=64, location=(0, 0, 0))
    obj_dial = bpy.context.active_object
    obj_dial.name = "3_Dial"
    obj_dial.data.materials.append(mat_mop)

    # Add diamond hour markers to dial
    for i in range(12):
        angle = math.radians(i * 30)
        dm_x = (R_DIAL - 2.0) * math.sin(angle)
        dm_y = (R_DIAL - 2.0) * math.cos(angle)
        bpy.ops.mesh.primitive_ico_sphere_add(radius=0.55, subdivisions=2, location=(dm_x, dm_y, 0.35))
        dm = bpy.context.active_object
        dm.name = f"Dial_Diamond_{i+1}"
        dm.data.materials.append(mat_diamond)
        dm.parent = obj_dial

    # 7. Mechanical Movement
    bpy.ops.mesh.primitive_cylinder_add(radius=R_MOV, depth=3.2, vertices=64, location=(0, 0, 0))
    obj_mov = bpy.context.active_object
    obj_mov.name = "7_Mechanical_Movement"
    obj_mov.data.materials.append(mat_gold)

    # Add oscillating rotor and ruby bearings to movement
    bpy.ops.mesh.primitive_cylinder_add(radius=R_MOV * 0.88, depth=0.8, vertices=32, location=(0, -R_MOV * 0.25, 1.8))
    obj_rotor = bpy.context.active_object
    obj_rotor.name = "Movement_Rotor"
    obj_rotor.scale = (1.0, 0.5, 1.0)
    obj_rotor.data.materials.append(mat_steel_brushed)
    obj_rotor.parent = obj_mov

    # 8. Middle Case & Crown
    bpy.ops.mesh.primitive_cylinder_add(radius=R_CASE, depth=H_CASE, vertices=64, location=(0, 0, 0))
    obj_case = bpy.context.active_object
    obj_case.name = "8_Case"
    obj_case.data.materials.append(mat_steel_brushed)

    # Fluted Crown at 3 o'clock
    bpy.ops.mesh.primitive_cylinder_add(radius=2.0, depth=2.5, vertices=24, location=(R_CASE + 1.2, 0, 0))
    obj_crown = bpy.context.active_object
    obj_crown.name = "Case_Crown"
    obj_crown.rotation_euler = (0, math.radians(90), 0)
    obj_crown.data.materials.append(mat_steel)
    obj_crown.parent = obj_case

    # 9. Caseback (Exhibition Sapphire)
    bpy.ops.mesh.primitive_cylinder_add(radius=R_CASE - 0.5, depth=1.4, vertices=64, location=(0, 0, 0))
    obj_caseback = bpy.context.active_object
    obj_caseback.name = "9_Caseback"
    obj_caseback.data.materials.append(mat_steel)

    # 10. Bracelet / Strap (Milanese Mesh)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, R_CASE + 18, -H_CASE * 0.3))
    obj_strap_top = bpy.context.active_object
    obj_strap_top.scale = (14.0, 36.0, 1.8)
    obj_strap_top.name = "10_Bracelet_Top"
    obj_strap_top.data.materials.append(mat_mesh)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -R_CASE - 18, -H_CASE * 0.3))
    obj_strap_bot = bpy.context.active_object
    obj_strap_bot.scale = (14.0, 36.0, 1.8)
    obj_strap_bot.name = "10_Bracelet_Bottom"
    obj_strap_bot.data.materials.append(mat_mesh)

    # Join straps as single 10_Bracelet_Strap object
    bpy.ops.object.select_all(action='DESELECT')
    obj_strap_top.select_set(True)
    obj_strap_bot.select_set(True)
    bpy.context.view_layer.objects.active = obj_strap_top
    bpy.ops.object.join()
    obj_strap = bpy.context.active_object
    obj_strap.name = "10_Bracelet_Strap"

    # ---------------------------------------------------------
    # ASSEMBLY ANIMATION & EXPLODED POSITION CONFIGURATION
    # Frames:
    # Frame 1: Exploded Formation
    # Frame 90: Fully Assembled Formation
    # Frame 90-140: Hero Turn-table showcase
    # ---------------------------------------------------------
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 140
    scene.render.fps = 30

    components = [
        # (Object, Exploded Z, Assembled Z, Exploded Rot Z)
        (obj_crystal,   65.0,  3.2,   0),
        (obj_bezel,     48.0,  2.5,   math.radians(20)),
        (obj_sec_hand,  38.0,  1.6,   math.radians(75)),
        (obj_min_hand,  28.0,  1.3,   math.radians(45)),
        (obj_hour_hand, 20.0,  1.0,   math.radians(15)),
        (obj_dial,      10.0,  0.5,   math.radians(-25)),
        (obj_mov,       -8.0, -1.2,   math.radians(35)),
        (obj_case,     -24.0,  0.0,   0),
        (obj_caseback, -42.0, -2.6,   math.radians(-15)),
        (obj_strap,    -62.0, -1.8,   0),
    ]

    for obj, z_exp, z_asm, rot_z_exp in components:
        # Frame 1: Exploded State
        obj.location.z = z_exp
        obj.rotation_euler.z = rot_z_exp
        obj.keyframe_insert(data_path="location", frame=1)
        obj.keyframe_insert(data_path="rotation_euler", frame=1)

        # Frame 90: Assembled State
        obj.location.z = z_asm
        obj.rotation_euler.z = 0
        obj.keyframe_insert(data_path="location", frame=90)
        obj.keyframe_insert(data_path="rotation_euler", frame=90)

        # Frame 140: Hold Position (with gentle turntable drift)
        obj.location.z = z_asm
        obj.rotation_euler.z = math.radians(45) # 45 degree luxury rotation showcase
        obj.keyframe_insert(data_path="location", frame=140)
        obj.keyframe_insert(data_path="rotation_euler", frame=140)

        # Set Bezier interpolation for silky luxury watchmaking deceleration
        if obj.animation_data and obj.animation_data.action:
            try:
                if hasattr(obj.animation_data.action, 'fcurves'):
                    for fcurve in obj.animation_data.action.fcurves:
                        for kp in fcurve.keyframe_points:
                            kp.interpolation = 'BEZIER'
            except Exception:
                pass

    # ---------------------------------------------------------
    # LUXURY STUDIO LIGHTING & CAMERA SETUP
    # ---------------------------------------------------------
    # Key Light (Warm soft light)
    bpy.ops.object.light_add(type='AREA', radius=60.0, location=(45, -55, 80))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 850.0
    key_light.data.color = (1.0, 0.98, 0.94)

    # Rim / Edge Light (Cool metallic specular highlight)
    bpy.ops.object.light_add(type='AREA', radius=40.0, location=(-60, 45, 60))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 600.0
    rim_light.data.color = (0.92, 0.95, 1.0)

    # Fill Light (Subtle ambient)
    bpy.ops.object.light_add(type='POINT', location=(0, -60, -20))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 250.0

    # Camera (85mm Luxury Product Telephoto Portrait)
    bpy.ops.object.camera_add(location=(120, -110, 85))
    cam = bpy.context.active_object
    cam.name = "Luxury_Product_Camera"
    cam.data.lens = 85.0 # 85mm portrait telephoto
    cam.data.dof.use_dof = True
    cam.data.dof.focus_object = obj_dial
    cam.data.dof.aperture_fstop = 4.0

    # Camera target tracking constraint to center of watch assembly
    constraint = cam.constraints.new(type='TRACK_TO')
    constraint.target = obj_case
    constraint.track_axis = 'TRACK_NEGATIVE_Z'
    constraint.up_axis = 'UP_Y'
    scene.camera = cam

    # World background: Deep luxury charcoal atelier (#0d0e12)
    world = bpy.data.worlds.new("Titanova_Atelier_World")
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs["Color"].default_value = (0.05, 0.055, 0.07, 1.0)
        bg_node.inputs["Strength"].default_value = 0.8
    scene.world = world

    # Render settings: Cycles / Eevee Next High-Quality
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100

    # Save Project
    save_path = "d:/premium-watch-store/p006_titanova_assembly.blend"
    bpy.ops.wm.save_as_mainfile(filepath=save_path)
    print(f"SUCCESS: Saved Blender project to {save_path}")

create_p006_assembly()
