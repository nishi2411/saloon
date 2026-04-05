import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { fetchOutlets, fetchStaff, saveStaff } from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

const initialStaffForm = {
  name: "",
  phone: "",
  role: "",
  assignedOutletId: "",
  baseSalary: "",
  commissionSlab: "Tier 1",
  pfDeduction: "",
  taxType: "percentage",
  taxValue: "",
  contractFile: null,
};

export function StaffPage() {
  const user = useAuthStore((state) => state.user);
  const [staffMembers, setStaffMembers] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [form, setForm] = useState({
    ...initialStaffForm,
    assignedOutletId: user?.role === "admin" ? "" : user?.outlet_id || "",
  });

  const loadStaffPage = async () => {
    const [staffList, outletList] = await Promise.all([
      fetchStaff({ outletId: user?.role === "admin" ? undefined : user?.outlet_id }),
      fetchOutlets(),
    ]);

    setStaffMembers(staffList);
    setOutlets(outletList);
  };

  useEffect(() => {
    if (user) {
      loadStaffPage();
      setForm((current) => ({
        ...current,
        assignedOutletId: user.role === "admin" ? current.assignedOutletId : user.outlet_id || "",
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "contractFile" ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await saveStaff({
      ...form,
      contractFileName: form.contractFile?.name,
      assignedOutletId: form.assignedOutletId || user?.outlet_id || "outlet_hsr",
    });

    setForm({
      ...initialStaffForm,
      assignedOutletId: user?.role === "admin" ? "" : user?.outlet_id || "",
    });
    loadStaffPage();
  };

  return (
    <div>
      <PageHeader
        eyebrow="HR"
        title="Staff Management"
        description="Create and edit staff records with branch assignment, contract upload, and payroll-specific configuration in one form."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="table-shell">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-4">Staff Name</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Assigned Outlet</th>
                <th className="px-4 py-4">Base Salary</th>
                <th className="px-4 py-4">Profile</th>
              </tr>
            </thead>
            <tbody className="bg-white/90">
              {staffMembers.map((member) => (
                <tr key={member.id}>
                  <td className="table-cell font-semibold text-slate-900">{member.name}</td>
                  <td className="table-cell">{member.role}</td>
                  <td className="table-cell">{member.assignedOutletName}</td>
                  <td className="table-cell">{formatCurrency(member.baseSalary)}</td>
                  <td className="table-cell">
                    <Link to={`/staff/${member.id}`} className="text-sm font-semibold text-brand-700">
                      View profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Staff Form
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">Create or edit employee</h2>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="rounded-3xl border border-slate-100 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Basic Info</p>
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="label-text">Name</label>
                  <input
                    name="name"
                    className="input-field"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label-text">Phone</label>
                  <input
                    name="phone"
                    className="input-field"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label-text">Staff Role</label>
                  <input
                    name="role"
                    className="input-field"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Stylist, Therapist, Reception..."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Outlet Selection</p>
              <div className="mt-4">
                <label className="label-text">Assigned Outlet</label>
                <select
                  name="assignedOutletId"
                  className="select-field"
                  value={form.assignedOutletId}
                  onChange={handleChange}
                  disabled={user?.role !== "admin"}
                >
                  <option value="">Select outlet</option>
                  {outlets.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Contract Section</p>
              <div className="mt-4">
                <label className="label-text">Upload Digital Contract</label>
                <input
                  name="contractFile"
                  type="file"
                  className="input-field"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-900">Payroll Config</p>
              <div className="mt-4 grid gap-4">
                <div>
                  <label className="label-text">Base Salary</label>
                  <input
                    name="baseSalary"
                    type="number"
                    className="input-field"
                    value={form.baseSalary}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label-text">Commission Slab</label>
                  <select
                    name="commissionSlab"
                    className="select-field"
                    value={form.commissionSlab}
                    onChange={handleChange}
                  >
                    <option value="Tier 1">Tier 1</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3">Tier 3</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">EPF / PF Deduction</label>
                  <input
                    name="pfDeduction"
                    type="number"
                    className="input-field"
                    value={form.pfDeduction}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="label-text">Employee Tax</label>
                  <div className="flex gap-3">
                    <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      <input
                        type="radio"
                        name="taxType"
                        value="percentage"
                        checked={form.taxType === "percentage"}
                        onChange={handleChange}
                      />
                      Percentage %
                    </label>
                    <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      <input
                        type="radio"
                        name="taxType"
                        value="flat"
                        checked={form.taxType === "flat"}
                        onChange={handleChange}
                      />
                      Flat Amount
                    </label>
                  </div>
                  <input
                    name="taxValue"
                    type="number"
                    className="input-field mt-3"
                    value={form.taxValue}
                    onChange={handleChange}
                    placeholder={
                      form.taxType === "percentage" ? "Enter tax percentage" : "Enter flat tax amount"
                    }
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Save Staff Member
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
