import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  createExpense,
  fetchBudgetSummary,
  fetchExpenses,
} from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

const initialExpenseForm = {
  itemName: "",
  qty: "",
  price: "",
  totalAmount: "",
  billNo: "",
};

export function ExpensesPage({ scope }) {
  const user = useAuthStore((state) => state.user);
  const scopedOutletId =
    scope === "global" && user?.role === "admin" ? undefined : user?.outlet_id;

  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initialExpenseForm);

  const loadExpensesPage = async () => {
    const [budgetSummary, expenseList] = await Promise.all([
      fetchBudgetSummary({ outletId: scopedOutletId }),
      fetchExpenses({ outletId: scopedOutletId }),
    ]);

    setBudget(budgetSummary);
    setExpenses(expenseList);
  };

  useEffect(() => {
    if (user) {
      loadExpensesPage();
    }
  }, [user, scope]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      const next = { ...current, [name]: value };
      const qty = Number(name === "qty" ? value : current.qty);
      const price = Number(name === "price" ? value : current.price);
      next.totalAmount = qty > 0 && price > 0 ? String(qty * price) : "";
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createExpense({
      ...form,
      outletId: scopedOutletId || user?.outlet_id || "outlet_hsr",
    });

    setForm(initialExpenseForm);
    loadExpensesPage();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Finance"
        title={scope === "global" ? "Expense Management" : "Local Expense Management"}
        description="Monitor budget runway, log exact expense entries, and keep this month’s running history visible to managers and admins."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Monthly Budget", budget ? formatCurrency(budget.totalMonthlyBudget) : "--"],
          ["Total Expenses So Far", budget ? formatCurrency(budget.totalExpensesSoFar) : "--"],
          ["Remaining Balance", budget ? formatCurrency(budget.remainingBalance) : "--"],
        ].map(([label, value]) => (
          <div key={label} className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Add Expense
          </p>
          {scope === "global" && user?.role === "admin" ? (
            <p className="mt-3 text-sm leading-7 text-slate-600">
              In mock mode, new expense entries from the admin screen are assigned to the demo
              HSR outlet while the widget still shows the rolled-up network view.
            </p>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label-text">Item Name</label>
              <input
                name="itemName"
                className="input-field"
                value={form.itemName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label-text">Qty</label>
              <input
                name="qty"
                type="number"
                className="input-field"
                value={form.qty}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label-text">Price</label>
              <input
                name="price"
                type="number"
                className="input-field"
                value={form.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label-text">Total Amount</label>
              <input
                name="totalAmount"
                className="input-field"
                value={form.totalAmount}
                readOnly
              />
            </div>
            <div>
              <label className="label-text">Bill No.</label>
              <input
                name="billNo"
                className="input-field"
                value={form.billNo}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Log Expense
            </button>
          </form>
        </div>

        <div className="table-shell">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-4">Item Name</th>
                <th className="px-4 py-4">Qty</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Total Amount</th>
                <th className="px-4 py-4">Bill No.</th>
              </tr>
            </thead>
            <tbody className="bg-white/90">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="table-cell font-semibold text-slate-900">{expense.itemName}</td>
                  <td className="table-cell">{expense.qty}</td>
                  <td className="table-cell">{formatCurrency(expense.price)}</td>
                  <td className="table-cell">{formatCurrency(expense.totalAmount)}</td>
                  <td className="table-cell">{expense.billNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
