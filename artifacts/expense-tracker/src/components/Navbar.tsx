import { Link, useLocation } from "wouter";
import { LayoutDashboard, ArrowLeftRight, PieChart, Moon, Sun, Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Insights", href: "/insights", icon: PieChart },
];

interface NavbarProps {
  onAddTransaction: () => void;
}

export function Navbar({ onAddTransaction }: NavbarProps) {
  const [location] = useLocation();
  const { theme, setTheme, role, setRole } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer shrink-0 group" data-testid="logo-link">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <div className="w-3.5 h-3.5 rounded-sm bg-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground font-sans">Nexus</span>
              </div>
            </Link>

            {/* Center nav links — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.span
                      data-testid={`nav-link-${item.name.toLowerCase()}`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.name}
                    </motion.span>
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {role === "Admin" && (
                <Button
                  size="sm"
                  onClick={onAddTransaction}
                  className="hidden sm:flex shadow-sm"
                  data-testid="btn-add-tx-navbar"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                data-testid="button-theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-foreground"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {role === "Admin" ? "A" : "V"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{role === "Admin" ? "Administrator" : "Viewer"}</p>
                      <p className="text-xs text-muted-foreground">{role === "Admin" ? "Full access" : "Read-only access"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRole("Admin")} className="cursor-pointer" data-testid="menu-role-admin">
                    Switch to Admin
                    {role === "Admin" && <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole("Viewer")} className="cursor-pointer" data-testid="menu-role-viewer">
                    Switch to Viewer
                    {role === "Viewer" && <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground"
                onClick={() => setMobileOpen((v) => !v)}
                data-testid="btn-mobile-menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t bg-background overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <span
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <item.icon size={18} />
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
                {role === "Admin" && (
                  <button
                    onClick={() => { onAddTransaction(); setMobileOpen(false); }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary w-full"
                  >
                    <Plus size={18} /> Add Transaction
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
