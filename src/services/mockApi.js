import { slugFromName } from "../utils/format";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));
const currentMonth = "2026-04";

const createId = (prefix) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const commissionMap = {
  "Tier 1": 2500,
  "Tier 2": 4500,
  "Tier 3": 6500,
};

const outlets = [
  {
    id: "outlet_hsr",
    name: "HSR Layout",
    city: "Bengaluru",
    manager: "Meera Kapoor",
    monthlyBudget: 150000,
  },
  {
    id: "outlet_indiranagar",
    name: "Indiranagar",
    city: "Bengaluru",
    manager: "Aarav Nair",
    monthlyBudget: 135000,
  },
  {
    id: "outlet_banjara",
    name: "Banjara Hills",
    city: "Hyderabad",
    manager: "Sara Thomas",
    monthlyBudget: 165000,
  },
];

let inventoryItems = [
  {
    id: "inv_loreal_tube",
    itemName: "L'Oreal Color Tube",
    currentStock: 46,
    unitPrice: 580,
    outletId: "outlet_hsr",
  },
  {
    id: "inv_keratin_serum",
    itemName: "Keratin Repair Serum",
    currentStock: 24,
    unitPrice: 740,
    outletId: "outlet_hsr",
  },
  {
    id: "inv_shampoo",
    itemName: "Deep Nourish Shampoo",
    currentStock: 62,
    unitPrice: 320,
    outletId: "outlet_indiranagar",
  },
  {
    id: "inv_bleach",
    itemName: "Pro Bleach Powder",
    currentStock: 19,
    unitPrice: 890,
    outletId: "outlet_indiranagar",
  },
  {
    id: "inv_hair_spa",
    itemName: "Spa Cream Jar",
    currentStock: 33,
    unitPrice: 540,
    outletId: "outlet_banjara",
  },
];

let services = [
  {
    id: "svc_hair_color",
    serviceName: "Signature Hair Color",
    price: 3200,
    duration: 120,
    productLinkages: [
      { inventoryId: "inv_loreal_tube", quantityUsed: 1 },
      { inventoryId: "inv_keratin_serum", quantityUsed: 1 },
    ],
  },
  {
    id: "svc_hair_spa",
    serviceName: "Luxury Hair Spa",
    price: 1800,
    duration: 60,
    productLinkages: [{ inventoryId: "inv_hair_spa", quantityUsed: 1 }],
  },
  {
    id: "svc_beard_trim",
    serviceName: "Beard Sculpt",
    price: 650,
    duration: 25,
    productLinkages: [],
  },
];

let staffMembers = [
  {
    id: "staff_naina",
    name: "Naina Shah",
    phone: "+91 98765 40001",
    role: "Senior Stylist",
    assignedOutletId: "outlet_hsr",
    baseSalary: 32000,
    commissionSlab: "Tier 2",
    pfDeduction: 1800,
    taxType: "percentage",
    taxValue: 8,
    contractFileName: "naina-contract.pdf",
    advances: [],
  },
  {
    id: "staff_rohan",
    name: "Rohan Iyer",
    phone: "+91 98765 40002",
    role: "Color Specialist",
    assignedOutletId: "outlet_indiranagar",
    baseSalary: 36000,
    commissionSlab: "Tier 3",
    pfDeduction: 2200,
    taxType: "flat",
    taxValue: 2100,
    contractFileName: "rohan-contract.pdf",
    advances: [
      {
        id: "adv_rohan_1",
        totalAdvanceAmount: 18000,
        deductionStartMonth: "2026-05",
        duration: 6,
        emi: 3000,
      },
    ],
  },
  {
    id: "staff_sia",
    name: "Sia Fernandes",
    phone: "+91 98765 40003",
    role: "Reception Lead",
    assignedOutletId: "outlet_hsr",
    baseSalary: 24000,
    commissionSlab: "Tier 1",
    pfDeduction: 1400,
    taxType: "percentage",
    taxValue: 5,
    contractFileName: "sia-contract.pdf",
    advances: [],
  },
];

let expenses = [
  {
    id: "exp_1",
    itemName: "Towels",
    qty: 12,
    price: 180,
    totalAmount: 2160,
    billNo: "BL-2041",
    outletId: "outlet_hsr",
    monthKey: currentMonth,
    createdAt: "2026-04-02T10:00:00.000Z",
  },
  {
    id: "exp_2",
    itemName: "Coffee Pods",
    qty: 8,
    price: 450,
    totalAmount: 3600,
    billNo: "BL-2049",
    outletId: "outlet_hsr",
    monthKey: currentMonth,
    createdAt: "2026-04-03T09:30:00.000Z",
  },
  {
    id: "exp_3",
    itemName: "Cleaning Supplies",
    qty: 6,
    price: 500,
    totalAmount: 3000,
    billNo: "BL-1187",
    outletId: "outlet_indiranagar",
    monthKey: currentMonth,
    createdAt: "2026-04-03T13:00:00.000Z",
  },
];

const withOutletName = (record) => ({
  ...record,
  assignedOutletName:
    outlets.find((outlet) => outlet.id === record.assignedOutletId)?.name || "Unassigned",
});

const filterByOutlet = (records, outletId, key = "outletId") =>
  outletId ? records.filter((record) => record[key] === outletId) : records;

export const loginUser = async ({ email, password }) => {
  await delay(550);

  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const isAdmin = normalizedEmail.includes("admin");

  const role = isAdmin ? "admin" : "outlet_manager";
  const outletId = isAdmin ? null : "outlet_hsr";

  return clone({
    id: isAdmin ? "user_admin" : "user_manager",
    name: isAdmin ? "Glocoy Super Admin" : "HSR Outlet Manager",
    email: normalizedEmail,
    role,
    outlet_id: outletId,
  });
};

export const fetchOutlets = async () => {
  await delay();
  return clone(outlets);
};

export const fetchInventory = async ({ outletId } = {}) => {
  await delay();
  return clone(filterByOutlet(inventoryItems, outletId));
};

export const createProduct = async (payload) => {
  await delay();

  const product = {
    id: `inv_${slugFromName(payload.itemName) || createId("item")}`,
    itemName: payload.itemName,
    currentStock: Number(payload.currentStock),
    unitPrice: Number(payload.unitPrice),
    outletId: payload.outletId,
  };

  inventoryItems = [product, ...inventoryItems];
  return clone(product);
};

export const createPurchaseOrder = async (payload) => {
  await delay();

  inventoryItems = inventoryItems.map((item) =>
    item.id === payload.inventoryId
      ? { ...item, currentStock: item.currentStock + Number(payload.qty) }
      : item,
  );

  return clone({
    id: createId("po"),
    supplierName: payload.supplierName,
    inventoryId: payload.inventoryId,
    qty: Number(payload.qty),
    totalCost: Number(payload.totalCost),
  });
};

export const fetchServices = async () => {
  await delay();
  return clone(services);
};

export const createService = async (payload) => {
  await delay();

  const service = {
    id: `svc_${slugFromName(payload.serviceName) || createId("service")}`,
    serviceName: payload.serviceName,
    price: Number(payload.price),
    duration: Number(payload.duration),
    productLinkages: payload.productLinkages.map((linkage) => ({
      inventoryId: linkage.inventoryId,
      quantityUsed: Number(linkage.quantityUsed),
    })),
  };

  services = [service, ...services];
  return clone(service);
};

export const fetchStaff = async ({ outletId } = {}) => {
  await delay();
  return clone(filterByOutlet(staffMembers, outletId, "assignedOutletId").map(withOutletName));
};

export const saveStaff = async (payload) => {
  await delay();

  const staffRecord = {
    id: payload.id || `staff_${slugFromName(payload.name) || createId("member")}`,
    name: payload.name,
    phone: payload.phone,
    role: payload.role,
    assignedOutletId: payload.assignedOutletId,
    baseSalary: Number(payload.baseSalary),
    commissionSlab: payload.commissionSlab,
    pfDeduction: Number(payload.pfDeduction),
    taxType: payload.taxType,
    taxValue: Number(payload.taxValue),
    contractFileName:
      payload.contractFileName || payload.contractFile?.name || "pending-contract.pdf",
    advances: payload.advances || [],
  };

  const existingIndex = staffMembers.findIndex((member) => member.id === staffRecord.id);

  if (existingIndex >= 0) {
    staffMembers[existingIndex] = staffRecord;
  } else {
    staffMembers = [staffRecord, ...staffMembers];
  }

  return clone(withOutletName(staffRecord));
};

export const fetchStaffProfile = async (staffId) => {
  await delay();
  const staff = staffMembers.find((member) => member.id === staffId);

  if (!staff) {
    throw new Error("Staff member not found.");
  }

  return clone(withOutletName(staff));
};

export const grantAdvance = async (staffId, payload) => {
  await delay();

  const emi = Number(payload.totalAdvanceAmount) / Number(payload.duration || 1);

  staffMembers = staffMembers.map((member) =>
    member.id === staffId
      ? {
          ...member,
          advances: [
            ...member.advances,
            {
              id: createId("adv"),
              totalAdvanceAmount: Number(payload.totalAdvanceAmount),
              deductionStartMonth: payload.deductionStartMonth,
              duration: Number(payload.duration),
              emi: Number(emi.toFixed(2)),
            },
          ],
        }
      : member,
  );

  return fetchStaffProfile(staffId);
};

export const fetchExpenses = async ({ outletId } = {}) => {
  await delay();

  return clone(
    filterByOutlet(expenses, outletId)
      .filter((expense) => expense.monthKey === currentMonth)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
  );
};

export const createExpense = async (payload) => {
  await delay();

  const expense = {
    id: createId("exp"),
    itemName: payload.itemName,
    qty: Number(payload.qty),
    price: Number(payload.price),
    totalAmount: Number(payload.totalAmount),
    billNo: payload.billNo,
    outletId: payload.outletId,
    monthKey: currentMonth,
    createdAt: new Date().toISOString(),
  };

  expenses = [expense, ...expenses];
  return clone(expense);
};

export const fetchBudgetSummary = async ({ outletId } = {}) => {
  await delay();

  const selectedOutlets = outletId
    ? outlets.filter((outlet) => outlet.id === outletId)
    : outlets;
  const totalMonthlyBudget = selectedOutlets.reduce(
    (sum, outlet) => sum + outlet.monthlyBudget,
    0,
  );
  const totalExpensesSoFar = expenses
    .filter((expense) => expense.monthKey === currentMonth)
    .filter((expense) => !outletId || expense.outletId === outletId)
    .reduce((sum, expense) => sum + expense.totalAmount, 0);

  return clone({
    totalMonthlyBudget,
    totalExpensesSoFar,
    remainingBalance: totalMonthlyBudget - totalExpensesSoFar,
    monthKey: currentMonth,
  });
};

export const fetchCatalog = async ({ outletId } = {}) => {
  await delay();

  const products = filterByOutlet(inventoryItems, outletId).map((product) => ({
    id: product.id,
    type: "product",
    name: product.itemName,
    price: product.unitPrice,
    stock: product.currentStock,
  }));

  const serviceCards = services.map((service) => ({
    id: service.id,
    type: "service",
    name: service.serviceName,
    price: service.price,
    duration: service.duration,
  }));

  return clone([...serviceCards, ...products]);
};

export const checkoutBill = async (payload) => {
  await delay(500);

  return clone({
    success: true,
    billNumber: `GL-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    payload,
  });
};

export const generatePayrollPreview = async ({ outletId } = {}) => {
  await delay(450);

  const filteredStaff = filterByOutlet(staffMembers, outletId, "assignedOutletId");

  return clone(
    filteredStaff.map((staff) => {
      const commissions = commissionMap[staff.commissionSlab] || 0;
      const taxes =
        staff.taxType === "percentage"
          ? (staff.baseSalary * staff.taxValue) / 100
          : staff.taxValue;
      const advanceEmi = staff.advances.reduce((sum, advance) => sum + advance.emi, 0);
      const netPay =
        staff.baseSalary + commissions - taxes - staff.pfDeduction - advanceEmi;

      return {
        ...withOutletName(staff),
        commissions,
        taxes,
        advanceEmi,
        netPay,
      };
    }),
  );
};

export const fetchDashboardMetrics = async ({ role, outletId } = {}) => {
  await delay();

  const scopedStaff = filterByOutlet(staffMembers, outletId, "assignedOutletId");
  const scopedInventory = filterByOutlet(inventoryItems, outletId);
  const scopedExpenses = filterByOutlet(expenses, outletId);

  return clone({
    activeOutlets: role === "admin" ? outlets.length : 1,
    staffCount: scopedStaff.length,
    serviceCount: services.length,
    inventoryCount: scopedInventory.length,
    expenseCount: scopedExpenses.length,
    totalBudget:
      role === "admin"
        ? outlets.reduce((sum, outlet) => sum + outlet.monthlyBudget, 0)
        : outlets.find((outlet) => outlet.id === outletId)?.monthlyBudget || 0,
  });
};
