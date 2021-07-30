function valueToString(value: number): string {
  return (value / 100).toFixed(2).toString().replace(".", ",") + " zł";
}
export { valueToString };
