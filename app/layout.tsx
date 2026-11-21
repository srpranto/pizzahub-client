import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { FloatingCart } from "@/components/cart/floating-cart";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PizzaHub - Artisanal Pizza Platform",
  description: "Order fresh artisanal pizzas from premier independent vendors",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pizzahub-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}
if(typeof window!=="undefined"){(function(){try{var blocked=new Set(["bis_skin_checked","bis_register"]);var orig=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(blocked.has(n)||(typeof n==="string"&&n.indexOf("__processed_")===0)){return}return orig.apply(this,arguments)};var clean=function(node){if(!node||!node.querySelectorAll)return;var els=node.querySelectorAll("[bis_skin_checked],[bis_register]");for(var i=0;i<els.length;i++){els[i].removeAttribute("bis_skin_checked");els[i].removeAttribute("bis_register")}};if(typeof MutationObserver!=="undefined"){var observer=new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++){var m=mutations[i];if(m.type==="attributes"&&(m.attributeName==="bis_skin_checked"||m.attributeName==="bis_register"||(typeof m.attributeName==="string"&&m.attributeName.indexOf("__processed_")===0))){m.target.removeAttribute(m.attributeName)}else if(m.type==="childList"){for(var j=0;j<m.addedNodes.length;j++){clean(m.addedNodes[j])}}}});observer.observe(document.documentElement,{attributes:true,childList:true,subtree:true,attributeFilter:["bis_skin_checked","bis_register"]})}}catch(e){}})()}`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} min-h-screen bg-background font-sans text-foreground antialiased flex flex-col`}
      >
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartSheet />
        <FloatingCart />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
