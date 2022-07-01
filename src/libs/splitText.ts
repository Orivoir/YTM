export default function (value: string, maxLength: number = 20): string {
  return (value.slice(0, maxLength) + (value.length > maxLength ? "..." : ""))
}
