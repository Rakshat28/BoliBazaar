'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Wallet,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const navigationItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Join a Pool", href: "/pools", icon: Users },
  { title: "My Orders", href: "/orders", icon: ShoppingCart },
  { title: "My Wallet", href: "/wallet", icon: Wallet },
];

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary border-r border-border">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary-foreground mb-10">
          Vendor Dashboard
        </h1>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(`/vendor${item.href}`);
            return (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-12 text-base",
                  isActive
                    ? "bg-primary-foreground/10 text-primary-foreground font-semibold"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                )}
                asChild
              >
                <Link href={`/vendor${item.href}`}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center text-primary-foreground/60 text-sm">
          <User className="mr-2 h-4 w-4" />
          <span>Logged in as: vendor-001</span>
        </div>
      </div>
    </aside>
  );
} 