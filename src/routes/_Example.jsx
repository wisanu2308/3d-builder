import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";

const modelPath = "/models/example.glb";
const materialName01 = "Serviette";
const materialName02 = "Serviette_2";

const colorPantones = [
  {
    name: "default",
    colors: {
      index01: "transparent", // สีโปร่งใส
      index02: "transparent", // สีโปร่งใส
    },
  },
  {
    name: "Pantone 01",
    colors: {
      index01: "#000000", // สีดำ
      index02: "#FFFFFF", // สีขาว
    },
  },
  {
    name: "Pantone 02",
    colors: {
      index01: "#FF0000", // สีแดง
      index02: "#00FF00", // สีเขียว
    },
  },
  {
    name: "Pantone 03",
    colors: {
      index01: "#0000FF", // สีน้ำเงิน
      index02: "#FFFF00", // สีเหลือง
    },
  },
];

function Model({ selectedPantone }) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const box = new THREE.Box3();
      ref.current.traverse((child) => {
        if (child.isMesh) box.expandByObject(child);
      });

      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      ref.current.scale.setScalar(scale);

      const center = new THREE.Vector3();
      box.getCenter(center);
      ref.current.position.sub(center);

      // เปลี่ยนสี
      ref.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if (!mat || typeof mat.name !== "string") return;

            // Save original color once
            if (!mat.userData.originalColor) {
              mat.userData.originalColor = mat.color.clone();
            }

            if (selectedPantone.name === "default") {
              mat.color.copy(mat.userData.originalColor);
              mat.needsUpdate = true;
              return;
            }

            if (mat.name === materialName01) {
              if (mat.map) mat.map = null; // ถ้ามี texture อยู่จะลบทิ้งก่อน
              mat.color.set(selectedPantone.colors.index01); // ใช้สีจาก selectedPantone
              mat.needsUpdate = true;
            }

            if (mat.name === materialName02) {
              if (mat.map) mat.map = null; // ถ้ามี texture อยู่จะลบทิ้งก่อน
              mat.color.set(selectedPantone.colors.index02); // ใช้สีจาก selectedPantone
              mat.needsUpdate = true;
            }

            mat.needsUpdate = true;
          });

        }
      });
    }
  }, [scene, selectedPantone]);

  return <primitive object={scene} ref={ref} />;
}

export default function ExampleMesh() {
  const [selectedPantone, setSelectedPantone] = useState(colorPantones[0]);

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col">
      <div className="p-4 bg-white shadow-md flex items-center gap-4">
        <span className="font-semibold">Select Pantone:</span>
        <div className="flex items-center gap-2">
          {colorPantones.map((pantone) => (
            <button
              key={pantone.name}
              onClick={() => setSelectedPantone(pantone)}
              className={`w-10 h-10 rounded-full cursor-pointer border-4 ${
                selectedPantone.name === pantone.name
                  ? "border-blue-500"
                  : "border-slate-300"
              }`}
              style={{
                background: `linear-gradient(
                  135deg,
                  ${pantone.colors.index01} 50%,
                  ${pantone.colors.index02} 50%
                )`,
              }}
              title={pantone.name}
            />
          ))}
        </div>
      </div>
      <div className="flex-grow">
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model selectedPantone={selectedPantone} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
