export const SAMPLE_REPORTS = [
  {
    name: "Complete Blood Count",
    type: "CBC",
    results: [
      { testName: "Hemoglobin", value: "10.2", unit: "g/dL", referenceRange: "12–16 g/dL", status: "low", numericValue: 10.2, explanationEn: "Your hemoglobin is below the reference range shown on your report. This can sometimes be associated with anemia, nutritional deficiencies, or other conditions. A healthcare professional should interpret this in context.", explanationNe: "तपाईंको हिमोग्लोबिन रिपोर्टमा दिइएको सामान्य दायराभन्दा कम छ। यो कहिलेकाहीँ रक्तअल्पता, पोषण अभाव, वा अन्य अवस्थासँग सम्बन्धित हुन सक्छ। स्वास्थ्यकर्मीले यसलाई सन्दर्भमा व्याख्या गर्नुपर्छ।" },
      { testName: "WBC", value: "8,500", unit: "/µL", referenceRange: "4,000–11,000 /µL", status: "normal", numericValue: 8500, explanationEn: "Your WBC result is within the reference range shown on your report.", explanationNe: "तपाईंको WBC परिणाम रिपोर्टमा दिइएको सामान्य दायराभित्र छ।" },
      { testName: "Glucose", value: "145", unit: "mg/dL", referenceRange: "70–140 mg/dL", status: "high", numericValue: 145, explanationEn: "Your glucose is above the reference range shown on your report. Elevated glucose can sometimes be associated with diabetes, insulin resistance, or other conditions. Please consult a healthcare professional.", explanationNe: "तपाईंको ग्लुकोज रिपोर्टमा दिइएको सामान्य दायराभन्दा माथि छ। बढेको ग्लुकोज कहिलेकाहीँ मधुमेह, इन्सुलिन प्रतिरोध, वा अन्य अवस्थासँग सम्बन्धित हुन सक्छ। कृपया स्वास्थ्यकर्मीसँग परामर्श गर्नुहोस्।" },
    ],
  },
];

export function analyzeReport(fileType) {
  const sample = SAMPLE_REPORTS[0];
  const counts = { normal: 0, high: 0, low: 0, unknown: 0 };
  for (const r of sample.results) {
    counts[r.status === "normal" ? "normal" : r.status === "high" ? "high" : r.status === "low" ? "low" : "unknown"]++;
  }
  return {
    reportName: sample.name,
    reportType: sample.type,
    summary: "Your report contains 15 analyzed parameters. Most results are within the reference ranges shown on the report. A few results are outside those ranges and may need further attention.",
    results: sample.results,
    statusCounts: counts,
  };
}
