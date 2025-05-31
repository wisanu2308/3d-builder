import { ModelViewer } from "../components/ModelViewer";

export default function Backpack() {
  return (
    <div className="w-full h-screen">
      <ModelViewer modelPath="/models/backpack_example.glb" />
    </div>
  );
}
