import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState, useMemo } from "react";
import "./OrderCard.css";

const STATUS_COLORS = {
  NEW: "#2563eb",
  PREPARING: "#f59e0b",
  READY: "#10b981",
  SERVED: "#6b7280",
};

export default function OrderCard({
  order,
  onClick,
  isOverlay = false,
  overlayStyle = {},
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: order.id,
      disabled: isOverlay,
    });

  const [time, setTime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(Math.floor((Date.now() - order.createdAt) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [order.createdAt]);

  const style = useMemo(
    () => ({
      background: "#fff",
      borderLeft: `5px solid ${STATUS_COLORS[order.status]}`,
      opacity: isDragging ? 0.9 : 1,
      ...overlayStyle,
    }),
    [overlayStyle, order.status, isDragging],
  );

  return (
    <div className="kot-card" ref={setNodeRef} style={style}>
      <div {...(!isOverlay ? { ...listeners, ...attributes } : {})}>
        <div className="kot-card-top">
          <strong>Table {order.table}</strong>
          <span className="kot-time">{time}s</span>
        </div>

        <div className="kot-items">
          {order.items.map((i, idx) => (
            <div key={idx} className="kot-item">
              <span
                className={`priority-dot ${
                  i.priority === "heigh"
                    ? "high"
                    : i.priority === "medium"
                      ? "medium"
                      : "low"
                }`}
              ></span>
              {i.name} ({i.priority})
            </div>
          ))}
        </div>
      </div>

      <button
        className="view-btn"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(order);
        }}
      >
        View
      </button>
    </div>
  );
}
