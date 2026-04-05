import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchDashboardMetrics, fetchOutlets } from "../../services/mockApi";
import { formatCurrency } from "../../utils/format";

export function GlobalDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const [dashboardMetrics, outletList] = await Promise.all([
        fetchDashboardMetrics({ role: "admin" }),
        fetchOutlets(),
      ]);

      setMetrics(dashboardMetrics);
      setOutlets(outletList);
    };

    loadDashboard();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Super Admin"
        title="Network performance at a glance"
        description="Monitor every outlet, keep an eye on headcount and catalog growth, and jump straight into the areas that need attention."
        action={
          <div className="flex flex-wrap gap-3">
            <Link to="/pos" className="btn-secondary">
              Create Bill
            </Link>
            <Link to="/outlets" className="btn-primary">
              Manage Outlets
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active Outlets", metrics?.activeOutlets ?? "--"],
          ["Total Staff", metrics?.staffCount ?? "--"],
          ["Live Services", metrics?.serviceCount ?? "--"],
          ["Monthly Budget Pool", metrics ? formatCurrency(metrics.totalBudget) : "--"],
        ].map(([label, value]) => (
          <div key={label} className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                Outlet Watch
              </p>
              <h2 className="mt-3 text-3xl text-slate-900">Branch snapshot</h2>
            </div>
            <Link to="/expenses" className="btn-secondary">
              View Expenses
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-2xl text-slate-900">{outlet.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {outlet.city} • Managed by {outlet.manager}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-brand-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-700">
                      Monthly Budget
                    </p>
                    <p className="mt-2 text-lg font-semibold text-brand-800">
                      {formatCurrency(outlet.monthlyBudget)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Quick Actions
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">Move faster</h2>
          <div className="mt-6 grid gap-3">
            {[
              ["Create Bill", "/pos"],
              ["Catalog and stock", "/inventory"],
              ["Service master", "/services"],
              ["People and contracts", "/staff"],
              ["Payroll run", "/payroll"],
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
