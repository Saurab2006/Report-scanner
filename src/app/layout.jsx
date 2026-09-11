import "./globals.css";
import { LangProvider } from "@/app/components/LanguageContext";
import { Navigation } from "@/app/components/Navigation";

export const metadata = {
  title: "ReportScan | Medical Report Scanner",
  description: "Upload a medical report and understand HIGH, NORMAL, LOW, and NEEDS REVIEW results in English or Nepali.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <Navigation />
          <main>{children}</main>
          <footer className="app-footer">
            <strong>ReportScan</strong>
            <span>Educational support only. Consult a qualified healthcare professional.</span>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
