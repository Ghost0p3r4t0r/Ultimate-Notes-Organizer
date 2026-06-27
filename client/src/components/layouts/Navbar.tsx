import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import type { User } from '@/types';

interface NavbarProps {
  onMenuClick: () => void;
  user: User | null;
}

export function Navbar({ onMenuClick, user }: NavbarProps) {
  const { isDark, toggle } = useThemeStore();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      <Button variant="ghost" size="icon" onClick={toggle}>
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
