import { Link, useLocation } from "wouter";
import { LayoutDashboard, ArrowLeftRight, PieChart, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Insights", href: "/insights", icon: PieChart },
];

export function Sidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { role } = useAppContext();

  const NavLinks = () => (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <span
              data-testid={`nav-link-${item.name.toLowerCase()}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 font-medium ${
                isActive 
                  ? "bg-primary/10 text-primary hover:bg-primary/15" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0 flex flex-col border-r-0">
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary font-sans flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-primary-foreground" />
              </div>
              Nexus
            </h2>
          </div>
          <NavLinks />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex flex-col w-[240px] border-r bg-card h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary font-sans flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm bg-primary-foreground" />
            </div>
            Nexus
          </h2>
        </div>
        <NavLinks />
      </div>
    </>
  );
}
