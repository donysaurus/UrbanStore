export function formatIDR(amount: number): string {
  return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

export function formatShortIDR(amount: number): string {
  if (amount >= 1000) {
    return `Rp${Math.round(amount / 1000)}k`;
  }
  return formatIDR(amount);
}
