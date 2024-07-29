import MaskedInput from 'react-text-mask';

const MoneyInput = () => {
  return (
    <MaskedInput
      mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      className=''
      placeholder='Enter a phone number'
      guide={false}
      id='my-input-id'

    />
  );
};

export default MoneyInput;
