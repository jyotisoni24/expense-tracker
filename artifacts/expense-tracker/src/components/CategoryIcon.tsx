import { 
  Utensils, 
  Home, 
  Car, 
  Film, 
  HeartPulse, 
  ShoppingBag, 
  DollarSign, 
  Briefcase, 
  TrendingUp,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { Category } from '../data/mockData';

const iconMap: Record<Category, LucideIcon> = {
  'Food & Dining': Utensils,
  'Housing': Home,
  'Transportation': Car,
  'Entertainment': Film,
  'Healthcare': HeartPulse,
  'Shopping': ShoppingBag,
  'Salary': DollarSign,
  'Freelance': Briefcase,
  'Investments': TrendingUp,
};

const colorMap: Record<Category, string> = {
  'Food & Dining': 'text-orange-500 bg-orange-50 dark:bg-orange-500/10',
  'Housing': 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
  'Transportation': 'text-teal-500 bg-teal-50 dark:bg-teal-500/10',
  'Entertainment': 'text-purple-500 bg-purple-50 dark:bg-purple-500/10',
  'Healthcare': 'text-red-500 bg-red-50 dark:bg-red-500/10',
  'Shopping': 'text-pink-500 bg-pink-50 dark:bg-pink-500/10',
  'Salary': 'text-green-600 bg-green-50 dark:bg-green-500/10',
  'Freelance': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
  'Investments': 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10',
};

interface CategoryIconProps {
  category: Category;
  className?: string;
  size?: number;
}

export function CategoryIcon({ category, className = '', size = 18 }: CategoryIconProps) {
  const Icon = iconMap[category] || HelpCircle;
  const colors = colorMap[category] || 'text-gray-500 bg-gray-50 dark:bg-gray-500/10';

  return (
    <div className={`inline-flex items-center justify-center p-2 rounded-lg ${colors} ${className}`}>
      <Icon size={size} strokeWidth={2.5} />
    </div>
  );
}
