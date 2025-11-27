import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const TransactionSkeleton = () => {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </Card>
  );
};

export const BalanceSkeleton = () => {
  return (
    <Card className="p-6 animate-pulse">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-10 w-48 mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </Card>
  );
};

export const ServiceCardSkeleton = () => {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </Card>
  );
};
