import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

export const QrGenerator = () => {
  const [text, setText] = useState("https://tooloplatform.com");
  const [qrUrl, setQrUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text) {
         QRCode.toDataURL(text, { 
           width: 300, 
           margin: 2,
           color: {
             dark: '#0f172a',
             light: '#ffffff'
           }
         }, (err, url) => {
           if (!err) setQrUrl(url);
         });
    } else {
         setQrUrl("");
    }
  }, [text]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div>
          <label htmlFor="qr-text" className="block text-sm font-medium text-slate-700">
            Text or URL
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. https://google.com"
              className="block w-full rounded-xl border-0 bg-slate-50 py-3 px-4 text-slate-900 ring-1 ring-slate-200 transition-shadow focus:bg-white focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Type anything into the box above and we will instantly generate a readable QR code.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-8 shadow-inner ring-1 ring-slate-200">
         {qrUrl ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="overflow-hidden rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
                <img src={qrUrl} alt="Generated QR Code" className="h-48 w-48 object-contain" />
              </div>
              <a 
                href={qrUrl} 
                download="toolo-qr.png"
                className="inline-flex w-full min-w-[200px] justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Download QR (PNG)
              </a>
            </div>
         ) : (
            <p className="text-slate-400 text-sm">Enter text to generate</p>
         )}
      </div>
    </div>
  );
};
