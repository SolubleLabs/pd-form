import FormSchema from "./FormSchema.ts";
import type { FormDescriptor } from "./types.ts";

export function validateForm(
  formData: Dictionary<any>,
  descriptor: FormDescriptor,
  schema: FormSchema
) {
  const errors: Dictionary<string> = {};
  for (const [fieldId, { fieldClass, params, hidden }] of Object.entries(
    descriptor.fields
  )) {
    // do not impose validation rule on hidden fields
    if (hidden) continue;

    const error = schema
      .getFieldClassMeta(fieldClass)
      ?.onValidate?.(params, formData[fieldId]);
    if (error != null) errors[fieldId] = error;
  }

  return errors;
}

export function validateField(
  fieldId: string,
  value: any,
  descriptor: FormDescriptor,
  schema: FormSchema
) {
  const desc = descriptor.fields[fieldId];
  if (!desc) return undefined;

  const { fieldClass, hidden, params } = desc;
  if (hidden) return undefined;

  return schema.getFieldClassMeta(fieldClass)?.onValidate?.(params, value);
}
