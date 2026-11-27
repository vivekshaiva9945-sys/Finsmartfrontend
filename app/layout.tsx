import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CookieConsent } from "../components/ui/CookieConsent";
import { Analytics } from "../components/ui/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://finsmart.gov.in"),
  title: {
    default: "FinSmart - Smart Financial Literacy & Budget Planner",
    template: "%s | FinSmart",
  },
  description:
    "Empowering households, students, and citizens with transparent household budgeting, savings milestones, and welfare scheme discovery under India's DPDP Act 2023.",
  keywords: [
    "financial literacy",
    "budget planner",
    "household budget",
    "government schemes",
    "scholarships",
    "Karnataka schemes",
    "DPDP act 2023",
    "savings goals",
    "FinSmart",
    "VTU LYNX",
  ],
  authors: [{ name: "Team LYNX (VTU)" }],
  creator: "Team LYNX",
  publisher: "FinSmart Civic Initiative",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "FinSmart",
    title: "FinSmart - Smart Financial Literacy & Budget Planner for Public",
    description:
      "Civic financial literacy, integer-precision budgeting, and government scheme matcher for students and households.",
    images: [
      {
        url: "/finsmart-hero.jpg",
        width: 1200,
        height: 630,
        alt: "FinSmart Civic Financial Literacy and Budget Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinSmart - Smart Financial Literacy & Budget Planner",
    description:
      "Civic financial literacy, household budgeting, and government scheme matcher for students and citizens.",
    images: ["/finsmart-hero.jpg"],
    creator: "@FinSmartIndia",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
