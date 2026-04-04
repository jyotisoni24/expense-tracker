import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Lightbulb, TrendingUp } from "lucide-react";
import { categoryBudgets } from "@/data/mockData";
import { BudgetProgress } from "@/components/BudgetProgress";
import { format, parseISO, subMonths } from "date-fns";
import { motion } from "framer-motion";

const COLORS = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#a855f7', // purple
  '#ef4444', // red
  '#ec4899', // pink
  '#10b981', // emerald
  '#6366f1', // indigo
];

export default function Insights() {
  const { transactions } = useAppContext();

  // Calculate expenses by category for Pie Chart
  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const topCategory = expensesByCategory[0]?.name || "N/A";
  const topCategoryAmount = expensesByCategory[0]?.value || 0;

  // Monthly comparison
  const monthlyData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStr = format(monthDate, 'MMM');
      const monthYear = format(monthDate, 'yyyy-MM');
      
      const monthTx = transactions.filter(t => t.date.startsWith(monthYear));
      const income = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        name: monthStr,
        Income: income,
        Expense: expense,
      });
    }
    return data;
  }, [transactions]);

  // Budget calculations
  const budgetData = useMemo(() => {
    const currentMonthTx = transactions.filter(t => {
      const txDate = parseISO(t.date);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });

    return categoryBudgets.map(budget => {
      const spent = currentMonthTx
        .filter(t => t.category === budget.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...budget,
        spent
      };
    }).sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit)); // Sort by highest percentage spent
  }, [transactions]);

  // Generate smart insight
  const insightMessage = useMemo(() => {
    if (monthlyData.length >= 2) {
      const thisMonth = monthlyData[monthlyData.length - 1].Expense;
      const lastMonth = monthlyData[monthlyData.length - 2].Expense;
      
      if (lastMonth === 0) return "Not enough data to compare with last month.";
      
      const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
      if (diff > 0) {
        return `You spent ${diff.toFixed(0)}% more this month compared to last month.`;
      } else {
        return `Great job! You spent ${Math.abs(diff).toFixed(0)}% less this month compared to last month.`;
      }
    }
    return "Keep adding transactions to see more insights.";
  }, [monthlyData]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Insights</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your spending habits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 border-0 shadow-sm bg-gradient-to-br from-primary/10 via-background to-background">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1">Smart Insight</h3>
              <p className="text-muted-foreground">{insightMessage}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Highest Spending Category</h3>
            <div className="text-2xl font-bold text-foreground truncate">{topCategory}</div>
            <div className="text-xl font-mono mt-1 text-red-600 dark:text-red-500">
              ${topCategoryAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-sans">Expenses by Category</CardTitle>
            <CardDescription>All-time breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No expense data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-sans">Monthly Comparison</CardTitle>
            <CardDescription>Income vs Expense past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Income" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Budget Tracking (This Month)
          </CardTitle>
          <CardDescription>Monitor your spending against category limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgetData.map((data, index) => (
              <BudgetProgress 
                key={index}
                category={data.category}
                spent={data.spent}
                limit={data.limit}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
