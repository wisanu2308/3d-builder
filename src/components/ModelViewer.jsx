import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";

const colorOptions = ["#FF0000", "#00FF00", "#0000FF", "#FFD700", "#FF69B4"];

export function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const [color, setColor] = useState("#FF0000");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        child.material.needsUpdate = true;
      }
    });
  }, [color, scene]);

  return (
    <div className="relative w-full h-screen">

      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {colorOptions.map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            className="w-8 h-8 rounded cursor-pointer border-2 border-white shadow"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      <Canvas className="w-full">
        <ambientLight />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <primitive object={scene} scale={0.8} />
          </Stage>
        </Suspense>
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}
