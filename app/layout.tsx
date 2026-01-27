import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { CurrentStudySession } from "@/components/current-study-session";
import NavBarPage from "./navbar/page";
import { headers } from "next/headers";

export const clashDisplay = localFont({
  src: [
    {
      path: "../public//fonts/clash-display/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public//fonts/clash-display/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public//fonts/clash-display/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public//fonts/clash-display/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
});

export const telma = localFont({
  src: [
    {
      path: "../public/fonts/telma/Telma-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/telma/Telma-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/telma/Telma-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/telma/Telma-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/telma/Telma-Black.woff2",
      weight: "900",
      style: "normal",
    },
    // Optionnel si tu veux utiliser la version variable
    // {
    //   path: "../public/fonts/telma/Telma-Variable.woff2",
    //   weight: "100 900",
    //   style: "normal",
    // },
  ],
  variable: "--font-telma",
});

export const cabinet = localFont({
  src: [
    {
      path: "./fonts/cabinet/CabinetGrotesk-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/cabinet/CabinetGrotesk-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/cabinet/CabinetGrotesk-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/cabinet/CabinetGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/cabinet/CabinetGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/cabinet/CabinetGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/cabinet/CabinetGrotesk-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    // Optionnel : version variable
    // { path: "../public/fonts/cabinet/Cabinet-Variable.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-cabinet",
});

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              localStorage.setItem('theme', 'light');
              document.documentElement.classList.remove('dark');
              document.documentElement.classList.add('light');
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-white dark:bg-dark-bg font-sans antialiased",
          // fontSans.variable,
          geist.className,
          clashDisplay.className,
          telma.className,
          cabinet.className
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen bg-white dark:bg-dark-bg">
            <NavBarPage />
            <main className="mx-auto pt-8 px-6 flex-grow w-full">
              <div className="container mx-auto max-w-[1536px]">
                {/* <CurrentStudySession /> */}
              </div>
              {children}
            </main>
            <footer className="w-full bg-white dark:bg-dark-bg border-t border-default-100 mt-10">
              <div className="max-w-[1536px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
                {/* Colonne 1 */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-lg font-[Cabinet]">
                    Ten Thousand Hours
                  </h4>
                  <p className="text-sm text-foreground/70">
                    Progressez, apprenez et maîtrisez n'importe quel domaine
                    grâce à la pratique.
                  </p>
                </div>

                {/* Colonne 2 */}
                <div className="flex flex-col gap-2">
                  <h5 className="font-semibold text-sm mb-1">Navigation</h5>
                  <Link
                    href="/"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    href="/studies"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Apprentissages
                  </Link>
                  <Link
                    href="/scheduler"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Calendrier
                  </Link>
                </div>

                {/* Colonne 3 */}
                <div className="flex flex-col gap-2">
                  <h5 className="font-semibold text-sm mb-1">Légal</h5>
                  <Link
                    href="/terms"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Mentions légales
                  </Link>
                  <h5 className="font-semibold text-sm mt-2 mb-1">A propos</h5>
                  <Link
                    href="/about"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Qui sommes-nous ?
                  </Link>
                  <Link
                    href="/contact"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div className="text-center py-4 border-t border-default-100 text-sm text-foreground/60">
                © {new Date().getFullYear()} Ten Thousand Hours. Tous droits
                réservés.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
