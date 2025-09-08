export function generatePrintDate() {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", // Para el año en formato completo (ej. 2025)
    month: "short", // Mes en formato abreviado (ej. Jan)
    day: "2-digit", // Día en formato de 2 dígitos (ej. 22)
    hour: "2-digit", // Hora en formato de 2 dígitos (ej. 23)
    minute: "2-digit", // Minuto en formato de 2 dígitos (ej. 41)
    hour12: false, // Hora en formato de 24 horas
  };
  const formattedDate = now.toLocaleString("en-GB", options).replace(",", ""); // Formato: "22 Jan 2025 23:41"
  return formattedDate;
}
