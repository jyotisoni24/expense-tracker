import { Category } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { CategoryIcon } from "./CategoryIcon";

interface BudgetProgressProps {
  category: Category;
  spent: number;
  limit: number;
}

export function BudgetProgress({ category, spent, limit }: BudgetProgressProps) {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOverBudget = spent > limit;
  const isNearBudget = percentage >= 85 && !isOverBudget;

  let progressColorClass = "bg-primary";
  if (isOverBudget) progressColorClass = "bg-destructive";
  else if (isNearBudget) progressColorClass = "bg-orange-500";

  return (
    <div className="space-y-3 p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CategoryIcon category={category} />
          <div>
            <p className="font-medium">{category}</p>
            <p className="text-sm text-muted-foreground">
              ${spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} of ${limit.toLocaleString('en-US')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium ${isOverBudget ? 'text-destructive' : ''}`}>
            {percentage.toFixed(0)}%
          </p>
        </div>
      </div>
      <Progress 
        value={percentage} 
        className="h-2" 
        indicatorClassName={progressColorClass}
      />
    </div>
  );
}
