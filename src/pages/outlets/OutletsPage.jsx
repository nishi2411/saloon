import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchOutlets } from "../../services/mockApi";
import { formatCurrency } from "../../utils/format";

export function OutletsPage() {
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    fetchOutlets().then(setOutlets);
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Network"
        title="Outlets"
        description="A placeholder management view for branch-level settings, ownership, and budget context."
      />

      <div className="table-shell">
        <table className="min-w-full">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-4">Outlet</th>
              <th className="px-4 py-4">City</th>
              <th className="px-4 py-4">Manager</th>
              <th className="px-4 py-4">Monthly Budget</th>
            </tr>
          </thead>
          <tbody className="bg-white/90">
            {outlets.map((outlet) => (
              <tr key={outlet.id}>
                <td className="table-cell font-semibold text-slate-900">{outlet.name}</td>
                <td className="table-cell">{outlet.city}</td>
                <td className="table-cell">{outlet.manager}</td>
                <td className="table-cell">{formatCurrency(outlet.monthlyBudget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
