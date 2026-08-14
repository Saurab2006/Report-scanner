"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, RotateCcw, ScanLine, Check, Sparkles, AlertCircle, ChevronRight } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

export default function ScanPage() {
  const { lang } = useLang();
  const isNe = lang === "ne";
  const router = useRouter();
  const videoRef = useRef(null);
  const [mode, setMode] = useState("choose");
  const [captured, setCaptured] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setMode("camera");
    } catch {
      setMode("upload");
    }
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      setCaptured(dataUrl);
      setMode("preview");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject ).getTracks().forEach((t) => t.stop());
    }
    setMode("choose");
  };

  // Upload / drop
  const onFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCaptured(reader.result);
      setMode("preview");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    setMode("analyzing");
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileType: "image" }) });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
        // Save to DB via server action? For demo, pass via local state to report page
        // We'll redirect with a query param or just show result directly
        // For simplicity, redirect to a simulated result page
        router.push(`/report/analysis?data=` + encodeURIComponent(JSON.stringify(json.data)));
      } else {
        setMode("done");
      }
    } catch {
      setMode("done");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-3">{isNe ? "आफ्नो रिपोर्ट स्क्यान गर्नुहोस्" : "Scan Your Medical Report"}</h1>
          <p className="text-slate-500 text-lg">{isNe ? "स्पष्ट रिपोर्ट अपलोड गर्नुहोस् वा क्यामेराबाट क्याप्चर गर्नुहोस्।" : "Upload a clear report or scan it using your camera."}</p>
        </div>

        {mode === "choose" && (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button onClick={startCamera} className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-10 shadow-2xl shadow-blue-200/40 hover:scale-[1.02] transition-all text-left group">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6"><Camera size={32} /></div>
              <h2 className="text-2xl font-extrabold mb-2">{isNe ? "📷 क्यामेराबाट" : "📷 Scan With Camera"}</h2>
              <p className="text-blue-100/80 text-sm leading-relaxed">{isNe ? "आफ्नो क्यामेराबाट रिपोर्ट क्याप्चर गर्नुहोस्।" : "Use your camera to capture your medical report."}</p>
              <span className="inline-block mt-4 bg-white text-blue-700 font-bold text-sm px-4 py-2 rounded-full">{isNe ? "क्यामेरा खोल्नुहोस्" : "Open Camera"}</span>
            </button>
            <button onClick={() => { setMode("upload"); setCaptured(null); }} className="bg-white border-2 border-blue-100 rounded-3xl p-10 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:scale-[1.02] transition-all text-left group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center mb-6"><Upload size={32} /></div>
              <h2 className="text-2xl font-extrabold text-blue-950 mb-2">{isNe ? "📁 अपलोड" : "📁 Upload Report"}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{isNe ? "JPG, PNG, WEBP, वा PDF अपलोड गर्नुहोस्।" : "Accept JPG, PNG, WEBP, or PDF."}</p>
              <span className="inline-block mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm px-4 py-2 rounded-full">{isNe ? "फाइल छनौट" : "Choose File"}</span>
            </button>
          </div>
        )}

        {mode === "camera" && (
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
              <video ref={videoRef} className="w-full h-[60vh] object-cover" playsInline muted autoPlay />
              {/* Scanning frame overlay */}
              <div className="absolute inset-8 border-2 border-white/40 rounded-3xl pointer-events-none">
                <div className="absolute top-[-12px] left-[-12px] w-6 h-6 border-t-4 border-l-4 border-pink-400 rounded-tl-lg" />
                <div className="absolute top-[-12px] right-[-12px] w-6 h-6 border-t-4 border-r-4 border-pink-400 rounded-tr-lg" />
                <div className="absolute bottom-[-12px] left-[-12px] w-6 h-6 border-b-4 border-l-4 border-pink-400 rounded-bl-lg" />
                <div className="absolute bottom-[-12px] right-[-12px] w-6 h-6 border-b-4 border-r-4 border-pink-400 rounded-br-lg" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button onClick={stopCamera} className="bg-white/10 text-white font-semibold px-4 py-2 rounded-full backdrop-blur">{isNe ? "रद्द गर्नुहोस्" : "Cancel"}</button>
                <button onClick={capture} className="bg-white text-blue-900 font-extrabold px-6 py-2 rounded-full shadow-xl flex items-center gap-2"><ScanLine size={18} /> {isNe ? "क्याप्चर" : "Capture"}</button>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">{isNe ? "लाईनभित्र पूरा रिपोर्ट राख्नुहोस्। प्रकाश राम्रो बनाउनुहोस्।" : "Place the entire report inside the frame. Make sure the report is flat, well-lit, and readable."}</p>
          </div>
        )}

        {mode === "upload" && (
          <div className="max-w-xl mx-auto">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${dragOver ? "border-pink-400 bg-pink-50/40 scale-[1.02]" : "border-blue-200 bg-blue-50/30"}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg"><Upload size={28} /></div>
              <h3 className="text-xl font-extrabold text-blue-950 mb-2">{isNe ? "फाइल यहाँ तान्नुहोस्" : "Drag & Drop Here"}</h3>
              <p className="text-slate-500 text-sm mb-4">{isNe ? "वा फाइल छनौट गर्नुहोस्" : "or click to browse files"}</p>
              <input type="file" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="inline-block bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform">{isNe ? "फाइल छनौट" : "Choose File"}</label>
            </div>
          </div>
        )}

        {mode === "preview" && captured && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-3">
              <img src={captured} alt="Report preview" className="w-full rounded-2xl max-h-[60vh] object-contain bg-slate-50" />
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setCaptured(null); setMode("choose"); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">{isNe ? "पुनः प्रयास" : "Retake"}</button>
                <button onClick={() => { setMode("upload"); setCaptured(null); }} className="flex-1 py-2.5 rounded-xl border border-blue-200 text-blue-600 font-semibold hover:bg-blue-50">{isNe ? "फेरि अपलोड" : "Replace"}</button>
                <button onClick={analyze} className="flex-1 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-extrabold py-2.5 rounded-xl shadow-lg shadow-blue-200/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"><Sparkles size={18} /> {isNe ? "विश्लेषण गर्नुहोस्" : "Analyze Report"}</button>
              </div>
            </div>
          </div>
        )}

        {mode === "analyzing" && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-pink-400 animate-spin" />
            </div>
            <h2 className="text-3xl font-extrabold text-blue-950 mb-2">{isNe ? "तपाईंको रिपोर्ट बुझ्दैछ..." : "Understanding Your Report..."}</h2>
            <div className="space-y-3 max-w-md mx-auto text-sm text-slate-600">
              {[
                isNe ? "✓ रिपोर्ट पढ्दै" : "✓ Reading report",
                isNe ? "✓ परीक्षण नाम पत्ता लगाउँदै" : "✓ Detecting test names",
                isNe ? "✓ मूल्य निकाल्दै" : "✓ Extracting values",
                isNe ? "✓ सन्दर्भ दायरा पत्ता लगाउँदै" : "✓ Finding reference ranges",
                isNe ? "✓ परिणाम जाँच गर्दै" : "✓ Checking results",
                isNe ? "✓ व्याख्या तयार गर्दै" : "✓ Preparing explanations",
                isNe ? "✓ भाषा तयार गर्दै" : "✓ Preparing language",
              ].map((step) => (
                <div key={step} className="flex items-center gap-3 bg-blue-50/50 px-4 py-2 rounded-xl font-medium">{step}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
