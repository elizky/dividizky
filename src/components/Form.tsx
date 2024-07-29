import { useState, useCallback } from 'react';
import { emptyForm, FormProps, Person, validateInput, validateTotalPeople } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Divide, PersonStanding, Trash } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useTranslations } from 'next-intl';

export default function Form({ people, setPeople, calculate }: FormProps) {
  const [additionalPeople, setAdditionalPeople] = useState<number>(0);
  const [errors, setErrors] = useState<string[]>([]);

  const t = useTranslations('FormComponent');

  const handleAddPerson = useCallback(() => {
    if (validateInput(people)) {
      setPeople([...people, { name: '', expense: 0 }]);
      setErrors([]);
    } else {
      setErrors([t('errors.fillFields')]);
    }
  }, [people, setPeople, t]);

  const handleRemovePerson = useCallback(
    (index: number) => {
      if (people.length > 2 || additionalPeople > 1) {
        const newPeople = people.filter((_, i) => i !== index);
        setPeople(newPeople);
      }
    },
    [people, additionalPeople, setPeople]
  );

  const handleRemoveAll = useCallback(() => {
    setPeople(emptyForm);
  }, [setPeople]);

  const handleChange = useCallback(
    (index: number, field: keyof Person, value: string | number) => {
      const newPeople = [...people];
      newPeople[index] = {
        ...newPeople[index],
        [field]: value,
      };
      setPeople(newPeople);
      setErrors([]);
    },
    [people, setPeople]
  );

  const handleAdditionalPeopleChange = useCallback((value: string | number) => {
    setAdditionalPeople(Number(value));
  }, []);

  const handleCalculate = useCallback(() => {
    const totalPeople = people.length + additionalPeople;

    if (validateInput(people) && validateTotalPeople(totalPeople)) {
      calculate(additionalPeople);
      setErrors([]);
    } else {
      setErrors([t('errors.validateInput')]);
    }
  }, [people, additionalPeople, calculate, t]);

  return (
    <Card className='w-[500px]'>
      <CardHeader>
        <div className='flex items-center justify-start gap-2 mb-2'>
          <CardTitle className='text-2xl font-bold '>{t('dividizkyTitle')}</CardTitle>
          <Divide className='h-8 w-8 -rotate-45 text-primary' />
        </div>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {people.map((person, index) => (
          <div key={index} className='flex gap-4'>
            <Input
              type='text'
              placeholder={t('namePlaceholder')}
              autoComplete='false'
              value={person.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className='w-2/3'
            />
            <Input
              type='number'
              placeholder={t('expensePlaceholder')}
              autoComplete='false'
              value={person.expense}
              onChange={(e) => handleChange(index, 'expense', parseFloat(e.target.value))}
              className='w-1/3'
            />
            <Button variant='outline' size='icon' onClick={() => handleRemovePerson(index)}>
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        ))}
        {errors.map((error, i) => (
          <span key={i} className='text-red-500 text-xs text-wrap'>
            {error}
          </span>
        ))}
        <div className='flex items-center justify-between gap-4'>
          <Label className='w-2/3'>{t('personNotPayLabel')}</Label>
          <Input
            type='number'
            autoComplete='false'
            value={additionalPeople}
            onChange={(e) => handleAdditionalPeopleChange(parseInt(e.target.value))}
            className='w-1/3'
          />
          <PersonStanding className='mx-1 h-6 w-6' />
        </div>
        <Button onClick={handleAddPerson} variant='outline' className='w-full mt-12'>
          + {t('addPersonButton')}
        </Button>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='destructive' onClick={handleRemoveAll}>
          {t('clearButton')}
        </Button>
        <Button onClick={handleCalculate}>{t('calculateButton')}</Button>
      </CardFooter>
    </Card>
  );
}
