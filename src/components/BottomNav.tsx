import { Home, Receipt, Grid3x3, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: Receipt, label: "Extrato", path: "/transactions" },
    { icon: Grid3x3, label: "Serviços", path: "/services" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t-3 border-foreground shadow-2xl z-50 animate-slide-up safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 sm:h-18 px-2 sm:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location?.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-200 hover:scale-110 active:scale-95 relative touch-manipulation min-w-[60px] sm:min-w-[70px] py-2 ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
              <Icon size={22} className={`${isActive ? "animate-scale-in" : ""} flex-shrink-0`} />
              <span className="text-[10px] sm:text-xs font-bold truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
