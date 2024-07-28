'use client';
import { useState, useCallback } from 'react';
import FormComponent from './Form';
import Results from './Result';
import { calculateExpenses, emptyForm, ExpenseResult, Person } from '@/lib/utils';

export default function HomeComponent() {
  const [people, setPeople] = useState<Person[]>(emptyForm);
  const [result, setResult] = useState<ExpenseResult | null>(null);

  const calculate = useCallback(
    (additionalPeople: number) => {
      const expenseResult = calculateExpenses(people, additionalPeople);
      setResult(expenseResult);
    },
    [people]
  );

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      {result ? (
        <Results result={result} setResult={setResult} />
      ) : (
        <FormComponent people={people} setPeople={setPeople} calculate={calculate} />
      )}
    </main>
  );
}
