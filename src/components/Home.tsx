'use client';
import { useState } from 'react';
import Form from './Form';
import Results from './Result';
import { calculateExpenses, emptyForm, ExpenseResult, Person } from '@/lib/utils';

export default function HomeComponent() {
  const [people, setPeople] = useState<Person[]>(emptyForm);
  const [result, setResult] = useState<ExpenseResult | null>(null);

  const calculate = () => {
    const expenseResult = calculateExpenses(people);
    console.log('Expense Result:', expenseResult);
    setResult(expenseResult);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      {result ? (
        <Results result={result} setResult={setResult} />
      ) : (
        <Form people={people} setPeople={setPeople} calculate={calculate} />
      )}
    </main>
  );
}
