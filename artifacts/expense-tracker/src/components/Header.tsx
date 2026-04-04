import { Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme, role, setRole } = useAppContext();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm justify-between md:justify-end pl-14 md:pl-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {role === 'Admin' ? 'A' : 'V'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{role === 'Admin' ? 'Administrator' : 'Viewer'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {role === 'Admin' ? 'Full access' : 'Read-only access'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRole('Admin')} className="cursor-pointer" data-testid="menu-role-admin">
              Switch to Admin
              {role === 'Admin' && <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('Viewer')} className="cursor-pointer" data-testid="menu-role-viewer">
              Switch to Viewer
              {role === 'Viewer' && <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
