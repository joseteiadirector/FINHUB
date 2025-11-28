import { Progress } from "@/components/ui/progress";
import { ReferralBadge } from "./ReferralBadge";

interface ReferralProgressProps {
  referralCount: number;
  badgeLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

const LEVEL_THRESHOLDS = {
  bronze: 1,
  silver: 6,
  gold: 16,
  platinum: 31,
  diamond: 51,
};

export const ReferralProgress = ({ referralCount, badgeLevel }: ReferralProgressProps) => {
  const getNextLevelProgress = () => {
    if (badgeLevel === 'diamond') {
      return { progress: 100, current: referralCount, target: referralCount, nextLevel: 'Máximo' };
    }

    const levels: Array<keyof typeof LEVEL_THRESHOLDS> = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const currentIndex = levels.indexOf(badgeLevel as keyof typeof LEVEL_THRESHOLDS);
    const nextLevel = levels[currentIndex + 1] || 'diamond';
    const target = LEVEL_THRESHOLDS[nextLevel];
    const previous = currentIndex >= 0 ? LEVEL_THRESHOLDS[levels[currentIndex]] : 0;
    
    const progress = Math.min(100, ((referralCount - previous) / (target - previous)) * 100);

    return { 
      progress, 
      current: referralCount, 
      target, 
      nextLevel: nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1) 
    };
  };

  const { progress, current, target, nextLevel } = getNextLevelProgress();

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ReferralBadge level={badgeLevel} size="lg" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-bold">
          <span>Progresso para {nextLevel}</span>
          <span>{current} / {target}</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="grid grid-cols-5 gap-2 pt-4">
        {(['bronze', 'silver', 'gold', 'platinum', 'diamond'] as const).map((level) => (
          <div
            key={level}
            className={`text-center ${
              LEVEL_THRESHOLDS[level] <= referralCount
                ? 'opacity-100'
                : 'opacity-30'
            }`}
          >
            <ReferralBadge level={level} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};
