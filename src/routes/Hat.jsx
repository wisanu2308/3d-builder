import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import ModelViewer from "../components/ModelViewer";

const decalOptions = [
  null,
  {
    image: "/textures/dog.png",
    position: [0, 0.6, 0.2],
    rotation: [0, 0, 0],
    scale: [0.2, 0.2, 0.2],
  },
  {
    image: "/textures/kitty.png",
    position: [-0.2, 0.5, 0],
    rotation: [0, Math.PI / 2, 0],
    scale: [0.25, 0.25, 0.25],
  },
];

export default function ShortPant() {
  const [selectedDecal, setSelectedDecal] = useState(decalOptions[1]);

  return (
    <div className="w-screen h-screen bg-gray-100">
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <OrbitControls />
        <ModelViewer
          modelPath="/models/pant.glb"
          selectedDecal={selectedDecal}
          filterMeshName="Pant"
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow space-x-2">
        {decalOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedDecal(option)}
            className={`px-3 py-1 rounded border ${
              selectedDecal === option
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {option?.image ? option.image.split("/").pop().split(".")[0] : "None"}
          </button>
        ))}
      </div>
    </div>
  );
}
