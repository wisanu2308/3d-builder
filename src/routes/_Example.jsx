import { Icon } from "@iconify/react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const modelPath = "/models/example.glb";
const modelName = "ExampleModel";
const materialName01 = "Serviette";
const materialName02 = "Serviette_2";
const defaultShowColorPanel = false;
const isShowModelName = false;

const materialOptions = [
  {
    name: materialName01,
    colors: ["#F4A261", "#E76F51"],
  },
  {
    name: materialName02,
    colors: ["#C0C0C0", "#4A4A4A"],
  },
];

function Model({ selectedColors, onOriginalColors }) {
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

      const originalColors = materialOptions.map(() => null);

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

            const index = materialOptions.findIndex((m) => m.name === mat.name);
            if (index !== -1) {
              originalColors[
                index
              ] = `#${mat.userData.originalColor.getHexString()}`;
            }
          });
        }
      });
      onOriginalColors(originalColors);
    }
  }, [onOriginalColors]);

  useEffect(() => {
    if (ref.current) {
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

            const index = materialOptions.findIndex((m) => m.name === mat.name);
            if (index === -1 || !selectedColors[index]) return;

            mat.userData.targetColor = new THREE.Color(selectedColors[index]);
          });
        }
      });
    }
  }, [scene, selectedColors]);

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
  const [selectedColors, setSelectedColors] = useState(
    Array(materialOptions.length).fill(null)
  );

  const [customizingIndex, setCustomizingIndex] = useState(null);
  const [customColor, setCustomColor] = useState("#000000");
  const [showDialog, setShowDialog] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(defaultShowColorPanel);

  const [originalColors, setOriginalColors] = useState([]);
  const dialogRef = useRef(null);
  const colorPanelRef = useRef(null);

  useEffect(() => {
    if (originalColors.length > 0) {
      setSelectedColors(originalColors);
    }
  }, [originalColors]);

  // useEffect(() => {
  //   const handleOnClickOutside = (event) => {
  //     if (
  //       colorPanelRef.current &&
  //       !colorPanelRef.current.contains(event.target)
  //     ) {
  //       setShowColorPanel(false);
  //     }
  //   };

  //   if (showColorPanel) {
  //     document.addEventListener("mousedown", handleOnClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleOnClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleOnClickOutside);
  //   };
  // }, [showColorPanel]);

  useEffect(() => {
    const handleOnClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
      }
    };

    if (showDialog) {
      document.addEventListener("mousedown", handleOnClickOutside);
    } else {
      document.removeEventListener("mousedown", handleOnClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleOnClickOutside);
    };
  }, [showDialog]);

  const updateSelectedPantoneColor = (index, color) => {
    setSelectedColors((prev) => {
      const updated = [...prev];
      updated[index] = color;
      return updated;
    });
  };

  const openCustomColorDialog = (index) => {
    setCustomizingIndex(index);
    setCustomColor("#000000");
    setShowDialog(true);
  };

  const addCustomColor = () => {
    if (!customColor) return;
    materialOptions[customizingIndex].colors.push(customColor);
    updateSelectedPantoneColor(customizingIndex, customColor);
    setShowDialog(false);
  };

  return (
    <div className="relative w-screen h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Model Name Display */}
      {isShowModelName && (
        <div className="flex flex-row justify-start p-3 text-slate-500">
          <h2 className="text-xl font-semibold">{modelName}</h2>
        </div>
      )}

      {/* Color Panel */}
      <div ref={colorPanelRef} className="absolute z-50 left-0 bottom-0 w-full">
        <div
          onClick={() => setShowColorPanel((prev) => !prev)}
          className="w-max m-5 p-3 rounded-full shadow-md bg-white text-2xl text-slate-600 cursor-pointer"
        >
          <div
            className={`transition-all duration-500 ${
              !showColorPanel ? "" : "rotate-180"
            }`}
          >
            <Icon icon="icon-park-solid:up-one" />
          </div>
        </div>

        <div
          className={`
           p-4 w-full flex flex-col transition-all duration-300
          ${
            showColorPanel ? "gap-4 bg-white shadow-md" : "gap-0 bg-transparent"
          } 
        `}
        >
          <div
            className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${
              showColorPanel
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
          >
            {materialOptions.map((matItem, index) => {
              const originalColor = originalColors[index] || "transparent";
              const selected = selectedColors[index];

              return (
                <div key={index} className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <div className="font-semibold whitespace-nowrap">
                      Color #{index + 1}
                    </div>
                    <div className="text-xs text-gray-400">
                      ({matItem.name})
                    </div>
                  </div>
                  <div className="flex flex-row justify-start items-center gap-2 overflow-x-auto overflow-y-visible px-1 pt-2">
                    {/* Original Color */}
                    <button
                      onClick={() =>
                        updateSelectedPantoneColor(index, originalColor)
                      }
                      className={`w-10 h-10 rounded-full transition-all duration-100 border-4 ${
                        selected === originalColor
                          ? "border-blue-500"
                          : "border-slate-300"
                      }`}
                      style={{ background: originalColor }}
                      title="Original Color"
                    />

                    {/* Swatches */}
                    {matItem.colors.map((color, i) => (
                      <button
                        key={color + i}
                        onClick={() => updateSelectedPantoneColor(index, color)}
                        className={`w-10 h-10 rounded-full border-4 cursor-pointer ${
                          selected === color
                            ? "border-blue-500"
                            : "border-slate-300"
                        }`}
                        style={{ background: color }}
                        title={`Color ${i + 1}`}
                      />
                    ))}

                    {/* Custom Color Button */}
                    <button
                      onClick={() => openCustomColorDialog(index)}
                      className="w-10 h-10 rounded-full border-2 border-slate-400 flex items-center justify-center text-xl font-bold text-slate-600 cursor-pointer"
                      title="Add custom color"
                    >
                      <div className="-translate-y-0.5">+</div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div
            ref={dialogRef}
            className="relative max-w-xs w-full flex flex-col gap-2 transition-all duration-300 bg-white p-4 rounded shadow-lg"
          >
            <div className="absolute top-0 right-0 -translate-y-2">
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer p-2 rounded-full transition-colors"
                aria-label="Close dialog"
              >
                <div className="text-xl">&times;</div>
              </button>
            </div>

            <div className="flex flex-row items-center gap-2">
              <h3 className="font-semibold">Custom Color</h3>
              <div className="text-xs text-gray-400">
                ({materialOptions[customizingIndex].name})
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-12 cursor-pointer"
                aria-label="Select custom color"
              />
              <input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded"
                aria-label="Select custom color"
              />
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              {/* <button
                onClick={() => setShowDialog(false)}
                className="px-3 py-1 rounded border border-slate-400 hover:bg-slate-100 cursor-pointer"
                type="button"
              >
                Cancel
              </button> */}
              <button
                onClick={addCustomColor}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                type="button"
              >
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Model Canvas */}
      <div className="flex-grow transition-all duration-300">
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model
            selectedColors={selectedColors}
            onOriginalColors={setOriginalColors}
          />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
