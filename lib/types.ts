export type Profile = {
  id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  subcategory: string | null;
  description: string;
  paid_to: string | null;
  amount: number;
  payment_mode: string | null;
  notes: string | null;
  profile_id: string | null;
  created_at: string;
};

export type ExpenseInput = Omit<Expense, "id" | "created_at">;
