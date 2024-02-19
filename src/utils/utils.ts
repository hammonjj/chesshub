export function toUpperCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertKeysToUpperCamelCase(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToUpperCamelCase);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const modifiedKey = toUpperCamelCase(key);
    acc[modifiedKey[0].toLowerCase() + modifiedKey.slice(1)] = convertKeysToUpperCamelCase(obj[key]);
    return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);
}
