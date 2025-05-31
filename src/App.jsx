import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-xl">
      <h1 className="text-3xl font-bold">3D Builder</h1>
      <Link to="/backpack" className="text-blue-500 underline">Backpack</Link>
      <Link to="/tshirt" className="text-blue-500 underline">T-Shirt</Link>
      <Link to="/hat" className="text-blue-500 underline">Hat</Link>
    </div>
  );
}
