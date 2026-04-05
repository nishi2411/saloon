export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatRoleLabel = (role) =>
  role === "admin" ? "Super Admin" : "Outlet Manager";

export const getDefaultRouteForRole = (role) =>
  role === "admin" ? "/dashboard/global" : "/dashboard/outlet";

export const slugFromName = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
