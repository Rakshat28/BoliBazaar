"use client";

import { Calendar,Inbox, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Bidding",
    url: "./bidding",
    icon: Inbox,
  },
  {
    title: "Orders",
    url: "./orders",
    icon: Calendar,
  },
  {
    title: "Payments",
    url: "./payments",
    icon: Search,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className=" text-lg font-semibold">
       <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
                src="/vendor.png"
                alt="DaamDekho Logo"
                className="h-12 w-12 object-contain" 
            />
            <div className="flex">
              <span className="text-xl font-bold text-gray-900">
                BOLI<span className="text-[#457C78]">BAZAAR</span>
            </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#3e6c6c] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-2 w-full">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
