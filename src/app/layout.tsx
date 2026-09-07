import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hymora.ai"),

  title: {
    default: "Hymora",
    template: "%s | Hymora",
  },

  description:
    "The AI Workspace That Remembers Everything. Create workspaces, upload knowledge, chat with AI, and never lose context again.",

  applicationName: "Hymora",

  keywords: [
    "Hymora",
    "AI Workspace",
    "Artificial Intelligence",
    "Knowledge Base",
    "AI Memory",
    "AI Chat",
    "RAG",
    "Workspace",
    "Productivity",
  ],

  authors: [
    {
      name: "Hymora",
    },
  ],

  creator: "Hymora",

  publisher: "Hymora",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/brand/icon.png",
    shortcut: "/brand/icon.png",
    apple: "/brand/icon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
  <ClerkProvider>
    <TooltipProvider>
      {children}
    </TooltipProvider>
  </ClerkProvider>
</body>
    </html>
  );
}