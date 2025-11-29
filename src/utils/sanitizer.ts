export const deepSanitize = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  } else if (obj !== null && typeof obj === 'object') {
    const clean: Record<string, unknown> = {};
    for (const key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        !['__proto__', 'constructor', 'prototype'].includes(key)
      ) {
        const sanitizedKey = key.replace(/[.$]/g, '');

        //@ts-expect-error - this is a known issue with deepSanitize
        clean[sanitizedKey] = deepSanitize(obj[key]);
      }
    }
    return clean;
  } else {
    return obj;
  }
};
