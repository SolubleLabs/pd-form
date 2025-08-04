export function setFieldValue(fieldId: string, value: any) {
  return {
    type: '@form/viewer/setFieldValue',
    payload: {
      fieldId,
      value
    }
  } as const;
}

export function clearValue(fieldId: string) {
  return {
    type: '@form/viewer/clearValue',
    payload: {
      fieldId
    }
  } as const;
}
