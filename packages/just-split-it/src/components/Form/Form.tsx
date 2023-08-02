import { FieldValues, UseFormReturn } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  renderFormContent: (formContent: React.ReactNode, formHook: UseFormReturn<T>) => React.ReactNode;
  children: React.ReactNode;
  formHook: UseFormReturn<T>;
}

const Form = <T extends FieldValues>({ renderFormContent, formHook, children }: FormProps<T>) => {
  return renderFormContent(children, formHook);
};
export default Form;
