import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { OutletDashboardPage } from "../pages/dashboard/OutletDashboardPage";
import { GlobalDashboardPage } from "../pages/dashboard/GlobalDashboardPage";
import { ExpensesPage } from "../pages/expenses/ExpensesPage";
import { InventoryPage } from "../pages/inventory/InventoryPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { OutletsPage } from "../pages/outlets/OutletsPage";
import { PayrollPage } from "../pages/payroll/PayrollPage";
import { POSPage } from "../pages/pos/POSPage";
import { ServicesPage } from "../pages/services/ServicesPage";
import { StaffPage } from "../pages/staff/StaffPage";
import { StaffProfilePage } from "../pages/staff/StaffProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { useAuthStore } from "../stores/authStore";
import { getDefaultRouteForRole } from "../utils/format";

function RoleHomeRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
}

function LoginRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <LoginPage />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <RoleHomeRedirect />,
          },
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "/dashboard/global",
                element: <GlobalDashboardPage />,
              },
              {
                path: "/outlets",
                element: <OutletsPage />,
              },
              {
                path: "/expenses",
                element: <ExpensesPage scope="global" />,
              },
            ],
          },
          {
            path: "/dashboard/outlet",
            element: <OutletDashboardPage />,
          },
          {
            path: "/inventory",
            element: <InventoryPage />,
          },
          {
            path: "/services",
            element: <ServicesPage />,
          },
          {
            path: "/staff",
            element: <StaffPage />,
          },
          {
            path: "/staff/:staffId",
            element: <StaffProfilePage />,
          },
          {
            path: "/pos",
            element: <POSPage />,
          },
          {
            path: "/expenses/local",
            element: <ExpensesPage scope="local" />,
          },
          {
            path: "/payroll",
            element: <PayrollPage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
