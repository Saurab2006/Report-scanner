const UNIT_WORDS = "(?:mg/dL|g/dL|mmol/L|mIU/L|uIU/mL|IU/L|U/L|ng/mL|pg/mL|fL|%|/uL|/µL|10\\^3/uL|10\\^6/uL|cells/uL)?";

function cleanText(value = "") {
  return String(value)
    .replace(/\r/g, "\n")
    .replace(/[–—]/g, "-")
    .replace(/[<>=]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function toNumber(value) {
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseLine(line) {
  const normalized = cleanText(line);
  const match = normalized.match(
    new RegExp(
      `^([A-Za-z][A-Za-z0-9 /().%+-]{1,45}?)\\s+(-?\\d+(?:\\.\\d+)?)\\s*(${UNIT_WORDS})\\s+(?:ref(?:erence)?\\s*(?:range)?\\s*)?(-?\\d+(?:\\.\\d+)?)\\s*-\\s*(-?\\d+(?:\\.\\d+)?)\\s*(${UNIT_WORDS})?`,
      "i"
    )
  );

  if (!match) return null;

  const value = toNumber(match[2]);
  const low = toNumber(match[4]);
  const high = toNumber(match[5]);
  if (value === null || low === null || high === null) return null;

  const unit = match[3] || match[6] || "";
  let status = "normal";
  if (value < low) status = "low";
  if (value > high) status = "high";

  return {
    testName: match[1].replace(/\s+/g, " ").trim(),
    value: match[2],
    numericValue: value,
    unit,
    referenceRange: `${match[4]}-${match[5]}${unit ? ` ${unit}` : ""}`,
    status,
    explanationEn: explanationFor(status),
    explanationNe: explanationFor(status, true),
    guidanceEn: guidanceFor(status),
    guidanceNe: guidanceFor(status, true),
  };
}

function findNeedsReviewLines(text) {
  return cleanText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /[A-Za-z]/.test(line) && /\d/.test(line))
    .slice(0, 8)
    .map((line) => ({
      testName: line.replace(/\s+/g, " ").slice(0, 48),
      value: "Needs review",
      numericValue: null,
      unit: "",
      referenceRange: "Not clearly found in uploaded report",
      status: "needs_review",
      explanationEn: "This line could not be read with enough confidence to compare it against a reference range.",
      explanationNe: "यो पंक्ति सन्दर्भ दायरासँग भरपर्दो रूपमा तुलना गर्न पर्याप्त स्पष्ट पढ्न सकिएन।",
      guidanceEn: "Ask a qualified healthcare professional or lab staff to review the original report.",
      guidanceNe: "मूल रिपोर्ट स्वास्थ्यकर्मी वा ल्याब कर्मचारीलाई देखाएर समीक्षा गराउनुहोस्।",
    }));
}

function explanationFor(status, ne = false) {
  if (status === "high") {
    return ne
      ? "यो परिणाम रिपोर्टमा दिइएको सन्दर्भ दायराभन्दा माथि छ। यसको अर्थ रिपोर्ट, उमेर, लक्षण र स्वास्थ्य इतिहाससँगै बुझ्नुपर्छ।"
      : "This result is above the reference range shown on the report. It should be interpreted with your symptoms, age, and health history.";
  }
  if (status === "low") {
    return ne
      ? "यो परिणाम रिपोर्टमा दिइएको सन्दर्भ दायराभन्दा कम छ। स्वास्थ्यकर्मीले तपाईंको सम्पूर्ण अवस्थासँगै यसको अर्थ बताउन सक्छन्।"
      : "This result is below the reference range shown on the report. A healthcare professional can interpret it in your full context.";
  }
  return ne
    ? "यो परिणाम रिपोर्टमा दिइएको सन्दर्भ दायराभित्र छ। यदि लक्षण छन् भने स्वास्थ्यकर्मीसँग कुरा गर्नुहोस्।"
    : "This result is within the reference range shown on the report. If you have symptoms, discuss them with a healthcare professional.";
}

function guidanceFor(status, ne = false) {
  if (status === "normal") {
    return ne
      ? "स्वस्थ बानी जारी राख्नुहोस्: पर्याप्त पानी, निद्रा, शारीरिक गतिविधि र नियमित फलोअप।"
      : "Keep healthy habits: hydration, sleep, physical activity, and routine follow-up.";
  }
  return ne
    ? "आफ्नो रिपोर्ट, लक्षण र हालको औषधिबारे योग्य स्वास्थ्यकर्मीसँग परामर्श गर्नुहोस्। आफैं औषधि सुरु, बन्द वा मात्रा परिवर्तन नगर्नुहोस्।"
    : "Discuss your report, symptoms, and current medicines with a qualified healthcare professional. Do not start, stop, or change medicine on your own.";
}

function buildCounts(results) {
  return results.reduce(
    (counts, result) => {
      counts[result.status] = (counts[result.status] || 0) + 1;
      return counts;
    },
    { high: 0, normal: 0, low: 0, needs_review: 0 }
  );
}

export function analyzeReport({ fileName = "Medical report", fileType = "", reportText = "" }) {
  const lines = cleanText(reportText).split("\n").filter(Boolean);
  const parsed = lines.map(parseLine).filter(Boolean);
  const results = parsed.length > 0 ? parsed : findNeedsReviewLines(reportText);

  const finalResults =
    results.length > 0
      ? results
      : [
          {
            testName: "Uploaded report",
            value: "Needs review",
            numericValue: null,
            unit: "",
            referenceRange: "No readable values or reference ranges were provided",
            status: "needs_review",
            explanationEn: "The file was uploaded, but this lightweight version cannot safely extract text from the image or PDF without readable text.",
            explanationNe: "फाइल अपलोड भयो, तर पढ्न मिल्ने पाठ बिना यो हल्का संस्करणले छवि वा PDF बाट सुरक्षित रूपमा परिणाम निकाल्न सकेन।",
            guidanceEn: "Paste the report text or ask a qualified healthcare professional to review the original report.",
            guidanceNe: "रिपोर्टको पाठ पेस्ट गर्नुहोस् वा योग्य स्वास्थ्यकर्मीलाई मूल रिपोर्ट देखाउनुहोस्।",
          },
        ];

  const counts = buildCounts(finalResults);
  const total = finalResults.length;

  return {
    reportName: fileName,
    reportType: fileType === "application/pdf" ? "PDF report" : "Image report",
    summaryEn:
      parsed.length > 0
        ? `${total} result${total === 1 ? "" : "s"} were compared with reference ranges found in the report text. Items without a clear range should be reviewed by a professional.`
        : "The report needs review because no clear test values with reference ranges were available to compare.",
    summaryNe:
      parsed.length > 0
        ? `रिपोर्ट पाठमा भेटिएको सन्दर्भ दायरासँग ${total} परिणाम तुलना गरियो। स्पष्ट दायरा नभएका कुराहरू स्वास्थ्यकर्मीले समीक्षा गर्नुपर्छ।`
        : "स्पष्ट परीक्षण मूल्य र सन्दर्भ दायरा नभएकाले रिपोर्टलाई समीक्षा आवश्यक छ।",
    results: finalResults,
    statusCounts: counts,
  };
}
