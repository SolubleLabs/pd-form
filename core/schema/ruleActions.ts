export function addRule(targetPath: string, calculableClass: string) {
  return {
    type: '@form/addRule',
    payload: {
      targetPath,
      calculableClass
    }
  } as const;
}

export function removeRule(targetPath: string) {
  return {
    type: '@form/removeRule',
    payload: {
      targetPath
    }
  } as const;
}

export function setRuleType(targetPath: string, calculableClass: string) {
  return {
    type: '@form/setRuleType',
    payload: {
      targetPath,
      calculableClass
    }
  } as const;
}
