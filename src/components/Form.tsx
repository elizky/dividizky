import { emptyForm, FormProps, Person } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Trash } from 'lucide-react';

export default function Form({ people, setPeople, calculate }: FormProps) {
  const handleAddPerson = () => {
    setPeople([...people, { name: '', expense: 0 }]);
  };

  const handleRemovePerson = (index: number) => {
    if (people.length > 2) {
      const newPeople = people.filter((_, i) => i !== index);
      setPeople(newPeople);
    }
  };

  const handleRemoveAll = () => {
    setPeople(emptyForm);
  };

  const handleChange = (index: number, field: keyof Person, value: string | number) => {
    const newPeople = [...people];
    newPeople[index] = {
      ...newPeople[index],
      [field]: value,
    };
    setPeople(newPeople);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold mb-4'>Dividizky</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {people.map((person, index) => (
          <div key={index}>
            <input
              type='text'
              placeholder='Nombre'
              value={person.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className='border p-2 mr-2'
            />
            <input
              type='number'
              placeholder='Gasto'
              value={person.expense}
              onChange={(e) => handleChange(index, 'expense', parseFloat(e.target.value))}
              className='border p-2 mr-2'
            />
            <Button variant='outline' size='icon' onClick={() => handleRemovePerson(index)}>
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        ))}
        <Button onClick={handleAddPerson} variant='outline' className='w-full mt-12'>
          + Agregar Persona
        </Button>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button variant='destructive' onClick={handleRemoveAll}>
          Clear
        </Button>
        <Button onClick={calculate}>Calcular</Button>
      </CardFooter>
    </Card>
  );
}
