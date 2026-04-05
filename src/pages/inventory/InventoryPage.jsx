import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  createProduct,
  createPurchaseOrder,
  fetchInventory,
  fetchOutlets,
} from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

const initialProductForm = {
  itemName: "",
  currentStock: "",
  unitPrice: "",
  outletId: "",
};

const initialPoForm = {
  supplierName: "",
  inventoryId: "",
  qty: 1,
  totalCost: "",
};

export function InventoryPage() {
  const user = useAuthStore((state) => state.user);
  const scopedOutletId = user?.role === "admin" ? "" : user?.outlet_id || "";

  const [inventory, setInventory] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    ...initialProductForm,
    outletId: scopedOutletId,
  });
  const [poForm, setPoForm] = useState(initialPoForm);

  const loadInventoryPage = async () => {
    const [inventoryItems, outletList] = await Promise.all([
      fetchInventory({ outletId: user?.role === "admin" ? undefined : user?.outlet_id }),
      fetchOutlets(),
    ]);

    setInventory(inventoryItems);
    setOutlets(outletList);
  };

  useEffect(() => {
    if (user) {
      loadInventoryPage();
    }
  }, [user]);

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    await createProduct({
      ...productForm,
      outletId: productForm.outletId || user?.outlet_id || "outlet_hsr",
    });

    setProductForm({ ...initialProductForm, outletId: scopedOutletId });
    setIsProductModalOpen(false);
    loadInventoryPage();
  };

  const handlePoChange = (event) => {
    const { name, value } = event.target;

    setPoForm((current) => {
      const next = { ...current, [name]: value };

      if (name === "inventoryId" || name === "qty") {
        const selectedItem = inventory.find(
          (item) => item.id === (name === "inventoryId" ? value : current.inventoryId),
        );
        const qtyValue = Number(name === "qty" ? value : current.qty);

        if (selectedItem && qtyValue > 0) {
          next.totalCost = String(selectedItem.unitPrice * qtyValue);
        } else {
          next.totalCost = "";
        }
      }

      return next;
    });
  };

  const handlePoSubmit = async (event) => {
    event.preventDefault();
    await createPurchaseOrder(poForm);
    setPoForm(initialPoForm);
    loadInventoryPage();
  };

  const outletNameById = Object.fromEntries(outlets.map((outlet) => [outlet.id, outlet.name]));

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Inventory"
        description="Track stock, open quick purchase orders, and prepare the product library that powers automatic deduction from services."
        action={
          <button type="button" className="btn-primary" onClick={() => setIsProductModalOpen(true)}>
            Create Product
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="table-shell">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-4">Item Name</th>
                {user?.role === "admin" ? <th className="px-4 py-4">Outlet</th> : null}
                <th className="px-4 py-4">Current Stock</th>
                <th className="px-4 py-4">Unit Price</th>
              </tr>
            </thead>
            <tbody className="bg-white/90">
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="table-cell font-semibold text-slate-900">{item.itemName}</td>
                  {user?.role === "admin" ? (
                    <td className="table-cell">{outletNameById[item.outletId] || "Outlet"}</td>
                  ) : null}
                  <td className="table-cell">{item.currentStock}</td>
                  <td className="table-cell">{formatCurrency(item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Purchase Order
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">Generate a quick PO</h2>

          <form className="mt-6 space-y-4" onSubmit={handlePoSubmit}>
            <div>
              <label className="label-text">Supplier Name</label>
              <input
                name="supplierName"
                className="input-field"
                value={poForm.supplierName}
                onChange={handlePoChange}
                placeholder="Supplier or brand partner"
              />
            </div>
            <div>
              <label className="label-text">Select Item</label>
              <select
                name="inventoryId"
                className="select-field"
                value={poForm.inventoryId}
                onChange={handlePoChange}
              >
                <option value="">Choose an inventory item</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Qty</label>
              <input
                name="qty"
                type="number"
                min="1"
                className="input-field"
                value={poForm.qty}
                onChange={handlePoChange}
              />
            </div>
            <div>
              <label className="label-text">Total Cost</label>
              <input
                name="totalCost"
                type="number"
                className="input-field"
                value={poForm.totalCost}
                onChange={handlePoChange}
                placeholder="Auto-calculated or editable"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Create PO
            </button>
          </form>
        </div>
      </div>

      {isProductModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="glass-panel w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                  New Product
                </p>
                <h2 className="mt-2 text-3xl text-slate-900">Create product</h2>
              </div>
              <button type="button" className="btn-ghost" onClick={() => setIsProductModalOpen(false)}>
                Close
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleProductSubmit}>
              <div>
                <label className="label-text">Item Name</label>
                <input
                  className="input-field"
                  value={productForm.itemName}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, itemName: event.target.value }))
                  }
                  placeholder="Retail or service consumption SKU"
                />
              </div>
              {user?.role === "admin" ? (
                <div>
                  <label className="label-text">Outlet</label>
                  <select
                    className="select-field"
                    value={productForm.outletId}
                    onChange={(event) =>
                      setProductForm((current) => ({ ...current, outletId: event.target.value }))
                    }
                  >
                    <option value="">Select outlet</option>
                    {outlets.map((outlet) => (
                      <option key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-text">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={productForm.currentStock}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        currentStock: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label-text">Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={productForm.unitPrice}
                    onChange={(event) =>
                      setProductForm((current) => ({
                        ...current,
                        unitPrice: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                Save Product
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
