import { SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ClerkProvider } from "@clerk/nextjs"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex justify-center overflow-x-hidden">
        <ClerkProvider>
          <SidebarTrigger></SidebarTrigger>
          {children}
        </ClerkProvider>
      </main>
    </SidebarProvider>
  )
}