"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  Send,
  Clock,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: "Transfers",
      href: "/transfers",
      icon: <Send className="w-5 h-5" />,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: <Clock className="w-5 h-5" />,
    },
    { name: "Cards", href: "/cards", icon: <CreditCard className="w-5 h-5" /> },
    {
      name: "Statements",
      href: "/statements",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Close sidebar on mobile when a link is clicked
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              NextBank
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name} onClick={handleNavClick}>
                <NavItem
                  href={item.href}
                  icon={item.icon}
                  label={item.name}
                  isActive={pathname === item.href}
                />
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                signOut();
                handleNavClick();
              }}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
