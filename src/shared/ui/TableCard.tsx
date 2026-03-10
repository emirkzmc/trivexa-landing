interface TableCardProps {
  title: string;
  columns: string[];
  rows: string[][];
}

export default function TableCard({ title, columns, rows }: TableCardProps) {
  return (
    <section
      style={{
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>{title}</h3>
      <div style={{ marginTop: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontSize: 11, letterSpacing: "0.08em" }}>
              {columns.map((column) => (
                <th key={column} style={{ padding: "10px 8px", fontWeight: 700, textTransform: "uppercase" }}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`} style={{ borderBottom: "1px solid #F1F5F9", color: "#374151", fontSize: 14 }}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} style={{ padding: "11px 8px" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
