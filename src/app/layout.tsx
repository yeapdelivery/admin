import type { Metadata } from "next";
import { Rubik, Outfit } from "next/font/google";
import "../style/global.css";

const rubik = Rubik({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yeap delivery",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${outfit.className} ${rubik.className}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
