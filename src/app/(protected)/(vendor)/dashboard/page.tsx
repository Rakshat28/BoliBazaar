import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, DollarSign } from "lucide-react";
import Link from "next/link";

export default function VendorDashboardPage() {
  const dashboardStats = [
    { title: "Active Pools in Your Area", value: "12", icon: Package, description: "Pools available to join" },
    { title: "Orders Won This Month", value: "8", icon: TrendingUp, description: "Successful participations" },
    { title: "Total Saved (Est.)", value: "₹4,250", icon: DollarSign, description: "Money saved this month" }
  ];

  const quickActions = [
      { title: "Browse Pools", href: "/vendor/pools", icon: Package },
      { title: "Check Orders", href: "/vendor/orders", icon: TrendingUp },
      { title: "Add Funds", href: "/vendor/wallet", icon: DollarSign },
      { title: "View History", href: "/vendor/orders", icon: Package },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(action => (
                 <Link href={action.href} key={action.title} className="p-4 bg-secondary rounded-lg text-center hover:bg-secondary/80 transition-colors">
                    <action.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">{action.title}</p>
                 </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
} 