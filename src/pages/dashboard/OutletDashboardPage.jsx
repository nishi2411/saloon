import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchBudgetSummary, fetchDashboardMetrics } from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

export function OutletDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [metrics, setMetrics] = useState(null);
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const [dashboardMetrics, budgetSummary] = await Promise.all([
        fetchDashboardMetrics({ role: user?.role, outletId: user?.outlet_id }),
        fetchBudgetSummary({ outletId: user?.outlet_id }),
      ]);

      setMetrics(dashboardMetrics);
      setBudget(budgetSummary);
    };

    if (user?.outlet_id) {
      loadDashboard();
    }
  }, [user]);

  return (
    <div>
      <PageHeader
        eyebrow="Outlet Manager"
        title="Your branch pulse"
        description="Track the health of your salon floor, jump into billing, and keep spend under control without leaving the branch workspace."
        action={
          <Link to="/pos" className="btn-primary">
            Create Bill
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Staff On Record", metrics?.staffCount ?? "--"],
          ["Active Services", metrics?.serviceCount ?? "--"],
          ["Tracked SKUs", metrics?.inventoryCount ?? "--"],
          ["Remaining Budget", budget ? formatCurrency(budget.remainingBalance) : "--"],
        ].map(([label, value]) => (
          <div key={label} className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Budget Snapshot
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">This month’s operating room</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Monthly Budget", budget ? formatCurrency(budget.totalMonthlyBudget) : "--"],
              ["Expenses So Far", budget ? formatCurrency(budget.totalExpensesSoFar) : "--"],
              ["Remaining Balance", budget ? formatCurrency(budget.remainingBalance) : "--"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-100 bg-white/85 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Next Actions
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">Daily operator checklist</h2>
          <div className="mt-6 grid gap-3">
            {[
              ["Bill a customer", "/pos"],
              ["Log a branch expense", "/expenses/local"],
              ["Top up inventory", "/inventory"],
              ["Review staff setup", "/staff"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="rounded-3xl border border-slate-100 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
