import { useOrdersStore } from "../orders/orders.store";

export default function KitchenAnalytics() {
  const orders = useOrdersStore((s) => s.orders);

  const pending = orders.filter((o) => o.status !== "SERVED").length;

  return (
    <div>
      <h2>Kitchen Analytics</h2>
      <p>Pending Orders: {pending}</p>
    </div>
  );
}
