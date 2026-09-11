"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { AlertCircle, ArrowLeft, FileText, Loader, Upload, Zap } from "lucide-react";
import { useLang } from "@/app/components/LanguageContext";

const STATUS_MESSAGES = {
  idle: { en: "Ready to scan", ne: "स्क्यान गर्न तयार" },
  uploading: { en: "Uploading report...", ne: "रिपोर्ट अपलोड गरिरहेको छ..." },
  analyzing: { en: "Analyzing with AI...", ne: "एआई द्वारा विश्लेषण गरिरहेको छ..." },
  saving: { en: "Saving results...", ne: "परिणाम सुरक्षित गरिरहेको छ..." },
  success: { en: "Analysis complete!", ne: "विश्लेषण पूर्ण!" },
};

export default function ScanPage() {
  const { lang, setLang } = useLang();
  const isNe = lang === "ne";
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSelectedFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (file.type.startsWith("image/")) {
        setPreview(event.target.result);
        setPreviewType("image");
      } else if (file.type === "application/pdf") {
        setPreview(null);
        setPreviewType("pdf");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError(isNe ? "कृपया फाइल छान्नुहोस्" : "Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setStatus("uploading");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Upload failed");
      }

      setStatus("saving");
      const result = await uploadResponse.json();

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      setStatus("success");

      // Store in session storage for the analysis page
      const analysisData = {
        reportId: result.data.reportId,
        fileName: result.data.fileName,
        reportName: result.data.fileName,
        saved: result.data.saved,
        summary: result.data.summary,
        reportSummary: result.data.reportSummary,
        confidence: result.data.confidence,
        results: (result.data.results || []).map((r) => ({
          testName: r.testName,
          value: r.value,
          unit: r.unit,
          referenceRange: r.referenceRange,
          status: r.status,
          explanation: r.explanation,
          explanationEn: r.explanation,
          explanationNe: r.explanation,
          guidanceEn: r.explanation,
          guidanceNe: r.explanation,
        })),
        statusCounts: {
          high: (result.data.results || []).filter((r) => r.status === "high").length,
          normal: (result.data.results || []).filter((r) => r.status === "normal").length,
          low: (result.data.results || []).filter((r) => r.status === "low").length,
          needs_review: (result.data.results || [])
            .filter((r) => r.status === "needs_review" || r.status === "unknown")
            .length,
        },
        summaryEn: result.data.summary,
        summaryNe: result.data.summary,
        abnormalFindings: result.data.abnormalFindings || [],
        normalFindings: result.data.normalFindings || [],
        recommendations: result.data.recommendations || [],
      };

      window.sessionStorage.setItem("reportscan_latest_analysis", JSON.stringify(analysisData));

      // Redirect to analysis page
      setTimeout(() => {
        window.location.href = "/report/analysis";
      }, 1000);
    } catch (err) {
      setStatus("idle");
      setLoading(false);
      const errorMsg =
        err instanceof Error
          ? err.message
          : isNe
            ? "रिपोर्ट विश्लेषण विफल भयो"
            : "Report analysis failed";
      setError(errorMsg);
      console.error("[ReportScan] Analysis error:", err);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPreviewType(null);
    setStatus("idle");
    setError(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="page-shell scan-page">
      <Link href="/" className="back-link">
        <ArrowLeft size={18} />
        {isNe ? "होमपेजमा फर्कनुहोस्" : "Back to Home"}
      </Link>

      <section className="section-heading">
        <p className="eyebrow">{isNe ? "स्क्यान गर्नुहोस्" : "Scan Report"}</p>
        <h1>{isNe ? "मेडिकल रिपोर्ट अपलोड गर्नुहोस्" : "Upload Medical Report"}</h1>
        <p>
          {isNe
            ? "JPG, PNG वा PDF फाइल अपलोड गर्नुहोस्"
            : "Upload a JPG, PNG, or PDF file for analysis"}
        </p>
      </section>

      {error && (
        <div className="notice error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="upload-panel">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden-input"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleFileSelect}
          disabled={loading}
        />

        {!selectedFile ? (
          <div className="action-grid">
            <button
              className="choice-button"
              onClick={handleUploadClick}
              disabled={loading}
            >
              <Upload size={28} />
              <div>
                <div style={{ fontWeight: 900 }}>
                  {isNe ? "फाइल छान्नुहोस्" : "Choose File"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {isNe ? "आपूर्तिकर्ताबाट एक फाइल छान्नुहोस्" : "Select a file from your device"}
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="preview-area">
            <div className="file-meta">
              <strong>{selectedFile.name}</strong>
              <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            {previewType === "image" && preview && (
              <img src={preview} alt="Report preview" className="image-preview" />
            )}
            {previewType === "pdf" && (
              <div className="pdf-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: "var(--muted)" }}>
                  <FileText size={48} style={{ marginBottom: "12px" }} />
                  <div>{selectedFile.name}</div>
                  <div style={{ fontSize: "0.9rem" }}>PDF Document</div>
                </div>
              </div>
            )}

            <div className="button-row">
              <button
                className="primary-action"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="spin" />
                    {isNe ? STATUS_MESSAGES[status].ne : STATUS_MESSAGES[status].en}
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    {isNe ? "विश्लेषण गर्नुहोस्" : "Analyze Report"}
                  </>
                )}
              </button>
              <button
                className="secondary-action"
                onClick={handleReset}
                disabled={loading}
              >
                {isNe ? "अन्य फाइल छान्नुहोस्" : "Choose Another File"}
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="info-list" style={{ marginTop: "24px" }}>
        <article>
          <FileText size={22} />
          <div>
            <h3>{isNe ? "समर्थित प्रारूप" : "Supported Formats"}</h3>
            <p>{isNe ? "JPG, PNG र PDF मेडिकल रिपोर्ट" : "JPG, PNG and PDF medical reports"}</p>
          </div>
        </article>
        <article>
          <Zap size={22} />
          <div>
            <h3>{isNe ? "एआई विश्लेषण" : "AI-Powered"}</h3>
            <p>
              {isNe
                ? "Gemini द्वारा सुरक्षित विश्लेषण"
                : "Secure analysis powered by Google Gemini"}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
