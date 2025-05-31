import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

export function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return (
    <Canvas className="fixed top-0 left-0 w-full h-full bg-white">
      <ambientLight />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          <primitive object={scene} scale={2.5} />
        </Stage>
      </Suspense>
      <OrbitControls enableZoom />
    </Canvas>
  );
}
