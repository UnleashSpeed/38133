import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '../components/ThemeProvider'
import { Sidebar } from '../components/Sidebar'
import { HeaderSearch } from '../components/SemanticSearch'
import { ThemeToggle } from '../components/ThemeToggle'

export function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex">
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <Sidebar isOpen={true} onToggle={() => {}} />
        </div>

        <div className="lg:hidden">
          <Sidebar isOpen={false} onToggle={() => {}} />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between h-full px-4 lg:px-8">
              <div className="flex items-center gap-4 flex-1">
                <div className="hidden lg:block w-full max-w-md">
                  <HeaderSearch />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>

          <footer className="border-t py-6 px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                3GPP TS 38.133 Reference - For informational purposes only
              </p>
              <p className="text-sm text-muted-foreground">
                Based on 3GPP specifications
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  )
}
