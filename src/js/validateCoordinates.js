export function validateCoordinates(input) {
  const regex = /([-+]?\d+\.\d+),\s?([-+]?\d+\.\d+)/;
  const match = input.match(regex);
  if (!match) {
    throw new Error("Invalid coordinate format");
  }
  const latitude = parseFloat(match[1]);
  const longitude = parseFloat(match[2]);
  return { latitude, longitude };
}
