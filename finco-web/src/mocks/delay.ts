// Simuleaza latenta retelei pentru stratul mock.
export function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
