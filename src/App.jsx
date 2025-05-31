import { useState } from "react";
import { Link } from "react-router-dom";

const iframeCode = `<div style="width: 100%">
  <iframe
    src="https://ly3dbuilder.netlify.app/backpack"
    style="width: 100%; height: 100%; border: none; overflow: 'hidden'"
    scrolling="no"
    allowfullscreen
  ></iframe>
</div>`;

export default function App() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // รีเซ็ตข้อความหลัง 2 วินาที
    });
  };

  const EmbedButton = (
  { url } = { url: "/backpack" } 
  ) => (
    <div className="w-full flex justify-center py-3">
      { url }
      <div
        onClick={copyToClipboard}
        className="w-max cursor-pointer px-3 py-1 rounded transition bg-white border"
      >
        {copied ? "Copied!" : "Embed Code"}
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col items-center gap-6 text-xl">
      <h1 className="text-3xl font-bold">3D Builder</h1>
      <div className="flex flex-row gap-2">
        <Link to="/backpack" className="text-blue-500">
          Backpack
        </Link>
        <div><EmbedButton url="/backpack" /></div>
      </div>
      <div className="flex flex-row gap-2">
        <Link to="/tshirt" className="text-blue-500">
          T-Shirt
        </Link>
        <div><EmbedButton url="/tshirt" /></div>
      </div>
      <div className="flex flex-row gap-2">
        <Link to="/hat" className="text-blue-500">
          Hat
        </Link>
        <div><EmbedButton url="/hat" /></div>
      </div>
    </div>
  );
}
