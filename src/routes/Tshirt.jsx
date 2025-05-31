import { ModelViewer } from "../components/ModelViewer";

export default function Tshirt() {
  return (
    <div className="w-full h-screen">
      <ModelViewer modelPath="/models/backpack_example.glb" />
    </div>
  );
}
