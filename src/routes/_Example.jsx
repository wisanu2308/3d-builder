import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";

const modelPath = "/models/example.glb";
const materialName01 = "Serviette";
const materialName02 = "Serviette_2";

const initialColorPantones = [
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
      index01: "#85D1E2",
      index02: "#D0493B",
    },
  },
  {
    name: "Pantone 02",
    colors: {
      index01: "#EDEBB3",
      index02: "#33763D",
    },
  },
  {
    name: "Pantone 03",
    colors: {
      index01: "#ECBCCD",
      index02: "#7DCBE7",
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
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      // เปลี่ยนสีแบบ targetColor
      ref.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if (!mat || typeof mat.name !== "string") return;

            if (!mat.userData.originalColor) {
              mat.userData.originalColor = mat.color.clone();
            }

            let targetColor;
            if (selectedPantone.name === "default") {
              targetColor = mat.userData.originalColor;
            } else if (mat.name === materialName01) {
              targetColor = new THREE.Color(selectedPantone.colors.index01);
            } else if (mat.name === materialName02) {
              targetColor = new THREE.Color(selectedPantone.colors.index02);
            } else {
              return;
            }

            mat.userData.targetColor = targetColor;
          });
        }
      });
    }
  }, [scene, selectedPantone]);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          if (!mat.color || !mat.userData.targetColor) return;
          mat.color.lerp(mat.userData.targetColor, 0.1);
        });
      }
    });
  });

  return <primitive object={scene} ref={ref} />;
}

export default function ExampleMesh() {
  const [colorPantones, setColorPantones] = useState(initialColorPantones);
  const [selectedPantone, setSelectedPantone] = useState(
    initialColorPantones[0]
  );
  const [showDialog, setShowDialog] = useState(false);
  const [customColor01, setCustomColor01] = useState("#ffffff");
  const [customColor02, setCustomColor02] = useState("#ffffff");

  const handleAddCustom = () => {
    setCustomColor01("#ffffff");
    setCustomColor02("#ffffff");
    setShowDialog(true);
  };

  const handleConfirmCustom = () => {
    const newPantone = {
      name: `Custom ${colorPantones.length}`,
      colors: {
        index01: customColor01,
        index02: customColor02,
      },
    };
    setColorPantones([...colorPantones, newPantone]);
    setSelectedPantone(newPantone);
    setShowDialog(false);
  };

  const handleDeletePantone = (name) => {
    setColorPantones((prevPantones) => {
      const updated = prevPantones.filter((p) => p.name !== name);
      // If deleted pantone is currently selected, revert to default
      if (selectedPantone.name === name) {
        setSelectedPantone(prevPantones[0]); // default
      }
      return updated;
    });
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col overflow-hidden">
      <div className="relative p-4 bg-white shadow-md flex flex-col md:flex-row items-start gap-2 md:gap-4">
        <span className="relative z-0 font-semibold">Select Colors:</span>
        <div className="relative z-0 flex items-center gap-2 overflow-x-auto max-w-full px-1">
          {colorPantones.map((pantone) => (
            <div
              key={pantone.name}
              className="relative z-10 flex items-center gap-1 px-1"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
                <button
                  onClick={() => {
                    setSelectedPantone(pantone);
                    setShowDialog(false);
                  }}
                  className={`w-10 h-10 rounded-full cursor-pointer border-4 ${
                    selectedPantone.name === pantone.name && !showDialog
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
                  type="button"
                />
                {pantone.name.startsWith("Custom") && (
                  <button
                    onClick={() => handleDeletePantone(pantone.name)}
                    className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full text-white cursor-pointer hover:bg-red-600 border-2 border-white absolute top-0 right-0"
                    style={{ transform: "translate(40%, -40%)" }}
                    title="Delete"
                    type="button"
                  >
                    <div className="-translate-y-[1px]">&times;</div>
                  </button>
                )}
              </div>
            </div>
          ))}
          {!showDialog && (
            <button
              onClick={handleAddCustom}
              className="w-10 h-10 rounded-full cursor-pointer border-4 border-slate-300 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0 ml-1"
              title="Add Custom"
              type="button"
            >
              <div className="-translate-y-[1px]">+</div>
            </button>
          )}
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded shadow-lg flex flex-col items-center gap-4">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-0 right-2 cursor-pointer text-2xl text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <div className="-translate-y-[1px]">&times;</div>
            </button>
            <h2 className="text-lg font-semibold">Add Custom Colors</h2>
            <div className="flex flex-col gap-2 w-full">
              {[1, 2].map((index) => {
                const color = index === 1 ? customColor01 : customColor02;
                const setColor =
                  index === 1 ? setCustomColor01 : setCustomColor02;
                return (
                  <div
                    className="flex flex-col items-start w-full"
                    key={index}
                  >
                    <div className="text-xs font-medium text-gray-500">
                      Color Index {index}:
                    </div>
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 h-10 p-0 border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 font-mono"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleConfirmCustom}
              className="px-4 py-1 cursor-pointer text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <div className="flex-grow transition-all duration-300">
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
