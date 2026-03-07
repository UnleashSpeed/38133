import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { HeaderSearch } from "@/components/SemanticSearch"
import { ThemeToggle } from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "3GPP TS 38.133 Reference | Clauses 7, 8, 9",
  description: "Comprehensive reference for 3GPP TS 38.133 - NR Requirements for support of radio resource management",
  keywords: ["3GPP", "TS 38.133", "5G NR", "RRM", "Timing", "Measurement", "SCell Activation"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex">
            {/* Sidebar - always visible on desktop */}
            <div className="hidden lg:block w-[280px] flex-shrink-0">
              <Sidebar isOpen={true} onToggle={() => {}} />
            </div>
            
            {/* Mobile sidebar */}
            <div className="lg:hidden">
              <Sidebar isOpen={false} onToggle={() => {}} />
            </div>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between h-full px-4 lg:px-8">
                  {/* Left: Mobile menu + Search */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="hidden lg:block w-full max-w-md">
                      <HeaderSearch />
                    </div>
                  </div>
                  
                  {/* Right: Theme toggle + Actions */}
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              
              {/* Page content */}
              <main className="flex-1">
                {children}
              </main>
              
              {/* Footer */}
              <footer className="border-t py-6 px-4 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    3GPP TS 38.133 Reference - For informational purposes only
                  </p>
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} - Based on 3GPP specifications
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
