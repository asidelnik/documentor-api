export function tryParseInt(str, defaultValue) {
  const value = parseInt(str, 10);
  return isNaN(value) ? defaultValue : value;
}

export function tryParseIntOrUndefined(str) {
  const value = parseInt(str, 10);
  return isNaN(value) ? undefined : value;
}