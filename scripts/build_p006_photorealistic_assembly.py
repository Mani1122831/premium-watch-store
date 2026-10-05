import bpy
import bmesh
import math
import os

# ==============================================================================
# TITANOVA ATELIER — P006 TITANOVA PEARL SILVER
# PHOTOREALISTIC 3D HOROLOGICAL ASSEMBLY GENERATOR
# ==============================================================================

def build_p006_photorealistic_assembly():
    print(">>> Starting Photorealistic Assembly for Titanova Pearl Silver (p006)...")
    
    # 1. Reset scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Clean existing materials & meshes to prevent bloat
    for m in list(bpy.data.materials):
        bpy.data.materials.remove(m, do_unlink=True)
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m, do_unlink=True)
    for a in list(bpy.data.actions):
        bpy.data.actions.remove(a, do_unlink=True)

    # Unit configuration: Metric mm
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 0.001 # 1 unit = 1 mm

    # --------------------------------------------------------------------------
    # DIMENSIONS (Authentic 34mm Feminine Luxury Jewelry Timepiece)
    # --------------------------------------------------------------------------
    R_CASE = 17.0        # 34mm case diameter
    R_CASE_INNER = 15.2  # Interior cavity
    H_CASE = 4.8         # 4.8mm case depth
    R_BEZEL_OUTER = 17.3
    R_BEZEL_INNER = 15.5
    H_BEZEL = 1.4
    R_CRYSTAL = 15.8
    H_CRYSTAL = 1.1
    R_DIAL = 15.1
    H_DIAL = 0.55
    R_MOV = 14.8
    H_MOV = 2.4
    R_CASEBACK = 16.8
    H_CASEBACK = 1.2
    LUG_SPAN = 21.0
    STRAP_WIDTH = 14.0

    # --------------------------------------------------------------------------
    # MATERIALS
    # --------------------------------------------------------------------------
    def make_material(name, color, metallic=0.0, roughness=0.1, transmission=0.0, ior=1.45, coat=0.0):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            if "Base Color" in bsdf.inputs:
                bsdf.inputs["Base Color"].default_value = color
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
            if "Coat Weight" in bsdf.inputs:
                bsdf.inputs["Coat Weight"].default_value = coat
        return mat

    mat_steel_mirror = make_material("316L_Steel_Mirror", (0.88, 0.89, 0.92, 1.0), metallic=0.98, roughness=0.04, coat=0.5)
    mat_steel_satin = make_material("316L_Steel_Satin", (0.84, 0.85, 0.87, 1.0), metallic=0.94, roughness=0.22)
    mat_mop_dial = make_material("Mother_Of_Pearl_Iridescent", (0.94, 0.95, 0.97, 1.0), metallic=0.15, roughness=0.12, coat=0.8, ior=1.52)
    mat_sapphire = make_material("Sapphire_Crystal_AR", (0.94, 0.97, 1.0, 1.0), metallic=0.0, roughness=0.015, transmission=0.96, ior=1.77)
    mat_diamond = make_material("Brilliant_Diamond", (1.0, 1.0, 1.0, 1.0), metallic=0.0, roughness=0.005, transmission=0.94, ior=2.42)
    mat_blued = make_material("Blued_Steel", (0.05, 0.18, 0.58, 1.0), metallic=0.92, roughness=0.08)
    mat_ruby = make_material("Synthetic_Ruby", (0.85, 0.04, 0.18, 1.0), metallic=0.05, roughness=0.05, transmission=0.85, ior=1.76)
    mat_brass = make_material("Gilded_Brass_Plate", (0.92, 0.76, 0.28, 1.0), metallic=0.88, roughness=0.18)
    mat_copper = make_material("Coil_Copper_Winding", (0.85, 0.42, 0.22, 1.0), metallic=0.92, roughness=0.25)
    mat_mesh = make_material("Milanese_Mesh_Steel", (0.83, 0.84, 0.86, 1.0), metallic=0.95, roughness=0.18)

    def bmesh_create_cylinder(bm, radius, depth, segments=32):
        return bmesh.ops.create_cone(
            bm,
            cap_ends=True,
            segments=segments,
            radius1=radius,
            radius2=radius,
            depth=depth
        )

    # --------------------------------------------------------------------------
    # 1. SAPPHIRE CRYSTAL (Curved Double-Domed Lens)
    # --------------------------------------------------------------------------
    bm = bmesh.new()
    # Create curved dome cap
    segments = 48
    rings = 16
    for r in range(rings + 1):
        theta = (r / rings) * (math.pi / 2.8) # subtle curve
        z = math.cos(theta) * 2.2 - 2.2
        rad = math.sin(theta) * (R_CRYSTAL / math.sin(math.pi / 2.8))
        for s in range(segments):
            phi = (s / segments) * 2 * math.pi
            bm.verts.new((rad * math.cos(phi), rad * math.sin(phi), z))
    
    bm.verts.ensure_lookup_table()
    for r in range(rings):
        for s in range(segments):
            s_next = (s + 1) % segments
            v1 = bm.verts[r * segments + s]
            v2 = bm.verts[r * segments + s_next]
            v3 = bm.verts[(r + 1) * segments + s_next]
            v4 = bm.verts[(r + 1) * segments + s]
            bm.faces.new((v1, v2, v3, v4))

    mesh_crystal = bpy.data.meshes.new("1_Crystal_Mesh")
    bm.to_mesh(mesh_crystal)
    bm.free()

    obj_crystal = bpy.data.objects.new("1_Crystal", mesh_crystal)
    bpy.context.collection.objects.link(obj_crystal)
    obj_crystal.data.materials.append(mat_sapphire)
    # Add solidify to give realistic 0.8mm crystal thickness
    mod_sol = obj_crystal.modifiers.new(name="Solidify", type='SOLIDIFY')
    mod_sol.thickness = 0.85
    mod_sol.offset = -1.0
    mod_sub = obj_crystal.modifiers.new(name="Subdiv", type='SUBSURF')
    mod_sub.levels = 1

    # --------------------------------------------------------------------------
    # 2. SURGICAL STEEL BEZEL (Chamfered Stepped Ring)
    # --------------------------------------------------------------------------
    bm = bmesh.new()
    outer_top = [bm.verts.new((R_BEZEL_OUTER * math.cos(i * 2 * math.pi / 64), R_BEZEL_OUTER * math.sin(i * 2 * math.pi / 64), H_BEZEL * 0.5)) for i in range(64)]
    inner_top = [bm.verts.new((R_BEZEL_INNER * math.cos(i * 2 * math.pi / 64), R_BEZEL_INNER * math.sin(i * 2 * math.pi / 64), H_BEZEL * 0.5)) for i in range(64)]
    outer_bot = [bm.verts.new((R_BEZEL_OUTER * math.cos(i * 2 * math.pi / 64), R_BEZEL_OUTER * math.sin(i * 2 * math.pi / 64), -H_BEZEL * 0.5)) for i in range(64)]
    inner_bot = [bm.verts.new((R_BEZEL_INNER * math.cos(i * 2 * math.pi / 64), R_BEZEL_INNER * math.sin(i * 2 * math.pi / 64), -H_BEZEL * 0.5)) for i in range(64)]
    for i in range(64):
        i_next = (i + 1) % 64
        bm.faces.new((outer_top[i], outer_top[i_next], inner_top[i_next], inner_top[i]))
        bm.faces.new((inner_bot[i], inner_bot[i_next], outer_bot[i_next], outer_bot[i]))
        bm.faces.new((outer_bot[i], outer_bot[i_next], outer_top[i_next], outer_top[i]))
        bm.faces.new((inner_top[i], inner_top[i_next], inner_bot[i_next], inner_bot[i]))
    mesh_bezel = bpy.data.meshes.new("2_Bezel_Mesh")
    bm.to_mesh(mesh_bezel)
    bm.free()

    obj_bezel = bpy.data.objects.new("2_Bezel", mesh_bezel)
    bpy.context.collection.objects.link(obj_bezel)
    obj_bezel.data.materials.append(mat_steel_mirror)

    # --------------------------------------------------------------------------
    # 3. HANDS (Faceted Dauphine / Leaf & Blued Needle Seconds)
    # --------------------------------------------------------------------------
    # Hour Hand
    bm = bmesh.new()
    # 3D faceted diamond spear
    v_c = bm.verts.new((0, 0, 0))
    v_w1 = bm.verts.new((-0.85, 3.2, 0))
    v_w2 = bm.verts.new((0.85, 3.2, 0))
    v_tip = bm.verts.new((0, 9.8, 0))
    v_ridge = bm.verts.new((0, 3.2, 0.22)) # raised 3D center crease
    bm.faces.new((v_c, v_w1, v_ridge))
    bm.faces.new((v_c, v_ridge, v_w2))
    bm.faces.new((v_ridge, v_w1, v_tip))
    bm.faces.new((v_ridge, v_tip, v_w2))
    mesh_hour = bpy.data.meshes.new("4_Hour_Hand_Mesh")
    bm.to_mesh(mesh_hour)
    bm.free()
    obj_hour_hand = bpy.data.objects.new("4_Hour_Hand", mesh_hour)
    bpy.context.collection.objects.link(obj_hour_hand)
    obj_hour_hand.data.materials.append(mat_steel_mirror)
    mod_h_sol = obj_hour_hand.modifiers.new(name="Solidify", type='SOLIDIFY')
    mod_h_sol.thickness = 0.25

    # Minute Hand
    bm = bmesh.new()
    v_c = bm.verts.new((0, 0, 0))
    v_w1 = bm.verts.new((-0.75, 4.2, 0))
    v_w2 = bm.verts.new((0.75, 4.2, 0))
    v_tip = bm.verts.new((0, 14.2, 0))
    v_ridge = bm.verts.new((0, 4.2, 0.22))
    bm.faces.new((v_c, v_w1, v_ridge))
    bm.faces.new((v_c, v_ridge, v_w2))
    bm.faces.new((v_ridge, v_w1, v_tip))
    bm.faces.new((v_ridge, v_tip, v_w2))
    mesh_min = bpy.data.meshes.new("5_Minute_Hand_Mesh")
    bm.to_mesh(mesh_min)
    bm.free()
    obj_min_hand = bpy.data.objects.new("5_Minute_Hand", mesh_min)
    bpy.context.collection.objects.link(obj_min_hand)
    obj_min_hand.data.materials.append(mat_steel_mirror)
    mod_m_sol = obj_min_hand.modifiers.new(name="Solidify", type='SOLIDIFY')
    mod_m_sol.thickness = 0.22

    # Seconds Hand (Blued Needle with Counterweight Teardrop)
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, radius=0.75, segments=16) # central collar
    # needle
    v_n1 = bm.verts.new((-0.12, 0, 0))
    v_n2 = bm.verts.new((0.12, 0, 0))
    v_n3 = bm.verts.new((0.04, 15.0, 0))
    v_n4 = bm.verts.new((-0.04, 15.0, 0))
    bm.faces.new((v_n1, v_n2, v_n3, v_n4))
    # counterweight
    v_t1 = bm.verts.new((-0.3, -3.5, 0))
    v_t2 = bm.verts.new((0.3, -3.5, 0))
    v_t3 = bm.verts.new((0, -4.6, 0))
    bm.faces.new((v_n1, v_t1, v_t3))
    bm.faces.new((v_n2, v_t3, v_t2))
    mesh_sec = bpy.data.meshes.new("6_Seconds_Hand_Mesh")
    bm.to_mesh(mesh_sec)
    bm.free()
    obj_sec_hand = bpy.data.objects.new("6_Seconds_Hand", mesh_sec)
    bpy.context.collection.objects.link(obj_sec_hand)
    obj_sec_hand.data.materials.append(mat_blued)
    mod_s_sol = obj_sec_hand.modifiers.new(name="Solidify", type='SOLIDIFY')
    mod_s_sol.thickness = 0.18

    # --------------------------------------------------------------------------
    # 4. NATURAL MOTHER-OF-PEARL DIAL & 12 BRILLIANT DIAMONDS
    # --------------------------------------------------------------------------
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=R_DIAL, depth=H_DIAL, segments=64)
    mesh_dial = bpy.data.meshes.new("3_Dial_Mesh")
    bm.to_mesh(mesh_dial)
    bm.free()
    obj_dial = bpy.data.objects.new("3_Dial", mesh_dial)
    bpy.context.collection.objects.link(obj_dial)
    obj_dial.data.materials.append(mat_mop_dial)

    # 12 Diamond Hour Markers in 316L Bezel Cups
    for i in range(12):
        angle = math.radians(i * 30)
        dm_r = R_DIAL - 2.2
        dx = dm_r * math.sin(angle)
        dy = dm_r * math.cos(angle)
        
        # Setting Cup
        bm_d = bmesh.new()
        bmesh_create_cylinder(bm_d, radius=0.55, depth=0.35, segments=16)
        mesh_d = bpy.data.meshes.new(f"Diamond_Setting_{i+1}")
        bm_d.to_mesh(mesh_d)
        bm_d.free()
        obj_d = bpy.data.objects.new(f"Dial_Diamond_{i+1}", mesh_d)
        bpy.context.collection.objects.link(obj_d)
        obj_d.location = (dx, dy, H_DIAL * 0.55)
        obj_d.data.materials.append(mat_diamond)
        obj_d.parent = obj_dial

    # --------------------------------------------------------------------------
    # 5. SWISS PRECISION QUARTZ MOVEMENT (Calibre Architecture)
    # --------------------------------------------------------------------------
    # Mainplate
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=R_MOV, depth=H_MOV * 0.6, segments=64)
    mesh_mov = bpy.data.meshes.new("7_Mechanical_Movement_Mesh")
    bm.to_mesh(mesh_mov)
    bm.free()
    obj_mov = bpy.data.objects.new("7_Mechanical_Movement", mesh_mov)
    bpy.context.collection.objects.link(obj_mov)
    obj_mov.data.materials.append(mat_brass)

    # Quartz Stepper Motor Coil (Copper winding)
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=2.6, depth=1.2, segments=24)
    mesh_coil = bpy.data.meshes.new("Movement_Coil_Mesh")
    bm.to_mesh(mesh_coil)
    bm.free()
    obj_coil = bpy.data.objects.new("Movement_Coil", mesh_coil)
    bpy.context.collection.objects.link(obj_coil)
    obj_coil.location = (-R_MOV * 0.45, R_MOV * 0.25, H_MOV * 0.4)
    obj_coil.rotation_euler = (0, math.radians(90), math.radians(25))
    obj_coil.data.materials.append(mat_copper)
    obj_coil.parent = obj_mov

    # Quartz Vacuum Crystal Canister (Silver cylinder)
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=1.1, depth=5.5, segments=20)
    mesh_qtz = bpy.data.meshes.new("Movement_Quartz_Canister_Mesh")
    bm.to_mesh(mesh_qtz)
    bm.free()
    obj_qtz = bpy.data.objects.new("Movement_Quartz_Canister", mesh_qtz)
    bpy.context.collection.objects.link(obj_qtz)
    obj_qtz.location = (R_MOV * 0.45, -R_MOV * 0.35, H_MOV * 0.35)
    obj_qtz.rotation_euler = (math.radians(90), 0, math.radians(-30))
    obj_qtz.data.materials.append(mat_steel_mirror)
    obj_qtz.parent = obj_mov

    # Battery Well & Cell
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=4.8, depth=0.8, segments=32)
    mesh_bat = bpy.data.meshes.new("Movement_Battery_Cell_Mesh")
    bm.to_mesh(mesh_bat)
    bm.free()
    obj_bat = bpy.data.objects.new("Movement_Battery_Cell", mesh_bat)
    bpy.context.collection.objects.link(obj_bat)
    obj_bat.location = (-R_MOV * 0.25, -R_MOV * 0.35, H_MOV * 0.4)
    obj_bat.data.materials.append(mat_steel_satin)
    obj_bat.parent = obj_mov

    # Synthetic Ruby Bearings
    for idx, (rx, ry) in enumerate([(2.5, 4.0), (-2.0, 5.5), (0.0, 0.0)]):
        bm = bmesh.new()
        bmesh_create_cylinder(bm, radius=0.6, depth=0.4, segments=16)
        mesh_rb = bpy.data.meshes.new(f"Movement_Ruby_{idx+1}_Mesh")
        bm.to_mesh(mesh_rb)
        bm.free()
        obj_rb = bpy.data.objects.new(f"Movement_Ruby_{idx+1}", mesh_rb)
        bpy.context.collection.objects.link(obj_rb)
        obj_rb.location = (rx, ry, H_MOV * 0.42)
        obj_rb.data.materials.append(mat_ruby)
        obj_rb.parent = obj_mov

    # --------------------------------------------------------------------------
    # 6. POLISHED 316L CURVED STEEL MIDDLE CASE & FLUTED CROWN
    # --------------------------------------------------------------------------
    bm = bmesh.new()
    outer_top = [bm.verts.new((R_CASE * math.cos(i * 2 * math.pi / 64), R_CASE * math.sin(i * 2 * math.pi / 64), H_CASE * 0.5)) for i in range(64)]
    inner_top = [bm.verts.new((R_CASE_INNER * math.cos(i * 2 * math.pi / 64), R_CASE_INNER * math.sin(i * 2 * math.pi / 64), H_CASE * 0.5)) for i in range(64)]
    outer_bot = [bm.verts.new((R_CASE * math.cos(i * 2 * math.pi / 64), R_CASE * math.sin(i * 2 * math.pi / 64), -H_CASE * 0.5)) for i in range(64)]
    inner_bot = [bm.verts.new((R_CASE_INNER * math.cos(i * 2 * math.pi / 64), R_CASE_INNER * math.sin(i * 2 * math.pi / 64), -H_CASE * 0.5)) for i in range(64)]
    for i in range(64):
        i_next = (i + 1) % 64
        bm.faces.new((outer_top[i], outer_top[i_next], inner_top[i_next], inner_top[i]))
        bm.faces.new((inner_bot[i], inner_bot[i_next], outer_bot[i_next], outer_bot[i]))
        bm.faces.new((outer_bot[i], outer_bot[i_next], outer_top[i_next], outer_top[i]))
        bm.faces.new((inner_top[i], inner_top[i_next], inner_bot[i_next], inner_bot[i]))
    mesh_case = bpy.data.meshes.new("8_Case_Mesh")
    bm.to_mesh(mesh_case)
    bm.free()

    obj_case = bpy.data.objects.new("8_Case", mesh_case)
    bpy.context.collection.objects.link(obj_case)
    obj_case.data.materials.append(mat_steel_mirror)

    # Sculpted Lugs (Top & Bottom pairs)
    for sign_y in [1.0, -1.0]:
        for sign_x in [1.0, -1.0]:
            bm = bmesh.new()
            bmesh.ops.create_cube(bm, size=1.0)
            mesh_lug = bpy.data.meshes.new("Case_Lug_Mesh")
            bm.to_mesh(mesh_lug)
            bm.free()
            obj_lug = bpy.data.objects.new(f"Case_Lug_{'T' if sign_y > 0 else 'B'}_{'R' if sign_x > 0 else 'L'}", mesh_lug)
            bpy.context.collection.objects.link(obj_lug)
            obj_lug.scale = (2.2, 5.5, 3.2)
            obj_lug.location = (sign_x * (STRAP_WIDTH * 0.5 + 1.1), sign_y * (R_CASE + 1.8), -0.6)
            obj_lug.rotation_euler = (math.radians(-sign_y * 12), 0, 0)
            obj_lug.data.materials.append(mat_steel_mirror)
            obj_lug.parent = obj_case

    # Fluted Knurled Crown at 3 o'clock
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=2.2, depth=2.4, segments=28)
    mesh_cr = bpy.data.meshes.new("Case_Crown_Mesh")
    bm.to_mesh(mesh_cr)
    bm.free()
    obj_crown = bpy.data.objects.new("Case_Crown", mesh_cr)
    bpy.context.collection.objects.link(obj_crown)
    obj_crown.location = (R_CASE + 1.2, 0, -0.4)
    obj_crown.rotation_euler = (0, math.radians(90), 0)
    obj_crown.data.materials.append(mat_steel_mirror)
    obj_crown.parent = obj_case

    # --------------------------------------------------------------------------
    # 7. THREADED STEEL CASEBACK (With Exhibition Sapphire Window)
    # --------------------------------------------------------------------------
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=R_CASEBACK, depth=H_CASEBACK, segments=64)
    mesh_cb = bpy.data.meshes.new("9_Caseback_Mesh")
    bm.to_mesh(mesh_cb)
    bm.free()
    obj_caseback = bpy.data.objects.new("9_Caseback", mesh_cb)
    bpy.context.collection.objects.link(obj_caseback)
    obj_caseback.data.materials.append(mat_steel_satin)
    # Exhibition glass insert
    bm = bmesh.new()
    bmesh_create_cylinder(bm, radius=R_CASEBACK * 0.55, depth=0.4, segments=32)
    mesh_cb_gl = bpy.data.meshes.new("Caseback_Glass_Mesh")
    bm.to_mesh(mesh_cb_gl)
    bm.free()
    obj_cb_gl = bpy.data.objects.new("Caseback_Glass_Window", mesh_cb_gl)
    bpy.context.collection.objects.link(obj_cb_gl)
    obj_cb_gl.location = (0, 0, -H_CASEBACK * 0.4)
    obj_cb_gl.data.materials.append(mat_sapphire)
    obj_cb_gl.parent = obj_caseback

    # --------------------------------------------------------------------------
    # 8. MILANESE MESH BRACELET / STRAP (Top & Bottom Curved Sections)
    # --------------------------------------------------------------------------
    def create_curved_milanese_section(name, sign_y):
        bm = bmesh.new()
        # Curved ribbon draping naturally around wrist
        num_links = 28
        width = STRAP_WIDTH
        for i in range(num_links + 1):
            t = i / num_links
            # Arch curve
            dist = 4.0 + t * 42.0
            y = sign_y * (R_CASE + dist)
            z = -H_CASE * 0.4 - math.pow(t, 1.8) * 24.0 # ergonomic downward drape
            
            v_l = bm.verts.new((-width * 0.5, y, z))
            v_r = bm.verts.new((width * 0.5, y, z))

        bm.verts.ensure_lookup_table()
        for i in range(num_links):
            v1 = bm.verts[i * 2]
            v2 = bm.verts[i * 2 + 1]
            v3 = bm.verts[(i + 1) * 2 + 1]
            v4 = bm.verts[(i + 1) * 2]
            bm.faces.new((v1, v2, v3, v4))

        mesh_str = bpy.data.meshes.new(f"{name}_Mesh")
        bm.to_mesh(mesh_str)
        bm.free()

        obj_str = bpy.data.objects.new(name, mesh_str)
        bpy.context.collection.objects.link(obj_str)
        obj_str.data.materials.append(mat_mesh)
        mod_sol = obj_str.modifiers.new(name="Solidify", type='SOLIDIFY')
        mod_sol.thickness = 1.4
        mod_sol.offset = 0.0
        return obj_str

    obj_strap_top = create_curved_milanese_section("10_Bracelet_Top", 1.0)
    obj_strap_bot = create_curved_milanese_section("10_Bracelet_Bottom", -1.0)

    # Join both strap halves into single 10_Bracelet_Strap object
    bpy.ops.object.select_all(action='DESELECT')
    obj_strap_top.select_set(True)
    obj_strap_bot.select_set(True)
    bpy.context.view_layer.objects.active = obj_strap_top
    bpy.ops.object.join()
    obj_strap = bpy.context.active_object
    obj_strap.name = "10_Bracelet_Strap"

    # --------------------------------------------------------------------------
    # 10-PHASE SEQUENTIAL KEYFRAME ANIMATION (Frames 1 to 250)
    # --------------------------------------------------------------------------
    # Phase 1: Complete exploded architecture (Frames 1–25)
    # Phase 2: Bracelet moves into position (Frames 25–55)
    # Phase 3: Caseback moves into position (Frames 55–80)
    # Phase 4: Movement moves into case (Frames 80–105)
    # Phase 5: Dial moves into case (Frames 105–130)
    # Phase 6: Hands move into center pinion alignment (Frames 130–160)
    # Phase 7: Bezel moves into position (Frames 160–185)
    # Phase 8: Sapphire crystal moves into position (Frames 185–210)
    # Phase 9: Final alignment & calibre lock (Frames 210–225)
    # Phase 10: Hold finished watch & turntable showcase (Frames 225–250)
    # --------------------------------------------------------------------------
    scene.frame_start = 1
    scene.frame_end = 250
    scene.render.fps = 30

    # Define Assembled and Exploded coordinates
    Z_CASE_ASM = 0.0
    Z_CASEBACK_ASM = -H_CASE * 0.5 - H_CASEBACK * 0.5 + 0.1
    Z_MOV_ASM = -H_CASE * 0.1
    Z_DIAL_ASM = H_CASE * 0.25
    Z_HOUR_ASM = Z_DIAL_ASM + H_DIAL + 0.35
    Z_MIN_ASM = Z_HOUR_ASM + 0.30
    Z_SEC_ASM = Z_MIN_ASM + 0.25
    Z_BEZEL_ASM = H_CASE * 0.5 - 0.2
    Z_CRYSTAL_ASM = Z_BEZEL_ASM + H_BEZEL * 0.35
    Z_STRAP_ASM = 0.0

    # Exploded Z positions (Clear vertical separation)
    Z_CRYSTAL_EXP = 75.0
    Z_BEZEL_EXP = 56.0
    Z_SEC_EXP = 45.0
    Z_MIN_EXP = 36.0
    Z_HOUR_EXP = 28.0
    Z_DIAL_EXP = 18.0
    Z_MOV_EXP = -12.0
    Z_CASE_EXP = 0.0
    Z_CASEBACK_EXP = -45.0
    Z_STRAP_EXP = -68.0

    def add_keyframes(obj, f_start_move, f_end_move, z_exp, z_asm, rot_z_exp=0.0):
        # Frame 1 to f_start_move: Hold exploded position
        obj.location.z = z_exp
        obj.rotation_euler.z = rot_z_exp
        obj.keyframe_insert(data_path="location", frame=1)
        obj.keyframe_insert(data_path="rotation_euler", frame=1)
        if f_start_move > 1:
            obj.keyframe_insert(data_path="location", frame=f_start_move)
            obj.keyframe_insert(data_path="rotation_euler", frame=f_start_move)

        # f_end_move: Arrive at fully assembled position
        obj.location.z = z_asm
        obj.rotation_euler.z = 0.0
        obj.keyframe_insert(data_path="location", frame=f_end_move)
        obj.keyframe_insert(data_path="rotation_euler", frame=f_end_move)

        # Frame 225: Hold assembled position
        obj.location.z = z_asm
        obj.rotation_euler.z = 0.0
        obj.keyframe_insert(data_path="location", frame=225)
        obj.keyframe_insert(data_path="rotation_euler", frame=225)

        # Frame 250: Gentle turntable drift showcase (30 degrees)
        obj.location.z = z_asm
        obj.rotation_euler.z = math.radians(30)
        obj.keyframe_insert(data_path="location", frame=250)
        obj.keyframe_insert(data_path="rotation_euler", frame=250)

    # Apply 10 Sequential Phases
    add_keyframes(obj_case,      1,    1, Z_CASE_EXP,     Z_CASE_ASM,     0.0)
    add_keyframes(obj_strap,    25,   55, Z_STRAP_EXP,    Z_STRAP_ASM,    0.0)
    add_keyframes(obj_caseback, 55,   80, Z_CASEBACK_EXP, Z_CASEBACK_ASM, math.radians(-40))
    add_keyframes(obj_mov,      80,  105, Z_MOV_EXP,      Z_MOV_ASM,      math.radians(35))
    add_keyframes(obj_dial,    105,  130, Z_DIAL_EXP,     Z_DIAL_ASM,     math.radians(-25))
    add_keyframes(obj_hour_hand, 130, 155, Z_HOUR_EXP,    Z_HOUR_ASM,     math.radians(45))
    add_keyframes(obj_min_hand,  135, 158, Z_MIN_EXP,     Z_MIN_ASM,      math.radians(-60))
    add_keyframes(obj_sec_hand,  140, 162, Z_SEC_EXP,     Z_SEC_ASM,      math.radians(110))
    add_keyframes(obj_bezel,   162,  188, Z_BEZEL_EXP,    Z_BEZEL_ASM,    math.radians(20))
    add_keyframes(obj_crystal, 188,  215, Z_CRYSTAL_EXP,  Z_CRYSTAL_ASM,  0.0)

    # --------------------------------------------------------------------------
    # LUXURY THREE-POINT LIGHTING & PRODUCT PRESENTATION CAMERA
    # --------------------------------------------------------------------------
    # Key Light (Soft Warm 5500K Area Panel)
    bpy.ops.object.light_add(type='AREA', radius=50.0, location=(45, -50, 75))
    key_lt = bpy.context.active_object
    key_lt.name = "Key_Light"
    key_lt.data.energy = 950.0
    key_lt.data.color = (1.0, 0.98, 0.94)

    # Rim Light (Cool 6500K Sharp Specular)
    bpy.ops.object.light_add(type='AREA', radius=35.0, location=(-55, 45, 55))
    rim_lt = bpy.context.active_object
    rim_lt.name = "Rim_Light"
    rim_lt.data.energy = 650.0
    rim_lt.data.color = (0.92, 0.95, 1.0)

    # Fill Light (Subtle Ambient)
    bpy.ops.object.light_add(type='POINT', location=(0, -55, -25))
    fill_lt = bpy.context.active_object
    fill_lt.name = "Fill_Light"
    fill_lt.data.energy = 280.0

    # 85mm Telephoto Portrait Camera
    bpy.ops.object.camera_add(location=(110, -100, 80))
    cam = bpy.context.active_object
    cam.name = "Luxury_Product_Camera"
    cam.data.lens = 85.0
    cam.data.dof.use_dof = True
    cam.data.dof.focus_object = obj_dial
    cam.data.dof.aperture_fstop = 4.5

    constraint = cam.constraints.new(type='TRACK_TO')
    constraint.target = obj_case
    constraint.track_axis = 'TRACK_NEGATIVE_Z'
    constraint.up_axis = 'UP_Y'
    scene.camera = cam

    # World background: Atelier dark charcoal
    world = bpy.data.worlds.new("Titanova_Studio_World")
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs["Color"].default_value = (0.04, 0.045, 0.055, 1.0)
        bg_node.inputs["Strength"].default_value = 0.9
    scene.world = world

    # Render settings
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080

    # Save .blend project
    blend_path = "d:/premium-watch-store/p006_titanova_assembly.blend"
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f">>> Successfully saved Blender project to: {blend_path}")

    # Export web-ready GLB asset
    glb_dir = "d:/premium-watch-store/public/models/watches"
    os.makedirs(glb_dir, exist_ok=True)
    glb_path = os.path.join(glb_dir, "p006_titanova_assembly.glb")
    
    # Export full GLB with animations, meshes, and materials
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=False,
        export_animations=True,
        export_current_frame=False,
        export_skins=True,
        export_morph=True,
        export_lights=True,
        export_cameras=True
    )
    print(f">>> Successfully exported GLB model to: {glb_path}")

build_p006_photorealistic_assembly()
