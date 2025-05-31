import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";

const colorOptions = [
  "transparent",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFD700",
  "#FF69B4",
];

export function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const [color, setColor] = useState("#FF0000");
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (color === "transparent") {
          child.material.transparent = true;
          child.material.opacity = 0.2;
          child.material.color.set("#ffffff");
        } else {
          child.material.transparent = false;
          child.material.opacity = 1;
          child.material.color.set(color);
        }
        child.material.wireframe = wireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [color, wireframe, scene]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {colorOptions.map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300 shadow"
            style={{
              backgroundColor: c === "transparent" ? "white" : c,
              backgroundImage:
                c === "transparent"
                  ? "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 10px 10px"
                  : "none",
            }}
            title={c}
          />
        ))}
        <label className="text-sm mt-2">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(e) => setWireframe(e.target.checked)}
            className="mr-2"
          />
          Wireframe
        </label>
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
