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
import {
  emptyForm,
  formattedAmount,
  generateWhatsAppMessage,
  ResultProps,
  toCapitalize,
} from '@/lib/utils';
import { CircleDollarSign, CircleUser, PersonStanding } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Results = ({ result, setResult, setPeople }: ResultProps) => {
  const t = useTranslations('ResultsComponent');
  const whatsappTexts = {
    orderizky: t('generateWhatsAppMessage.orderizky'),
    date: t('generateWhatsAppMessage.date'),
    orderDetails: t('generateWhatsAppMessage.orderDetails'),
    totalExpense: t('generateWhatsAppMessage.totalExpense'),
    totalParticipants: t('generateWhatsAppMessage.totalParticipants'),
    totalPerParticipant: t('generateWhatsAppMessage.totalPerParticipant'),
    balances: t('generateWhatsAppMessage.balances'),
    paymentDetails: t('generateWhatsAppMessage.paymentDetails'),
    paymentDetails2: t('generateWhatsAppMessage.paymentDetails2'),
    anonymousPayment: t('generateWhatsAppMessage.anonymousPayment'),
  };

  if (!result) return null;

  const anonymousPayments = result.payments.filter((payment) => payment.from === 'Anónimo');

  const details = [
    {
      icon: <CircleDollarSign className='h-4 w-4' />,
      title: t('totalExpense'),
      value: formattedAmount(result.totalExpense),
    },
    {
      icon: <CircleUser className='h-4 w-4' />,
      title: t('totalParticipants'),
      value: result.numberOfPeople,
    },
    {
      icon: <PersonStanding className='h-4 w-4' />,
      title: t('totalPerParticipant'),
      value: formattedAmount(result.perPersonExpense),
    },
  ];

  const handleClear = () => {
    setPeople(emptyForm);
    setResult(null);
  };

  const shareResults = () => {
    const message = generateWhatsAppMessage(result, whatsappTexts);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className='overflow-hidden border-dashed border-2 shadow-none w-[300px] sm:w-96 '>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>{t('orderizky')}</CardTitle>
          <CardDescription>
            {t('date')}: {new Date().toLocaleDateString()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='p-6 text-sm'>
        <div className='grid gap-3'>
          <div className='font-semibold'>{t('orderDetails')}</div>
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
                    {toCapitalize(payment.from)} {t('paymentDetails')} {toCapitalize(payment.to)}
                  </span>
                  <span className='font-semibold'>{formattedAmount(payment.amount)}</span>
                </li>
              ))}
            {anonymousPayments.length > 0 && (
              <li className='flex justify-between text-muted-foreground'>
                <span className='w-2/3'>
                  {t('anonymousPayment')} {toCapitalize(anonymousPayments[0].to)}
                </span>
                <span className='font-semibold'>{formattedAmount(result.perPersonExpense)}</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between items-center border-t bg-muted/50 px-6 py-3'>
        <Button onClick={handleClear} variant='destructive'>
          {t('clearButton')}
        </Button>
        <Button onClick={shareResults} variant='default'>
          {t('shareButton')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Results;
