import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export const ThemeToggle = ({ collapsed }: { collapsed?: boolean }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={collapsed ? "h-8 w-8" : "w-full justify-start gap-3 px-3 py-2.5"}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Dark Mode</span>}
        </>
      )}
    </Button>
  );
};
