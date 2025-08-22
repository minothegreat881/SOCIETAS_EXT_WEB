"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Calendar, ImageIcon, BookOpen, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import EventsManager from "@/components/admin/events-manager"
import GalleryManager from "@/components/admin/gallery-manager"
import HistoryManager from "@/components/admin/history-manager"
import AdminLogo from "@/components/admin/admin-logo"
import DashboardOverview from "@/components/admin/dashboard-overview"
import { cn } from "@/lib/utils"

type AdminView = "dashboard" | "events" | "gallery" | "history"

const navigationItems = [
  { name: "Dashboard", view: "dashboard", icon: LayoutDashboard },
  { name: "Events", view: "events", icon: Calendar },
  { name: "Gallery", view: "gallery", icon: ImageIcon },
  { name: "History", view: "history", icon: BookOpen },
]

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<AdminView>("dashboard")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const authStatus = localStorage.getItem("scear-admin-auth")
    if (authStatus !== "authenticated") {
      router.push("/admin")
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      })
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("scear-admin-auth")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/admin")
  }

  const renderContent = (): ReactNode => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />
      case "events":
        return <EventsManager />
      case "gallery":
        return <GalleryManager />
      case "history":
        return <HistoryManager />
      default:
        return <DashboardOverview />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-stone-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-stone-900 text-white flex flex-col">
          <div className="h-20 flex items-center justify-center px-4 border-b border-stone-700">
            <div className="flex items-center gap-2">
              <AdminLogo showText={false} />
              <h1 className="text-lg font-bold">S.C.E.A.R. Admin</h1>
            </div>
          </div>
          <nav className="flex-grow px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => setActiveView(item.view as AdminView)}
                className={cn(
                  "w-full justify-start text-base",
                  activeView === item.view
                    ? "bg-red-800/50 text-white"
                    : "text-stone-300 hover:bg-stone-700 hover:text-white",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t border-stone-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-stone-300 hover:bg-stone-700 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" /> Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto h-screen">{renderContent()}</main>
      </div>
    </div>
  )
}
