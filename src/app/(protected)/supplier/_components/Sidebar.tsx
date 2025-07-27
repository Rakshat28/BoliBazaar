// components/sidebar.tsx
import { Home, Settings, Users } from "lucide-react";
import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/Orders", icon: Users },
  { name: "Billing", href: "/Billing", icon: Settings },
  { name: "Payments", href: "/Payments", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r p-4 shadow-sm">
      <div className="text-2xl font-bold mb-6">MyApp</div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 text-sm font-medium"
          >
            <link.icon className="w-4 h-4" />
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
