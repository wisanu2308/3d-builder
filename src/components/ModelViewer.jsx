import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

const colorOptions = [
  "transparent",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFD700",
  "#FF69B4",
];

const textureOptions = [
  null,
  {
    image: "/textures/panda.png",
    settings: {
      repeat: [1, 1],
      offset: [0, 0],
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    },
  },
];

// const decalOptions = [
//   null,
//   {
//     image: "/textures/panda.png",
//     position: [0, 0.5, 0],
//     rotation: [0, 0, 0],
//     scale: [1, 1, 1],
//   },
// ];

export function ModelViewer({ modelPath }) {
  const { scene } = useGLTF(modelPath);

  const [color, setColor] = useState("#FF0000");
  const [wireframe, setWireframe] = useState(false);

  const [selectedTexture, setSelectedTexture] = useState(null);
  //   const [selectedDecal, setSelectedDecal] = useState(null);

  const textures = useLoader(
    TextureLoader,
    textureOptions.filter(Boolean).map((tex) => tex.image)
  );

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

        // Texture mapping
        if (selectedTexture === null) {
          child.material.map = null;
        } else {
          const index = textureOptions.findIndex(
            (t) => t?.image === selectedTexture.image
          );
          const tex = textures[index - 1]; // -1 เพราะ null คือ index 0
          const { repeat, offset, wrapS, wrapT } = selectedTexture.settings;

          tex.repeat.set(...repeat);
          tex.offset.set(...offset);
          tex.wrapS = wrapS;
          tex.wrapT = wrapT;
          tex.needsUpdate = true;

          child.material.map = tex;
        }

        child.material.wireframe = wireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [color, wireframe, scene, selectedTexture, textures]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center">
      {/* Colors Control Panel */}
      <div
        className="
          absolute z-10 gap-2 p-4 bg-white bg-opacity-80 rounded
          flex flex-col md:flex-col
          top-4
          left-1/2 -translate-x-1/2
          md:left-4 md:top-4 md:translate-x-0
        "
      >
        <div className="flex flex-wrap justify-center md:flex-col md:justify-start gap-2">
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
        </div>
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

      {/* Textures Control Panel */}
      <div
        className="
            absolute z-10 p-4 bg-white bg-opacity-80 rounded
            flex gap-2 flex-wrap
            right-4 md:right-4
            md:flex-col
            bottom-4 
            md:top-4
            md:bottom-auto
            left-1/2 transform -translate-x-1/2 md:transform-none
            md:left-auto md:translate-x-0
        "
      >
        {textureOptions.map((tex, i) => (
          <div
            key={i}
            onClick={() => setSelectedTexture(tex)}
            className="w-20 h-20 rounded cursor-pointer border border-gray-300 shadow bg-cover bg-center"
            style={{
              backgroundImage: tex?.image
                ? `url(${tex.image})`
                : "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 10px 10px",
            }}
            title={tex?.image || "No Texture"}
          />
        ))}
      </div>

      {/* Canvas 3D */}
      <div className="w-full h-full md:flex-1 aspect-[9/16] md:aspect-auto">
        <Canvas className="w-full h-full">
          <ambientLight />
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <primitive object={scene} scale={0.8} />
            </Stage>
          </Suspense>
          <OrbitControls enableZoom />
        </Canvas>
      </div>
    </div>
  );
}
