import { Medal, Crown, Gem, Award } from "lucide-react";

interface ReferralBadgeProps {
  level: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  size?: "sm" | "md" | "lg";
}

const BADGE_CONFIG = {
  none: {
    name: "Sem Emblema",
    icon: Award,
    color: "text-muted-foreground",
    bgColor: "bg-muted/20",
    minReferrals: 0,
    nextLevel: "Bronze (1 indicação)",
  },
  bronze: {
    name: "Bronze",
    icon: Medal,
    color: "text-amber-700",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    minReferrals: 1,
    nextLevel: "Prata (6 indicações)",
  },
  silver: {
    name: "Prata",
    icon: Medal,
    color: "text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800/20",
    minReferrals: 6,
    nextLevel: "Ouro (16 indicações)",
  },
  gold: {
    name: "Ouro",
    icon: Medal,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    minReferrals: 16,
    nextLevel: "Platina (31 indicações)",
  },
  platinum: {
    name: "Platina",
    icon: Gem,
    color: "text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
    minReferrals: 31,
    nextLevel: "Diamante (51 indicações)",
  },
  diamond: {
    name: "Diamante",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    minReferrals: 51,
    nextLevel: "Nível Máximo!",
  },
};

export const ReferralBadge = ({ level, size = "md" }: ReferralBadgeProps) => {
  const config = BADGE_CONFIG[level];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${config.bgColor} ${config.color} rounded-full flex items-center justify-center border-4 border-current shadow-lg transition-all duration-300 hover:scale-110`}
      >
        <Icon size={iconSizes[size]} strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <p className={`font-black ${size === 'lg' ? 'text-xl' : 'text-base'}`}>
          {config.name}
        </p>
        {size !== 'sm' && (
          <p className="text-xs text-muted-foreground">
            Próximo: {config.nextLevel}
          </p>
        )}
      </div>
    </div>
  );
};
