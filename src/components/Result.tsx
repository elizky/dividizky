import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { formattedAmount, ResultProps, toCapitalize } from '@/lib/utils';
import { CircleDollarSign, CircleUser, PersonStanding } from 'lucide-react';

const Results = ({ result, setResult }: ResultProps) => {
  if (!result) return null;
  const anonymousPayments = result.payments.filter((payment) => payment.from === 'Anónimo');

  const details = [
    {
      icon: <CircleDollarSign className='h-4 w-4' />,
      title: 'Total Expense',
      value: formattedAmount(result.totalExpense),
    },
    {
      icon: <CircleUser className='h-4 w-4' />,
      title: 'Total participants',
      value: result.numberOfPeople,
    },
    {
      icon: <PersonStanding className='h-4 w-4' />,
      title: 'Total per participant',
      value: formattedAmount(result.perPersonExpense),
    },
  ];

  return (
    <Card className='overflow-hidden w-96 border-dashed border-2 shadow-none'>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>Orderizky</CardTitle>
          <CardDescription>Date: {new Date().toLocaleDateString()}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='p-6 text-sm'>
        <div className='grid gap-3'>
          <div className='font-semibold'>Order Details</div>
          <ul className='grid gap-3'>
            {details.map((detail) => (
              <li key={detail.title} className='flex items-center justify-between'>
                <span className='text-muted-foreground flex items-center gap-2'>
                  {detail.icon}
                  {detail.title}
                </span>
                <span>{detail.value}</span>
              </li>
            ))}
          </ul>
          <Separator className='my-2' />
          <ul className='grid gap-3'>
            {result.balances
              .filter((balance) => balance.name !== 'Anónimo')
              .map((balance, index) => (
                <li key={index} className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>{toCapitalize(balance.name)}</span>
                  {balance.balance >= 0 ? (
                    <span className='text-green-500'>{formattedAmount(balance.balance)}</span>
                  ) : (
                    <span className='text-destructive'>
                      {formattedAmount(Math.abs(balance.balance))}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <Separator className='my-4' />
        <div className='grid gap-3'>
          <div className='font-semibold'>Dividizky</div>
          <ul className='grid gap-2'>
            {result.payments
              .filter((payment) => payment.from !== 'Anónimo')
              .map((payment, index) => (
                <li key={index} className='flex justify-between text-muted-foreground'>
                  <span>
                    {toCapitalize(payment.from)} le paga a {toCapitalize(payment.to)}
                  </span>
                  <span className='font-semibold'>{formattedAmount(payment.amount)}</span>
                </li>
              ))}
            {anonymousPayments.length > 0 && (
              <li className='flex justify-between text-muted-foreground'>
                <span>
                  Los que no pagaron tienen que pagar a {toCapitalize(anonymousPayments[0].to)}
                </span>
                <span className='font-semibold'>{formattedAmount(result.perPersonExpense)}</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between items-center border-t bg-muted/50 px-6 py-3'>
        <Button onClick={() => setResult(null)} variant='destructive'>
          Clear
        </Button>
        <Button onClick={() => console.log('hola')} variant='default'>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Results;
