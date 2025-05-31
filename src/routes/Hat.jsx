import { ModelViewer } from "../components/ModelViewer";

export default function Hat() {
  return (
    <div className="w-full h-screen">
      <ModelViewer modelPath="/models/backpack_example.glb" />
    </div>
  );
}
