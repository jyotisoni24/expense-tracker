import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowDownRight, ArrowUpRight, Activity, Sparkles, TrendingUp, Zap } from "lucide-react";
import { SkeletonCard, SkeletonChart, SkeletonRow } from "@/components/SkeletonCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { CategoryIcon } from "@/components/CategoryIcon";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardProps {
  onAddTransaction: () => void;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const float = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 4, -4, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatSlow = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Dashboard({ onAddTransaction }: DashboardProps) {
  const { transactions, role } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === "income") acc.totalIncome += curr.amount;
        if (curr.type === "expense") acc.totalExpense += curr.amount;
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  const chartData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const dateStr = format(date, "MMM dd");
      const dayTxs = transactions.filter(
        (t) => format(parseISO(t.date), "MMM dd") === dateStr
      );
      const income = dayTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = dayTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return { date: dateStr, income, expense };
    });
  }, [transactions]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6),
    [transactions]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        <div className="grid gap-5 sm:grid-cols-3">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          <SkeletonChart />
          <Card className="col-span-1 border-0 shadow-sm">
            <CardHeader><div className="h-5 w-32 bg-muted rounded animate-pulse" /></CardHeader>
            <CardContent className="space-y-4">
              <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-6 relative"
      >
        {/* Floating sticker decorations */}
        <motion.div
          variants={float}
          animate="animate"
          className="absolute -top-4 right-8 text-4xl pointer-events-none select-none hidden lg:block"
          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}
        >
          💸
        </motion.div>
        <motion.div
          variants={floatSlow}
          animate="animate"
          className="absolute top-24 -right-2 text-3xl pointer-events-none select-none hidden xl:block"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
        >
          📈
        </motion.div>

        {/* Page header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans flex items-center gap-2">
              Overview
              <motion.span
                animate={{ rotate: [0, 15, -10, 15, 0] }}
                transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 4 }}
                className="inline-block"
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Your financial command center — all at a glance.</p>
          </div>
          {role === "Admin" && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddTransaction}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              data-testid="btn-add-tx"
            >
              <Zap className="h-4 w-4" /> Add Transaction
            </motion.button>
          )}
        </motion.div>

        {/* Summary cards */}
        <motion.div variants={stagger} className="grid gap-5 sm:grid-cols-3">
          {/* Balance */}
          <motion.div variants={fadeUp}>
            <Card className="border-0 shadow-md bg-primary text-primary-foreground relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-36 h-36 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Balance</CardTitle>
                <motion.div
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Wallet className="h-5 w-5 text-primary-foreground/70" />
                </motion.div>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold font-mono tracking-tight"
                  data-testid="text-total-balance"
                >
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </motion.div>
                <p className="text-xs text-primary-foreground/70 mt-1.5 flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Active last 14 days
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Income */}
          <motion.div variants={fadeUp}>
            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center"
                >
                  <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-green-600 dark:text-green-500 font-mono tracking-tight"
                  data-testid="text-total-income"
                >
                  ${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" /> All-time income
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expenses */}
          <motion.div variants={fadeUp}>
            <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center"
                >
                  <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-red-600 dark:text-red-500 font-mono tracking-tight"
                  data-testid="text-total-expense"
                >
                  ${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1.5">All-time expenses</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Chart + Recent */}
        <motion.div variants={stagger} className="grid gap-5 lg:grid-cols-4">
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-sans">Cash Flow</CardTitle>
                <CardDescription>Income vs expenses — last 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} dx={-8} />
                      <Tooltip
                        contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                        itemStyle={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                      />
                      <Area type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                      <Area type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-1">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="font-sans text-base">Recent Activity</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <motion.div variants={stagger} className="space-y-0.5">
                  {recentTransactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      variants={fadeUp}
                      custom={i}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <CategoryIcon category={tx.category} />
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">{tx.category}</p>
                          <p className="text-xs text-muted-foreground">{format(parseISO(tx.date), "MMM dd")}</p>
                        </div>
                      </div>
                      <div className={`font-mono text-sm font-semibold shrink-0 ml-2 ${tx.type === "income" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                        {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
