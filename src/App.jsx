import { useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [copiedUrl, setCopiedUrl] = useState(null);

  const copyToClipboard = (url) => {
    const iframeCode = `
      <div style="width: 100%">
        <iframe
          src="https://ly3dbuilder.netlify.app${url}"
          style="width: 100%; height: 100%; border: none; overflow: hidden;"
          scrolling="no"
          allowfullscreen
        ></iframe>
      </div>
    `;

    navigator.clipboard.writeText(iframeCode).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000); // รีเซ็ตหลัง 2 วิ
    });
  };

  const ModelItems = ({ title, url }) => (
    <div className="w-full flex flex-col items-start px-3">
      <div className="w-full md:w-1/2 mx-auto flex flex-row justify-between items-center gap-4 border p-4">
        <div className="w-1/2">
          <div>{title}</div>
        </div>
        <div className="w-1/2 flex flex-col justify-end items-end gap-2 text-sm">
          <Link to={url}>
            <div className="w-[100px] text-center cursor-pointer py-1 rounded transition duration-200 bg-white hover:bg-slate-100 border">
              Model Viewer
            </div>
          </Link>
          <div
            onClick={() => copyToClipboard(url)}
            className="w-[100px] text-center cursor-pointer py-1 rounded transition duration-200 bg-white hover:bg-slate-100 border"
          >
            {copiedUrl === url ? "Copied!" : "Embed Code"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-center items-center text-xl py-10 gap-10">
      <div className="text-3xl font-bold">3D Builder</div>
      <div className="w-full flex flex-col items-start gap-2">
        <ModelItems title={"(( ≖‿ ≖ ))"} url="/anya-forger" />
        <ModelItems title={"Example Mesh"} url="/example" />
        <ModelItems title={"Backpack"} url="/backpack" />
        <ModelItems title={"Fabric Sale"} url="/fabric-sale" />
      </div>
    </div>
  );
}
