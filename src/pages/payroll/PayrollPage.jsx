import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { generatePayrollPreview } from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

export function PayrollPage() {
  const user = useAuthStore((state) => state.user);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadPayroll = async () => {
    const preview = await generatePayrollPreview({
      outletId: user?.role === "admin" ? undefined : user?.outlet_id,
    });
    setRows(preview);
  };

  useEffect(() => {
    if (user) {
      loadPayroll();
    }
  }, [user]);

  return (
    <div>
      <PageHeader
        eyebrow="Payroll"
        title="Payroll Generation"
        description="Preview payroll-ready records with commission, taxes, PF, and advance EMI all represented before backend export logic is introduced."
        action={
          <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
            Generate Payroll
          </button>
        }
      />

      <div className="table-shell">
        <table className="min-w-full">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-4">Staff</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Outlet</th>
              <th className="px-4 py-4">Base Salary</th>
              <th className="px-4 py-4">Net Pay</th>
            </tr>
          </thead>
          <tbody className="bg-white/90">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="table-cell font-semibold text-slate-900">{row.name}</td>
                <td className="table-cell">{row.role}</td>
                <td className="table-cell">{row.assignedOutletName}</td>
                <td className="table-cell">{formatCurrency(row.baseSalary)}</td>
                <td className="table-cell">{formatCurrency(row.netPay)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8">
          <div className="glass-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                  Mocked Payslips
                </p>
                <h2 className="mt-2 text-3xl text-slate-900">Payroll breakdown</h2>
              </div>
              <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {rows.map((row) => (
                <div key={row.id} className="rounded-3xl border border-slate-100 bg-white/90 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl text-slate-900">{row.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {row.role} • {row.assignedOutletName}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-brand-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-brand-700">Net Pay</p>
                      <p className="mt-2 text-lg font-semibold text-brand-800">
                        {formatCurrency(row.netPay)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                      Base Salary
                      <div className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(row.baseSalary)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                      Commissions
                      <div className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(row.commissions)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                      Taxes
                      <div className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(row.taxes)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                      PF
                      <div className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(row.pfDeduction)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                      Advance EMI
                      <div className="mt-2 font-semibold text-slate-900">
                        {formatCurrency(row.advanceEmi)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
