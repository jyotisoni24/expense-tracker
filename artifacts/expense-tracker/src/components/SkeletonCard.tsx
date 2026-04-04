import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[120px] mb-2" />
        <Skeleton className="h-3 w-[140px]" />
      </CardContent>
    </Card>
  );
}

export function SkeletonChart() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <Skeleton className="h-5 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-4 w-[80px] ml-auto" />
        <Skeleton className="h-3 w-[60px] ml-auto" />
      </div>
    </div>
  );
}
