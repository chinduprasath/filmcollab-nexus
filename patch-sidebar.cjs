const fs = require('fs');

let content = fs.readFileSync('src/components/layout/sidebar.tsx', 'utf8');

// 1. Add useRef to imports
if (!content.includes('useRef')) {
  content = content.replace('useEffect, useState', 'useEffect, useState, useRef');
}

// 2. Add scroll preservation logic
const scrollLogic = `
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e) => {
      const target = e.target;
      sessionStorage.setItem('sidebarScrollPos', target.scrollTop.toString());
    };
    
    let viewport = null;
    if (scrollRef.current) {
      setTimeout(() => {
        if (!scrollRef.current) return;
        viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          const savedScroll = sessionStorage.getItem('sidebarScrollPos');
          if (savedScroll) {
            viewport.scrollTop = parseInt(savedScroll, 10);
          }
          viewport.addEventListener('scroll', handleScroll);
        }
      }, 50);
    }
    
    return () => {
      if (viewport) {
        viewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
`;

content = content.replace(/const \[profile, setProfile\] = useState<any>\(null\);/, `const [profile, setProfile] = useState<any>(null);\n${scrollLogic}`);

// 3. Update the logo and toggle button section
const oldLogoSection = `      <div className="flex h-16 items-center justify-between px-6 border-b border-yellow-200 dark:border-yellow-900/40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <div className="h-4 w-4 bg-white rounded-sm opacity-90"></div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">FilmCollab</span>
          )}
        </div>
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}`;

const newLogoSection = `      <div className={cn("flex h-16 items-center border-b border-yellow-200 dark:border-yellow-900/40 relative", isCollapsed ? "justify-center" : "justify-between px-6")}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
            <div className="h-4 w-4 bg-white rounded-sm opacity-90"></div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">FilmCollab</span>
          )}
        </div>
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex-shrink-0",
              isCollapsed ? "absolute -right-4 top-4 bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-full shadow-sm z-50 hover:bg-gray-50 dark:hover:bg-gray-800" : "hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}`;

content = content.replace(oldLogoSection, newLogoSection);

// 4. Update the ScrollArea to add the ref
content = content.replace(/<ScrollArea className="flex-1 px-3 py-4">/, '<ScrollArea ref={scrollRef} className="flex-1 px-3 py-4">');

// 5. Update the theme section
const oldThemeSectionRegex = /<div className="border-t border-yellow-200 dark:border-yellow-900\/40 p-4">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>)/;

// Wait, using regex might be tricky. Let's find the exact string to replace.
const oldThemeSection = `      <div className="border-t border-yellow-200 dark:border-yellow-900/40 p-4">
        <div className="space-y-3">
          {!isCollapsed && (
            <div className="px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Theme</p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30",
                theme === "light" && "bg-yellow-100 dark:bg-yellow-950 text-gray-900 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30"
              )}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30",
                theme === "dark" && "bg-yellow-500 text-white hover:bg-yellow-500"
              )}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-50 dark:hover:bg-yellow-950/30",
                theme === "system" && "bg-yellow-100 dark:bg-yellow-950 text-gray-900 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30"
              )}
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>`;

const newThemeSection = `      <div className="border-t border-yellow-200 dark:border-yellow-900/40 p-4">
        {!isCollapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-3">Theme</p>
        )}
        
        <div 
          className={cn(
            "flex items-center rounded-full p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer relative",
            isCollapsed ? "flex-col h-16 w-8 mx-auto" : "w-full h-8"
          )}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <div 
            className={cn(
              "absolute bg-white dark:bg-gray-600 rounded-full shadow-sm transition-all duration-200 ease-in-out",
              isCollapsed 
                ? cn("w-6 h-[28px] left-[3px]", theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark")) ? "top-[33px]" : "top-[3px]")
                : cn("h-6 w-[calc(50%-4px)] top-1", theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark")) ? "left-[calc(50%+2px)]" : "left-1")
            )} 
          />
          <div className={cn("relative z-10 flex items-center justify-center transition-colors", isCollapsed ? "h-1/2 w-full" : "w-1/2 h-full", theme === 'light' || (theme === 'system' && !document.documentElement.classList.contains('dark')) ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400')}>
            <Sun className="h-4 w-4" />
          </div>
          <div className={cn("relative z-10 flex items-center justify-center transition-colors", isCollapsed ? "h-1/2 w-full" : "w-1/2 h-full", theme === 'dark' || (theme === 'system' && document.documentElement.classList.contains('dark')) ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400')}>
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </div>`;

content = content.replace(oldThemeSection, newThemeSection);

fs.writeFileSync('src/components/layout/sidebar.tsx', content, 'utf8');
console.log('Sidebar patched successfully.');
