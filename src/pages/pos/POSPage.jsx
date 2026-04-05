import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { checkoutBill, fetchCatalog, fetchStaff } from "../../services/mockApi";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/format";

const paymentMethods = ["Cash", "Card", "UPI"];

const createLineId = () => `line_${Math.random().toString(36).slice(2, 9)}`;

export function POSPage() {
  const user = useAuthStore((state) => state.user);
  const [catalog, setCatalog] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payloadPreview, setPayloadPreview] = useState(null);

  useEffect(() => {
    const loadPos = async () => {
      const [catalogItems, staffList] = await Promise.all([
        fetchCatalog({ outletId: user?.role === "admin" ? undefined : user?.outlet_id }),
        fetchStaff({ outletId: user?.role === "admin" ? undefined : user?.outlet_id }),
      ]);

      setCatalog(catalogItems);
      setStaffMembers(staffList);
    };

    if (user) {
      loadPos();
    }
  }, [user]);

  const addToCart = (item) => {
    setCart((current) => {
      if (item.type === "product") {
        const existing = current.find((line) => line.id === item.id && line.type === "product");
        if (existing) {
          return current.map((line) =>
            line.lineId === existing.lineId ? { ...line, quantity: line.quantity + 1 } : line,
          );
        }
      }

      return [
        ...current,
        {
          lineId: createLineId(),
          id: item.id,
          name: item.name,
          price: item.price,
          type: item.type,
          duration: item.duration,
          quantity: 1,
          staffId: "",
        },
      ];
    });
  };

  const updateLine = (lineId, key, value) => {
    setCart((current) =>
      current.map((line) => (line.lineId === lineId ? { ...line, [key]: value } : line)),
    );
  };

  const removeLine = (lineId) => {
    setCart((current) => current.filter((line) => line.lineId !== lineId));
  };

  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const hasUnassignedService = cart.some(
    (line) => line.type === "service" && !line.staffId,
  );
  const canCheckout = cart.length > 0 && paymentMethod && !hasUnassignedService;

  const handleCheckout = async () => {
    const payload = {
      customer,
      paymentMethod,
      outletId: user?.outlet_id || "all_outlets",
      subtotal,
      tax,
      total,
      lineItems: cart.map((line) => ({
        itemId: line.id,
        itemType: line.type,
        itemName: line.name,
        qty: line.quantity,
        price: line.price,
        staffAssigned: line.type === "service" ? line.staffId : null,
      })),
    };

    const result = await checkoutBill(payload);
    setPayloadPreview({
      billNumber: result.billNumber,
      payload,
    });
    setCart([]);
    setPaymentMethod("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="POS"
        title="Billing Screen"
        description="Add services and retail items into the cart, assign staff to every service line, and compile a checkout payload ready for backend posting."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                Catalog
              </p>
              <h2 className="mt-3 text-3xl text-slate-900">Service and product cards</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catalog.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => addToCart(item)}
                className="rounded-3xl border border-slate-100 bg-white/90 p-5 text-left transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <span
                  className={`badge ${
                    item.type === "service"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-moss-500/10 text-moss-600"
                  }`}
                >
                  {item.type === "service" ? "Service" : "Product"}
                </span>
                <h3 className="mt-4 text-2xl text-slate-900">{item.name}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  {item.type === "service"
                    ? `${item.duration} minutes`
                    : `${item.stock} units in stock`}
                </p>
                <p className="mt-5 text-lg font-semibold text-brand-700">
                  {formatCurrency(item.price)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Bill / Cart
          </p>
          <h2 className="mt-3 text-3xl text-slate-900">Checkout desk</h2>

          <div className="mt-6 grid gap-4">
            <input
              className="input-field"
              placeholder="Customer name"
              value={customer.name}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, name: event.target.value }))
              }
            />
            <input
              className="input-field"
              placeholder="Customer phone"
              value={customer.phone}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, phone: event.target.value }))
              }
            />
          </div>

          <div className="mt-6 space-y-4">
            {cart.length ? (
              cart.map((line) => (
                <div key={line.lineId} className="rounded-3xl border border-slate-100 bg-white/90 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{line.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {line.type === "service" ? "Service" : "Retail Product"} • Qty {line.quantity}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => removeLine(line.lineId)}
                    >
                      Remove
                    </button>
                  </div>

                  {line.type === "service" ? (
                    <div className="mt-4">
                      <label className="label-text">Select Staff</label>
                      <select
                        className="select-field"
                        value={line.staffId}
                        onChange={(event) => updateLine(line.lineId, "staffId", event.target.value)}
                      >
                        <option value="">Select Staff</option>
                        {staffMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <label className="label-text">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="input-field"
                        value={line.quantity}
                        onChange={(event) =>
                          updateLine(
                            line.lineId,
                            "quantity",
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                      />
                    </div>
                  )}

                  <p className="mt-4 text-sm font-semibold text-brand-700">
                    Line total: {formatCurrency(line.price * line.quantity)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm text-slate-600">
                Tap a service or product card to start the bill.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-100 bg-white/85 p-5">
            <p className="text-sm font-semibold text-slate-900">Checkout</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  className={
                    paymentMethod === method
                      ? "rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
                      : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                  }
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>

            {hasUnassignedService ? (
              <p className="mt-4 text-sm text-rose-600">
                Every service line-item must have a staff member assigned before checkout.
              </p>
            ) : null}

            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={handleCheckout}
              disabled={!canCheckout}
            >
              Complete Bill
            </button>
          </div>

          {payloadPreview ? (
            <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-950 p-5 text-slate-100">
              <p className="text-sm font-semibold">Mocked JSON payload • {payloadPreview.billNumber}</p>
              <pre className="mt-4 overflow-x-auto text-xs leading-6 text-slate-300">
                {JSON.stringify(payloadPreview.payload, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
