'use client';
import { useState, useCallback } from 'react';
import FormComponent from './Form';
import Results from './Result';
import { calculateExpenses, emptyForm, ExpenseResult, FormValues, Person } from '@/lib/utils';

export default function HomeComponent() {
  const [people, setPeople] = useState<Person[]>(emptyForm);
  const [result, setResult] = useState<ExpenseResult | null>(null);

  const calculate = useCallback((formValues: FormValues) => {
    const expenseResult = calculateExpenses(formValues);
    setResult(expenseResult);
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center sm:p-24'>
      {result ? (
        <Results result={result} setResult={setResult} setPeople={setPeople} />
      ) : (
        <FormComponent people={people} setPeople={setPeople} calculate={calculate} />
      )}
    </main>
  );
}
