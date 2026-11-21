import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Jin Little Paws Co. | Interactive 3D pet shop plan",
  description: "An interactive one-floor 3D presentation of The Jin Little Paws Co. retail, grooming and cat-hotel layout.",
  openGraph: {
    title: "The Jin Little Paws Co. 3D plan",
    description: "Walk through the retail, grooming and cat-hotel spaces in an interactive architectural presentation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4efe5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-type="software" data-radius="soft" data-buttons="arrow" data-motion="on">
      <head>
        <meta name="page-type" content="software" />
        <meta name="site-kind" content="software" />
        <meta name="page-kind" content="viewer" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>{children}</body>
    </html>
  );
}
