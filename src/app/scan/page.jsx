"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, FileUp, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

export default function ScanPage() {
  const { lang } = useLang();
  const isNe = lang === "ne";
  const router = useRouter();
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const chooseFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(isNe ? "कृपया JPG, PNG वा PDF मात्र अपलोड गर्नुहोस्।" : "Please upload only JPG, PNG, or PDF files.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setReportText("");
    setError("");
  };

  const analyzeReport = async () => {
    if (!file) {
      setError(isNe ? "पहिले रिपोर्ट छान्नुहोस्।" : "Choose a report first.");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          reportText,
          lang,
        }),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Analysis failed");
      }

      sessionStorage.setItem("reportscan_latest_analysis", JSON.stringify(json.data));
      router.push("/report/analysis");
    } catch {
      setError(
        isNe
          ? "विश्लेषण गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।"
          : "Could not analyze this report. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-shell scan-page">
      <section className="section-heading">
        <p className="eyebrow">{"Home -> Upload/Scan Report -> Analyze -> Results"}</p>
        <h1>{isNe ? "रिपोर्ट स्क्यान वा अपलोड गर्नुहोस्" : "Upload or Scan Report"}</h1>
        <p>
          {isNe
            ? "रिपोर्ट स्पष्ट, सीधा र राम्रो प्रकाशमा भएको निश्चित गर्नुहोस्।"
            : "Make sure the report is clear, straight, and well lit."}
        </p>
      </section>

      <section className="upload-panel">
        <div className="action-grid">
          <button type="button" onClick={() => cameraInputRef.current?.click()} className="choice-button">
            <Camera size={26} />
            <span>{isNe ? "क्यामेराबाट फोटो लिनुहोस्" : "Take Report Photo"}</span>
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="choice-button">
            <FileUp size={26} />
            <span>{isNe ? "फाइल अपलोड गर्नुहोस्" : "Upload JPG/PNG/PDF"}</span>
          </button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          className="hidden-input"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden-input"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />

        {error && (
          <div className="notice error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {file && (
          <div className="preview-area">
            <div className="file-meta">
              <strong>{file.name}</strong>
              <span>{file.type === "application/pdf" ? "PDF" : "Image"}</span>
            </div>

            {file.type === "application/pdf" ? (
              <object data={preview} type="application/pdf" className="pdf-preview">
                <p>{isNe ? "PDF पूर्वावलोकन उपलब्ध छैन।" : "PDF preview is not available."}</p>
              </object>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Selected medical report preview" className="image-preview" />
            )}

            <label className="text-label" htmlFor="reportText">
              {isNe ? "रिपोर्टबाट पढिएको पाठ वा मुख्य परिणामहरू" : "Readable text or key results from the report"}
            </label>
            <textarea
              id="reportText"
              value={reportText}
              onChange={(event) => setReportText(event.target.value)}
              rows={7}
              placeholder={
                isNe
                  ? "उदाहरण: Hemoglobin 12.1 g/dL Reference 13-17 g/dL"
                  : "Example: Hemoglobin 12.1 g/dL Reference 13-17 g/dL"
              }
            />
            <p className="helper-text">
              {isNe
                ? "यदि एपले रिपोर्टबाट दायरा पढ्न सकेन भने परिणाम NEEDS REVIEW देखिन्छ।"
                : "If a value or reference range cannot be read, the result is marked NEEDS REVIEW."}
            </p>

            <div className="button-row">
              <button type="button" className="secondary-action" onClick={reset}>
                <RotateCcw size={18} />
                {isNe ? "फेरि छान्नुहोस्" : "Replace"}
              </button>
              <button type="button" className="primary-action compact" onClick={analyzeReport} disabled={isAnalyzing}>
                {isAnalyzing ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
                {isAnalyzing ? (isNe ? "विश्लेषण हुँदैछ" : "Analyzing") : (isNe ? "विश्लेषण गर्नुहोस्" : "Analyze")}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
