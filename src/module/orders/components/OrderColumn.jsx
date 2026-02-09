import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import OrderCard from "./OrderCard";
import "./OrderCard.css";

export default function OrderColumn({
  status,
  orders = [],
  count = 0,
  onSelectOrder,
}) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="kot-column">
      <div className="kot-column-header">
        <span>{status}</span>
        <span className="kot-count">({count})</span>
      </div>

      <SortableContext
        items={orders.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        {orders.length === 0 && <div className="kot-empty">No orders</div>}

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => onSelectOrder(order)}
          />
        ))}
      </SortableContext>
    </div>
  );
}
