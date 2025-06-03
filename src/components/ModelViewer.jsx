import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function ModelViewer({ selectedDecal, selectedColor, modelPath }) {
  const { scene } = useGLTF(modelPath);

  const meshList = useMemo(() => {
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });
    return meshes;
  }, [scene]);

  const decalTextureMap = useTexture({
    "/textures/kitty.png": "/textures/kitty.png",
    "/textures/dog.png": "/textures/dog.png",
  });

  useEffect(() => {
    scene.position.set(0, -1, 0); // ดันโมเดลลงให้อยู่กลางจอ
  }, [scene]);

  return (
    <primitive object={scene}>
      {meshList.map((mesh, idx) => {
        const isWaistband = mesh.name.toLowerCase().includes("waist");
        const decalTexture =
          selectedDecal?.image && decalTextureMap[selectedDecal.image];

        // ถ้าอยากเปลี่ยนสีทุก mesh ให้ใช้ material ใหม่ที่ใช้ selectedColor
        const customMaterial = new THREE.MeshStandardMaterial({
          color: selectedColor || "#ffffff",
        });

        return (
          <mesh
            key={idx}
            geometry={mesh.geometry}
            material={customMaterial}
            position={mesh.position}
            rotation={mesh.rotation}
            scale={mesh.scale}
            castShadow
            receiveShadow
          >
            {selectedDecal && decalTexture && isWaistband && (
              <Decal
                map={decalTexture}
                position={selectedDecal.position}
                rotation={selectedDecal.rotation}
                scale={selectedDecal.scale}
                depthTest={false}
                depthWrite={true}
              />
            )}
          </mesh>
        );
      })}
    </primitive>
  );
}
