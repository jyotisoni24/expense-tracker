import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Lightbulb, TrendingUp, Trophy } from "lucide-react";
import { categoryBudgets } from "@/data/mockData";
import { BudgetProgress } from "@/components/BudgetProgress";
import { format, parseISO, subMonths } from "date-fns";
import { motion } from "framer-motion";

const COLORS = ["#f97316", "#3b82f6", "#14b8a6", "#a855f7", "#ef4444", "#ec4899", "#10b981", "#6366f1"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
};

const floatAnim = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 6, -6, 0],
    transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Insights() {
  const { transactions } = useAppContext();

  const expensesByCategory = useMemo(() => {
    const grouped = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const topCategory = expensesByCategory[0]?.name || "N/A";
  const topCategoryAmount = expensesByCategory[0]?.value || 0;

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const monthDate = subMonths(now, 5 - i);
      const monthStr = format(monthDate, "MMM");
      const monthYear = format(monthDate, "yyyy-MM");
      const monthTx = transactions.filter((t) => t.date.startsWith(monthYear));
      return {
        name: monthStr,
        Income: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        Expense: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  const budgetData = useMemo(() => {
    const now = new Date();
    const currentMonthTx = transactions.filter((t) => {
      const d = parseISO(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return categoryBudgets
      .map((budget) => ({
        ...budget,
        spent: currentMonthTx
          .filter((t) => t.category === budget.category && t.type === "expense")
          .reduce((s, t) => s + t.amount, 0),
      }))
      .sort((a, b) => b.spent / b.limit - a.spent / a.limit);
  }, [transactions]);

  const insightMessage = useMemo(() => {
    if (monthlyData.length >= 2) {
      const thisMonth = monthlyData[monthlyData.length - 1].Expense;
      const lastMonth = monthlyData[monthlyData.length - 2].Expense;
      if (lastMonth === 0) return "Not enough data to compare with last month.";
      const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
      return diff > 0
        ? `You spent ${diff.toFixed(0)}% more this month compared to last month.`
        : `Great job! You spent ${Math.abs(diff).toFixed(0)}% less this month compared to last month.`;
    }
    return "Keep adding transactions to see more insights.";
  }, [monthlyData]);

  const isPositiveInsight = insightMessage.startsWith("Great");

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 relative"
    >
      {/* Floating stickers */}
      <motion.div
        variants={floatAnim}
        animate="animate"
        className="absolute -top-4 right-6 text-4xl pointer-events-none select-none hidden lg:block"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}
      >
        🔍
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -8, 8, 0], transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 } }}
        className="absolute top-20 -right-2 text-3xl pointer-events-none select-none hidden xl:block"
        style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.10))" }}
      >
        📊
      </motion.div>

      {/* Page header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans flex items-center gap-2">
          Insights
          <motion.span
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 5 }}
          >
            <TrendingUp className="h-6 w-6 text-primary" />
          </motion.span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Understand your spending habits with smart analytics.</p>
      </motion.div>

      {/* Smart insight + top category */}
      <motion.div variants={stagger} className="grid gap-5 md:grid-cols-3">
        <motion.div variants={fadeUp} className="md:col-span-2">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/8 via-background to-background h-full">
            <CardContent className="p-6 flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isPositiveInsight ? "bg-green-100 dark:bg-green-500/15" : "bg-primary/15"}`}
              >
                <Lightbulb className={`h-6 w-6 ${isPositiveInsight ? "text-green-600 dark:text-green-500" : "text-primary"}`} />
              </motion.div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">Smart Insight</h3>
                <p className="text-muted-foreground leading-relaxed">{insightMessage}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Highest Spending Category
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 180 }}
                  className="text-2xl font-bold text-foreground truncate"
                >
                  {topCategory}
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.65, type: "spring", stiffness: 180 }}
                  className="text-2xl font-mono font-bold text-red-600 dark:text-red-500 mt-1"
                >
                  ${topCategoryAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">All-time total spent</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={stagger} className="grid gap-5 md:grid-cols-2">
        {/* Pie chart */}
        <motion.div variants={fadeUp}>
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
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        isAnimationActive
                        animationBegin={200}
                        animationDuration={900}
                      >
                        {expensesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
                        contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No expense data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar chart */}
        <motion.div variants={fadeUp}>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-sans">Monthly Comparison</CardTitle>
              <CardDescription>Income vs Expense — last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                      contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px" }} />
                    <Bar dataKey="Income" fill="#16a34a" radius={[5, 5, 0, 0]} maxBarSize={38} isAnimationActive animationBegin={300} animationDuration={900} />
                    <Bar dataKey="Expense" fill="#dc2626" radius={[5, 5, 0, 0]} maxBarSize={38} isAnimationActive animationBegin={400} animationDuration={900} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Budget tracking */}
      <motion.div variants={fadeUp}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <TrendingUp className="h-5 w-5 text-primary" />
              </motion.div>
              Budget Tracking — This Month
            </CardTitle>
            <CardDescription>Monitor your spending against category limits</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {budgetData.map((data, index) => (
                <motion.div key={index} variants={fadeUp}>
                  <BudgetProgress
                    category={data.category}
                    spent={data.spent}
                    limit={data.limit}
                  />
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
