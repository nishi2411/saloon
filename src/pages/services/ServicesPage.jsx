import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { createService, fetchInventory, fetchServices } from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

const createInitialLinkage = () => ({
  inventoryId: "",
  quantityUsed: 1,
});

const createInitialServiceForm = () => ({
  serviceName: "",
  price: "",
  duration: "",
  productLinkages: [createInitialLinkage()],
});

export function ServicesPage() {
  const user = useAuthStore((state) => state.user);
  const [services, setServices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState(createInitialServiceForm);

  const loadServicesPage = async () => {
    const [serviceList, inventoryList] = await Promise.all([
      fetchServices(),
      fetchInventory({ outletId: user?.role === "admin" ? undefined : user?.outlet_id }),
    ]);

    setServices(serviceList);
    setInventory(inventoryList);
  };

  useEffect(() => {
    if (user) {
      loadServicesPage();
    }
  }, [user]);

  const updateLinkage = (index, key, value) => {
    setForm((current) => ({
      ...current,
      productLinkages: current.productLinkages.map((linkage, linkageIndex) =>
        linkageIndex === index ? { ...linkage, [key]: value } : linkage,
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedLinkages = form.productLinkages.filter((linkage) => linkage.inventoryId);

    await createService({
      ...form,
      productLinkages: cleanedLinkages,
    });

    setForm(createInitialServiceForm());
    loadServicesPage();
  };

  const inventoryNameById = Object.fromEntries(
    inventory.map((item) => [item.id, item.itemName]),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Services"
        description="Build the salon menu and define which products get consumed per service so stock deduction will be backend-ready later."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="table-shell">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-4">Service Name</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Duration</th>
                <th className="px-4 py-4">Product Linkage</th>
              </tr>
            </thead>
            <tbody className="bg-white/90">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="table-cell font-semibold text-slate-900">{service.serviceName}</td>
                  <td className="table-cell">{formatCurrency(service.price)}</td>
                  <td className="table-cell">{service.duration} min</td>
                  <td className="table-cell">
                    {service.productLinkages.length
                      ? service.productLinkages
                          .map(
                            (linkage) =>
                              `${inventoryNameById[linkage.inventoryId] || linkage.inventoryId} x ${linkage.quantityUsed}`,
                          )
                          .join(", ")
                      : "No linked products"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Create Service
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">Service builder</h2>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="label-text">Service Name</label>
              <input
                className="input-field"
                value={form.serviceName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, serviceName: event.target.value }))
                }
                placeholder="Keratin smoothening, global color..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-text">Price</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
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
                    setForm((current) => ({ ...current, duration: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border border-brand-100 bg-brand-50/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Product Linkage Section</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Select inventory items and define the quantity consumed per service.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      productLinkages: [...current.productLinkages, createInitialLinkage()],
                    }))
                  }
                >
                  Add Product
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {form.productLinkages.map((linkage, index) => (
                  <div key={`${linkage.inventoryId}-${index}`} className="grid gap-3 md:grid-cols-[1fr_180px_90px]">
                    <select
                      className="select-field"
                      value={linkage.inventoryId}
                      onChange={(event) => updateLinkage(index, "inventoryId", event.target.value)}
                    >
                      <option value="">Select Inventory Item</option>
                      {inventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.itemName}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      className="input-field"
                      value={linkage.quantityUsed}
                      onChange={(event) => updateLinkage(index, "quantityUsed", event.target.value)}
                      placeholder="Quantity Used"
                    />
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          productLinkages:
                            current.productLinkages.length === 1
                              ? [createInitialLinkage()]
                              : current.productLinkages.filter((_, linkageIndex) => linkageIndex !== index),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Save Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
