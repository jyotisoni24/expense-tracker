import { addMonths, subDays } from 'date-fns';

export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Food & Dining'
  | 'Housing'
  | 'Transportation'
  | 'Entertainment'
  | 'Healthcare'
  | 'Shopping'
  | 'Salary'
  | 'Freelance'
  | 'Investments';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  notes?: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

const today = new Date();

export const initialTransactions: Transaction[] = [
  { id: '1', amount: 5000, type: 'income', category: 'Salary', date: today.toISOString(), notes: 'Monthly salary' },
  { id: '2', amount: 1200, type: 'expense', category: 'Housing', date: subDays(today, 2).toISOString(), notes: 'Rent' },
  { id: '3', amount: 45, type: 'expense', category: 'Food & Dining', date: subDays(today, 3).toISOString(), notes: 'Dinner with friends' },
  { id: '4', amount: 150, type: 'expense', category: 'Transportation', date: subDays(today, 5).toISOString(), notes: 'Gas and transit' },
  { id: '5', amount: 800, type: 'income', category: 'Freelance', date: subDays(today, 8).toISOString(), notes: 'Website project' },
  { id: '6', amount: 120, type: 'expense', category: 'Entertainment', date: subDays(today, 10).toISOString(), notes: 'Concert tickets' },
  { id: '7', amount: 200, type: 'expense', category: 'Healthcare', date: subDays(today, 12).toISOString(), notes: 'Dentist' },
  { id: '8', amount: 350, type: 'expense', category: 'Shopping', date: subDays(today, 15).toISOString(), notes: 'New clothes' },
  { id: '9', amount: 300, type: 'expense', category: 'Investments', date: subDays(today, 20).toISOString(), notes: 'Index funds' },
  { id: '10', amount: 65, type: 'expense', category: 'Food & Dining', date: subDays(today, 22).toISOString(), notes: 'Groceries' },
  { id: '11', amount: 40, type: 'expense', category: 'Transportation', date: subDays(today, 25).toISOString(), notes: 'Uber' },
  { id: '12', amount: 5000, type: 'income', category: 'Salary', date: subDays(today, 30).toISOString(), notes: 'Monthly salary' },
  { id: '13', amount: 1200, type: 'expense', category: 'Housing', date: subDays(today, 32).toISOString(), notes: 'Rent' },
  { id: '14', amount: 90, type: 'expense', category: 'Entertainment', date: subDays(today, 35).toISOString(), notes: 'Movie night' },
  { id: '15', amount: 210, type: 'expense', category: 'Shopping', date: subDays(today, 40).toISOString(), notes: 'Electronics' },
];

export const categoryBudgets: Budget[] = [
  { category: 'Food & Dining', limit: 600 },
  { category: 'Housing', limit: 1500 },
  { category: 'Transportation', limit: 300 },
  { category: 'Entertainment', limit: 200 },
  { category: 'Healthcare', limit: 250 },
  { category: 'Shopping', limit: 400 },
  { category: 'Investments', limit: 500 },
];
