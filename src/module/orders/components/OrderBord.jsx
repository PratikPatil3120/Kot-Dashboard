import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { useOrdersStore } from "../orders.store";
import OrderColumn from "./OrderColumn";
import { useEffect, useMemo, useState } from "react";
import OrderCard from "./OrderCard";
import OrderDetailsModal from "./OrderDetailsModal";
import { playDragSound, playNewOrderSound } from "../../../shared/utils/sound";
import { ORDER_STATUS } from "../../../shared/utils/constants";

export default function OrderBoard({ orders: ordersProp }) {
  const orders = ordersProp || useOrdersStore((s) => s.orders);

  const addOrder = useOrdersStore((s) => s.addOrder);
  const updateStatus = useOrdersStore((s) => s.updateStatus);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const MENU_ITEMS = [
    { id: "i1", name: "Paneer Masala", priority: "high" },
    { id: "i2", name: "Butter Roti", priority: "medium" },
    { id: "i3", name: "Veg Biryani", priority: "low" },
    { id: "i4", name: "Masala Dosa", priority: "medium" },
    { id: "i5", name: "Fried Rice", priority: "medium" },
    { id: "i6", name: "Manchurian", priority: "high" },
  ];

  const getRandomItems = () => {
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...MENU_ITEMS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (orders.length === 0) {
      addOrder({
        id: Date.now().toString(),
        table: 1,
        items: getRandomItems(),
        status: "NEW",
        createdAt: Date.now(),
      });
      playNewOrderSound();
    }

    const interval = setInterval(() => {
      addOrder({
        id: Date.now().toString(),
        table: Math.ceil(Math.random() * 10),
        items: getRandomItems(),
        status: "NEW",
        createdAt: Date.now(),
      });
      playNewOrderSound();
    }, 60000);

    return () => clearInterval(interval);
  }, [addOrder, orders.length]);

  const counts = useMemo(() => {
    return ORDER_STATUS.reduce((acc, status) => {
      acc[status] = orders.filter((o) => o.status === status).length;
      return acc;
    }, {});
  }, [orders]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    if (!ORDER_STATUS.includes(over.id)) return;
    updateStatus(active.id, over.id);
    setActiveId(null);
    playDragSound();
  };

  const activeOrder = activeId ? orders.find((o) => o.id === activeId) : null;

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => setActiveId(active.id)}
      >
        <div className="kot-board">
          {ORDER_STATUS.map((status) => (
            <OrderColumn
              key={status}
              status={status}
              count={counts[status]}
              orders={orders
                .filter((o) => o.status === status)
                .slice()
                .reverse()} // new orders first
              onSelectOrder={setSelectedOrder}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeOrder ? <OrderCard order={activeOrder} dragOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        updateStatus={updateStatus}
      />
    </>
  );
}
