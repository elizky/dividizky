'use client';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divide, PersonStanding, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { emptyForm, FormProps, getFormSchema, validateInput } from '@/lib/utils';

export default function FormComponent({ people, setPeople, calculate }: FormProps) {
  const t = useTranslations('FormComponent');
  const formSchema = getFormSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      people,
      additionalPeople: 0,
    },
  });

  const peopleWatcher = form.watch('people');
  console.log('peopleWatcher', peopleWatcher);
  console.log('people', people);

  const handleAddPerson = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!validateInput(peopleWatcher)) {
      form.setError('people', {
        type: 'manual',
        message: t('errors.fillFields'),
      });
      return;
    }
    const newPeople = [...peopleWatcher, { name: '', expense: 0 }];
    setPeople(newPeople);
    form.setValue('people', newPeople);
  };

  const handleRemovePerson = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (people.length > 2) {
      const newPeople = people.filter((_, i) => i !== index);
      setPeople(newPeople);

      // Actualiza el valor en react-hook-form
      form.setValue('people', newPeople);
    }
  };

  const handleRemoveAll = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    // Reinicia el estado de people
    setPeople(emptyForm);

    // Actualiza el valor en react-hook-form
    form.reset({
      people: emptyForm,
      additionalPeople: 0,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { people, additionalPeople } = values;
    const totalPeople = people.length + additionalPeople;

    if (totalPeople < 2) {
      form.setError('additionalPeople', {
        type: 'manual',
        message: t('errors.minimumPeople'),
      });
      return;
    } else {
      calculate(values);
    }
  };

  return (
    <Card className='w-[300px] sm:w-[500px]'>
      <CardHeader className='text-center sm:text-left'>
        <div className='flex items-center justify-center sm:justify-start gap-2 mb-2'>
          <CardTitle className='text-2xl font-bold '>{t('dividizkyTitle')}</CardTitle>
          <Divide className='h-8 w-8 -rotate-45 text-primary' />
        </div>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {peopleWatcher.map((_, index) => (
              <div key={index} className='flex gap-1 sm:gap-4'>
                <FormField
                  control={form.control}
                  name={`people.${index}.name`}
                  render={({ field }) => (
                    <FormItem className='w-2/3'>
                      <FormControl>
                        <Input {...field} placeholder={t('namePlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`people.${index}.expense`}
                  render={({ field }) => (
                    <FormItem className='w-1/3'>
                      <FormControl>
                        <Input {...field} type='tel' placeholder={t('expensePlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant='outline' size='icon' onClick={(e) => handleRemovePerson(index, e)}>
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
            ))}
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-4'>
              <Label className='text-center sm:text-left sm:w-2/3'>{t('personNotPayLabel')}</Label>
              <FormField
                control={form.control}
                name='additionalPeople'
                render={({ field }) => (
                  <FormItem className='w-full sm:w-1/3'>
                    <FormControl>
                      <Input {...field} type='tel' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PersonStanding className='hidden sm:block sm:mx-1 h-6 w-6' />
            </div>
            <Button
              onClick={(e) => handleAddPerson(e)}
              variant='outline'
              className=' w-full !mt-8 sm:mt-12 '
            >
              + {t('addPersonButton')}
            </Button>
            <FormMessage>{form.formState.errors.people?.message}</FormMessage>
            <CardFooter className='flex justify-between mt-4'>
              <Button type='button' variant='destructive' onClick={(e) => handleRemoveAll(e)}>
                {t('clearButton')}
              </Button>
              <Button type='submit'>{t('calculateButton')}</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
