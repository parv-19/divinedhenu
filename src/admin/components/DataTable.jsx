export default function DataTable({ columns, rows, emptyText = 'No records found' }) {
  return (
    <div className="overflow-hidden rounded-lg border border-ritual-border bg-ritual-card">
      <div className="overflow-x-auto">
        <table className="min-w-max divide-y divide-ritual-border text-sm lg:min-w-full">
          <thead className="bg-ritual-background/70">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-ritual-muted">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ritual-border">
            {rows.length ? rows.map((row) => (
              <tr key={row._id || row.id} className="align-middle">
                {columns.map((column) => (
                  <td key={column.key} className="max-w-[260px] whitespace-nowrap px-4 py-3 text-ritual-text">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-ritual-muted">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
