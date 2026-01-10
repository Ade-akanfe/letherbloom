export default function generateCode(): string {
  const prefix = "LHB";
  const ts = Date.now().toString(36);
  const rand = Array.from({ length: 8 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
  return `${prefix}-${ts}-${rand}`.toUpperCase();
}
