/**
 * Formatea un precio como entero con separador de miles y sufijo "Gs."
 * Ejemplos: 3000 → "3.000 Gs." | 15000 → "15.000 Gs."
 */
export function fmtPrecio(value) {
  const n = Math.round(Number(value) || 0);
  // Separador de miles con punto (formato guaraní paraguayo)
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Gs.`;
}
