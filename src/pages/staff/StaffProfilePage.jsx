import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchStaffProfile, grantAdvance } from "../../services/mockApi";
import { formatCurrency } from "../../utils/format";

const initialAdvanceForm = {
  totalAdvanceAmount: "",
  deductionStartMonth: "",
  duration: "",
};

export function StaffProfilePage() {
  const { staffId } = useParams();
  const [staff, setStaff] = useState(null);
  const [form, setForm] = useState(initialAdvanceForm);

  const loadProfile = async () => {
    const profile = await fetchStaffProfile(staffId);
    setStaff(profile);
  };

  useEffect(() => {
    loadProfile();
  }, [staffId]);

  const emi =
    Number(form.totalAdvanceAmount || 0) / Math.max(Number(form.duration || 1), 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await grantAdvance(staffId, form);
    setForm(initialAdvanceForm);
    loadProfile();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Staff Profile"
        title={staff?.name || "Loading staff profile"}
        description="Review employee payroll setup, current advances, and grant a new advance with EMI auto-calculation."
        action={
          <Link to="/staff" className="btn-secondary">
            Back to Staff
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Summary
          </p>
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div className="rounded-3xl border border-slate-100 bg-white/85 p-4">
              <p className="font-semibold text-slate-900">Role</p>
              <p className="mt-1">{staff?.role}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white/85 p-4">
              <p className="font-semibold text-slate-900">Assigned Outlet</p>
              <p className="mt-1">{staff?.assignedOutletName}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white/85 p-4">
              <p className="font-semibold text-slate-900">Base Salary</p>
              <p className="mt-1">{formatCurrency(staff?.baseSalary)}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white/85 p-4">
              <p className="font-semibold text-slate-900">Contract File</p>
              <p className="mt-1">{staff?.contractFileName}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              Grant Advance
            </p>
            <h2 className="mt-3 text-3xl text-slate-900">Advance salary form</h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="label-text">Total Advance Amount</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.totalAdvanceAmount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      totalAdvanceAmount: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="label-text">Deduction Start Month</label>
                <input
                  type="month"
                  className="input-field"
                  value={form.deductionStartMonth}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      deductionStartMonth: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="label-text">Duration</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.duration}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      duration: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
                Monthly EMI deduction will be: {formatCurrency(emi || 0)}
              </div>
              <button type="submit" className="btn-primary w-full">
                Grant Advance
              </button>
            </form>
          </div>

          <div className="glass-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              Active Advances
            </p>
            <div className="mt-5 space-y-3">
              {staff?.advances?.length ? (
                staff.advances.map((advance) => (
                  <div
                    key={advance.id}
                    className="rounded-3xl border border-slate-100 bg-white/85 p-4"
                  >
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(advance.totalAdvanceAmount)} over {advance.duration} months
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Starts {advance.deductionStartMonth} • EMI {formatCurrency(advance.emi)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm text-slate-600">
                  No advances granted yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
