import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

export function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return (
    <div className="w-full h-screen">
      <Canvas className="w-full bg-red-400">
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
