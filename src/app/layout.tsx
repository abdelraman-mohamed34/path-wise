import type { Metadata } from "next";
import { Noto_Sans_Arabic, Geist_Mono } from "next/font/google"; // استبدال Geist بالخط العربي
import "./globals.css";
import Wrapper from "./Wrapper";
import { Toaster } from "sonner";

const arabicFont = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PathWise - Smart Route Optimizer",
  description: "Optimizing your journeys with high performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabicFont.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (mode === 'dark' || (!mode && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body className={`${arabicFont.className} min-h-full flex flex-col bg-background text-foreground transition-colors duration-300`}>
        <Wrapper>
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              className: "border border-border/50 backdrop-blur-md bg-window/80 text-foreground rounded-xl shadow-2xl",
              descriptionClassName: "text-muted-foreground text-[10px]",
              style: {
                padding: '15px 16px',
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
              },
            }}
          />
        </Wrapper>
      </body>
    </html >
  );
}