import { createBrowserRouter } from "react-router-dom";
import OrdersPage from "../module/orders/OrdersPage";
import Login from "../module/auth/Login";
import ErrorBoundary from "../shared/components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
    errorElement: <ErrorBoundary />,
  },
]);
