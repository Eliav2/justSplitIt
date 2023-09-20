import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormProps<T extends FieldValues> {
  renderFormContent: RenderFormContent<T>;
  children: React.ReactNode;
  formHook: UseFormReturn<T>;
}

export interface FormRendererProps<T extends FieldValues> {
  renderFormContent: RenderFormContent<T>;
}
export type RenderFormContent<T extends FieldValues> = (
  formContent: React.ReactNode,
  formHook: UseFormReturn<T>,
) => React.ReactNode;

const FormRenderer = <T extends FieldValues>({
  renderFormContent,
  formHook,
  children,
}: FormProps<T>) => {
  return renderFormContent(children, formHook);
};
export default FormRenderer;
