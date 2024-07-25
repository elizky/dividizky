import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Person {
  name: string;
  expense: number;
}

export interface Balance {
  name: string;
  balance: number;
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseResult {
  totalExpense: number;
  numberOfPeople: number;
  perPersonExpense: number;
  balances: Balance[];
  payments: Payment[];
}

export interface FormProps {
  people: Person[];
  setPeople: (people: Person[]) => void;
  calculate: () => void;
}

export interface ResultProps {
  result: ExpenseResult | null;
  setResult: (arg0: any) => void;
}

export const emptyForm = [
  { name: '', expense: 0 },
  { name: '', expense: 0 },
];

// ✅
export function calculateTotalExpense(people: Person[]): number {
  return people.reduce((total, person) => total + person.expense, 0);
}

// ✅
export function calculatePerPersonExpense(totalExpense: number, numberOfPeople: number): number {
  return totalExpense / numberOfPeople;
}

// ✅
export function calculateBalances(people: Person[], perPersonExpense: number): Balance[] {
  return people.map((person) => {
    const balance = person.expense - perPersonExpense;
    return {
      name: person.name,
      balance: balance,
    };
  });
}

// ✅
export function assignPayments(balances: Balance[]): Payment[] {
  const balancesCopy = balances.map((balance) => ({ ...balance }));

  const debtors: Balance[] = balancesCopy
    .filter((balance) => balance.balance < 0)
    .sort((a, b) => a.balance - b.balance);
  const creditors: Balance[] = balancesCopy
    .filter((balance) => balance.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const payments: Payment[] = [];

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];

    const amount = Math.min(-debtor.balance, creditor.balance);

    payments.push({ from: debtor.name, to: creditor.name, amount });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (debtor.balance === 0) debtors.shift();
    if (creditor.balance === 0) creditors.shift();
  }

  return payments;
}

export function calculateExpenses(people: Person[]): ExpenseResult {
  const totalExpense = calculateTotalExpense(people);
  const numberOfPeople = people.length;
  const perPersonExpense = calculatePerPersonExpense(totalExpense, numberOfPeople);
  const balances = calculateBalances(people, perPersonExpense);
  const payments = assignPayments(balances);

  return {
    totalExpense,
    numberOfPeople,
    perPersonExpense,
    balances,
    payments,
  };
}

export const formattedAmount = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const toCapitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
