// import { useState } from "react";
import { ModelViewer } from "../components/ModelViewer";



export default function Backpack() {
  

  return (
    <div className="w-full flex flex-col justify-start items-start">
      

      <div className="w-full h-full">
        <ModelViewer modelPath="/models/backpack_example.glb" />
      </div>
    </div>
  );
}
