import validateCoordinates from "..validateCoordinates/";

describe("Coordinate Validation", () => {
  it("should validate coordinates with a space", () => {
    const input = "51.50851, -0.12572";
    const result = validateCoordinates(input);
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  it("should validate coordinates without a space", () => {
    const input = "51.50851,-0.12572";
    const result = validateCoordinates(input);
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  it("should validate coordinates with square brackets", () => {
    const input = "[51.50851, -0.12572]";
    const result = validateCoordinates(input);
    expect(result).toEqual({ latitude: 51.50851, longitude: -0.12572 });
  });

  it("should throw an error for invalid format", () => {
    const invalidInput = "invalid";
    expect(() => validateCoordinates(invalidInput)).toThrowError(
      "Invalid coordinate format"
    );
  });
});
