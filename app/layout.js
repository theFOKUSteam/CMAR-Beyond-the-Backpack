import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beyond-the-backpack.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Beyond the Backpack | CMAR Community Event — Aug 1, 2026",
  description:
    "Free haircuts, silk press, natural updo, kids styles, backpacks, and school supplies. Saturday, August 1, 2026, 10 AM–1 PM in Jackson, MS. Hosted by the Central Mississippi Association of Realtists. Register now.",
  keywords: [
    "Beyond the Backpack",
    "CMAR",
    "Central Mississippi Association of Realtists",
    "Jackson MS back to school event",
    "free haircuts Jackson MS",
    "back to school backpack giveaway"
  ],
  openGraph: {
    title: "Beyond the Backpack — Fresh Cuts. Fresh Confidence. Fresh Start.",
    description:
      "A free community event hosted by CMAR: haircuts, hair styling, backpacks, and school supplies. Saturday, August 1, 2026 in Jackson, MS.",
    url: siteUrl,
    siteName: "Beyond the Backpack",
    images: [{ url: "/images/gallery-1.svg", width: 400, height: 400 }],
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  themeColor: "#1F3A5F",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@500;700&family=Montserrat:wght@500;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
