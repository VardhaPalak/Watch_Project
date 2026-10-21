const RISKY_PREFIX = /^[=+\-@\t\r]/;

function escapeCell(value) {
  if (value === null || value === undefined) return "";
  let cell = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (RISKY_PREFIX.test(cell)) cell = `'${cell}`;
  if (/[",\n\r]/.test(cell)) cell = `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

export function toCsv(headers, rows) {
  const head = headers.map((header) => escapeCell(header.label ?? header.key)).join(",");
  const body = rows
    .map((row) =>
      headers
        .map((header) => escapeCell(typeof header.value === "function" ? header.value(row) : row[header.key]))
        .join(","),
    )
    .join("\n");
  return `${head}\n${body}\n`;
}
