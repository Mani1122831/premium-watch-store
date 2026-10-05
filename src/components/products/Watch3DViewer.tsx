import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Watch3DViewerProps {
  modelUrl: string;
  separation: number; // 0 (assembled) to 100 (fully exploded)
  isAssemblyComplete: boolean;
  activeComponent: string | null;
  onComponentClick?: (componentId: string) => void;
  className?: string;
}

function mapMeshNameToLayerId(meshName: string): string {
  const name = meshName.toLowerCase();
  if (name.includes('crystal')) return 'crystal';
  if (name.includes('bezel')) return 'bezel';
  if (name.includes('second') || name.includes('sec')) return 'seconds_hand';
  if (name.includes('minute')) return 'minute_hand';
  if (name.includes('hour')) return 'hour_hand';
  if (name.includes('dial')) return 'dial';
  if (name.includes('movement') || name.includes('calibre')) return 'movement';
  if (name.includes('caseback')) return 'caseback';
  if (name.includes('case')) return 'case';
  if (name.includes('strap') || name.includes('bracelet')) return 'strap';
  return meshName;
}

function isMeshMatchingComponent(meshName: string, activeComponent: string | null): boolean {
  if (!activeComponent) return false;
  const mapped = mapMeshNameToLayerId(meshName);
  if (mapped === activeComponent) return true;
  const lowerName = meshName.toLowerCase();
  const lowerTarget = activeComponent.toLowerCase();
  if (lowerTarget === 'case' && lowerName.includes('caseback')) return false;
  if (lowerTarget === 'hands' && (lowerName.includes('hand') || lowerName.includes('second') || lowerName.includes('minute') || lowerName.includes('hour'))) return true;
  return lowerName.includes(lowerTarget);
}

export default function Watch3DViewer({
  modelUrl,
  separation,
  isAssemblyComplete,
  activeComponent,
  onComponentClick,
  className = '',
}: Watch3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const animActionsRef = useRef<THREE.AnimationAction[]>([]);
  const animDurationRef = useRef<number>(7.5);
  const isInteractingRef = useRef<boolean>(false);

  // Initialize Three.js Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: 85mm luxury telephoto feel
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      1.0,
      1000
    );
    camera.position.set(0, -95, 70);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 45;
    controls.maxDistance = 220;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Studio Three-Point Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    keyLight.position.set(45, -50, 75);
    scene.add(keyLight);

    // Cool Specular Rim Light
    const rimLight = new THREE.DirectionalLight(0xd8ecff, 2.4);
    rimLight.position.set(-55, 45, 55);
    scene.add(rimLight);

    // Fill Under-Light
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(0, -55, -25);
    scene.add(fillLight);

    // 6. Animation Frame Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      controls.update();

      // Gentle luxury turntable drift when fully assembled
      if (modelRootRef.current && (separation <= 1 || isAssemblyComplete) && !isInteractingRef.current) {
        modelRootRef.current.rotation.z += 0.0035;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // User interaction tracking
    const handleStart = () => { isInteractingRef.current = true; };
    const handleEnd = () => { isInteractingRef.current = false; };
    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    // Interactive Raycast Click on 3D Objects
    const handleClick = (e: MouseEvent) => {
      if (!container || !camera || !modelRootRef.current || !onComponentClick) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modelRootRef.current.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        onComponentClick(mapMeshNameToLayerId(hit.name));
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onComponentClick]);

  // Load GLB Model
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return;

    setLoading(true);
    setLoadError(null);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        // Clear previous model if any
        if (modelRootRef.current && sceneRef.current) {
          sceneRef.current.remove(modelRootRef.current);
        }

        const model = gltf.scene;
        modelRootRef.current = model;

        // Enhance materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1.6;
              // If sapphire crystal, give transparent transmission
              if (mesh.name.toLowerCase().includes('crystal')) {
                mat.transparent = true;
                mat.opacity = 0.55;
                mat.roughness = 0.02;
                mat.metalness = 0.05;
              }
            }
          }
        });

        // Center model geometry in view
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        if (sceneRef.current) {
          sceneRef.current.add(model);
        }

        // Setup animations
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          mixerRef.current = mixer;
          animActionsRef.current = [];

          let maxDuration = 0;
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
            action.paused = true; // Control time manually via slider
            animActionsRef.current.push(action);
            if (clip.duration > maxDuration) maxDuration = clip.duration;
          });

          animDurationRef.current = maxDuration > 0 ? maxDuration : 7.5;
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Could not load this product-specific GLB model:', err);
        setLoadError('Product model unavailable');
        setLoading(false);
      }
    );
  }, [modelUrl]);

  // Sync Separation (0–100) with GLB Animation
  useEffect(() => {
    if (!mixerRef.current || animActionsRef.current.length === 0) return;

    // Progress: 0.0 (Exploded) to 1.0 (Assembled)
    const progress = Math.max(0, Math.min(1.0, (100 - separation) / 100));
    // In our 250-frame animation, Frame 215 is fully locked (approx 86% of total clip duration)
    const targetTime = progress * (animDurationRef.current * 0.86);

    animActionsRef.current.forEach((action) => {
      action.time = targetTime;
    });

    mixerRef.current.setTime(targetTime);
  }, [separation]);

  // Highlight active component if selected in side panel
  useEffect(() => {
    if (!modelRootRef.current) return;

    modelRootRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat) return;

        const isMatch = isMeshMatchingComponent(mesh.name, activeComponent);
        if (isMatch) {
          mat.emissive = new THREE.Color(0xd4a017);
          mat.emissiveIntensity = 0.5;
        } else if (mat.emissive) {
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0.0;
        }
      }
    });
  }, [activeComponent]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-20">
          <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-[11px] font-mono tracking-widest text-gold-300 uppercase">
            Loading Calibre 3D Geometry...
          </span>
        </div>
      )}

      {/* Interactive Orbit Help Pill */}
      {!loading && !loadError && (
        <div className="absolute top-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono text-white/50 uppercase tracking-wider backdrop-blur-md">
          <span>Click & Drag to Rotate in 3D</span>
        </div>
      )}
    </div>
  );
}
