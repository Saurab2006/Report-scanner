import "./globals.css";
import { LangProvider } from "@/components/LanguageContext";
import { AuthProvider } from "@/components/AuthContext";
import { Navigation } from "@/components/Navigation";
import { AppFooter } from "@/components/AppFooter";

export const metadata = {
  title: "SwasthaScan | Medical Report Scanner & Insights",
  description: "Upload a medical report and understand HIGH, NORMAL, LOW, and NEEDS REVIEW results in English or Nepali.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LangProvider>
            <Navigation />
            <main>{children}</main>
            <AppFooter />
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
