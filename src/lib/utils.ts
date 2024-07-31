import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// INTERFACES
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
  calculate: (FormValues: FormValues) => void;
}

export interface ResultProps {
  result: ExpenseResult | null;
  setPeople: (people: Person[]) => void;
  setResult: (arg0: any) => void;
}

export interface FormValues {
  people: Person[];
  additionalPeople: number;
}

export type Locale = (typeof locales)[number];
export const locales = ['en', 'es'] as const;
export const defaultLocale: Locale = 'es';

// CONSTS

export const emptyForm = [{ name: '', expense: 0 }];

// FORM SCHEMA
export const getFormSchema = () => {
  return z.object({
    people: z.array(
      z.object({
        name: z.string().trim().min(1, { message: 'Must enter something' }).max(100),
        expense: z.coerce
          .number({
            required_error: 'Is required',
          })
          .positive({
            message: 'Please enter a number bigger than 0 ',
          }),
      })
    ),
    additionalPeople: z.coerce.number().min(0, 'Must be a positive number'),
  });
};

// LOGIC BUSINESS
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

// ✅
export function calculateExpenses({ people, additionalPeople }: FormValues): ExpenseResult {
  const totalExpense = calculateTotalExpense(people);
  const numberOfPeople = people.length + additionalPeople;
  const perPersonExpense = calculatePerPersonExpense(totalExpense, numberOfPeople);

  const allPeople = [...people, ...Array(additionalPeople).fill({ name: 'Anónimo', expense: 0 })];

  const balances = calculateBalances(allPeople, perPersonExpense);
  const payments = assignPayments(balances);

  return {
    totalExpense,
    numberOfPeople,
    perPersonExpense,
    balances,
    payments,
  };
}

// UI UTILS
export const formattedAmount = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const maskAmount = (value: string) => {
  const cleanedValue = value.replace(/[^\d.]/g, '');
  if (!cleanedValue) return '';
  const [integerPart, decimalPart] = cleanedValue.split('.');
  const formattedIntegerPart =
    integerPart === '0'
      ? '0'
      : integerPart.replace(/^0+/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  let formattedValue = formattedIntegerPart;

  if (decimalPart !== undefined) {
    formattedValue += `.${decimalPart}`;
  }

  formattedValue = `$${formattedValue}`;

  return formattedValue;
};

export const toCapitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

// SHARE BTN
export const generateWhatsAppMessage = (result: ExpenseResult, t: any) => {
  const lineSeparator = '\n';

  let orderDetails =
    `${t.orderizky}\n${t.date} ${new Date().toLocaleDateString()}${lineSeparator}${lineSeparator}` +
    `${t.orderDetails}${lineSeparator}` +
    `${t.totalExpense} ${formattedAmount(result.totalExpense)}${lineSeparator}` +
    `${t.totalParticipants} ${result.numberOfPeople}${lineSeparator}` +
    `${t.totalPerParticipant} ${formattedAmount(
      result.perPersonExpense
    )}${lineSeparator}${lineSeparator}` +
    `${t.balances}${lineSeparator}` +
    result.balances
      .filter((balance) => balance.name !== 'Anónimo')
      .map(
        (balance) =>
          `${toCapitalize(balance.name)}: ${balance.balance >= 0 ? '+' : '-'}${formattedAmount(
            Math.abs(balance.balance)
          )}`
      )
      .join(lineSeparator) +
    `${lineSeparator}${lineSeparator}${t.paymentDetails}${lineSeparator}` +
    result.payments
      .filter((payment) => payment.from !== 'Anónimo')
      .map(
        (payment) =>
          `➡️ ${toCapitalize(payment.from)} ${t.paymentDetails2} ${toCapitalize(
            payment.to
          )} ${formattedAmount(payment.amount)}`
      )
      .join(lineSeparator);

  if (result.payments.some((payment) => payment.from === 'Anónimo')) {
    orderDetails += `${lineSeparator}${lineSeparator}${t.anonymousPayment} *_${toCapitalize(
      result.payments[0].to
    )}_ ${formattedAmount(result.perPersonExpense)}*`;
  }

  return orderDetails;
};

export const validateInput = (people: Person[]): boolean => {
  return people.every((person) => person.name.trim() !== '' && person.expense !== 0);
};
