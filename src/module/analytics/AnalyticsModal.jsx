import { useState, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOrdersStore } from "../orders/orders.store";
import "./AnalyticsModal.css";

export default function AnalyticsModal({ show, onClose }) {
  const orders = useOrdersStore((s) => s.orders);

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  // Filter orders by selected date
  const dateOrders = useMemo(() => {
    return orders.filter(
      (o) => new Date(o.createdAt).toISOString().slice(0, 10) === selectedDate,
    );
  }, [orders, selectedDate]);

  // Pending orders
  const pendingOrders = dateOrders.filter(
    (o) => o.status === "NEW" || o.status === "PREPARING",
  );

  // Average preparation time
  const avgPrepTime = useMemo(() => {
    const completed = dateOrders.filter(
      (o) => o.status === "READY" || o.status === "SERVED",
    );
    if (!completed.length) return 0;
    const totalTime = completed.reduce(
      (acc, o) => acc + ((o.updatedAt || Date.now()) - o.createdAt) / 1000,
      0,
    );
    return (totalTime / completed.length).toFixed(1);
  }, [dateOrders]);

  // Most ordered item
  const mostOrdered = useMemo(() => {
    const itemCount = {};
    dateOrders.forEach((o) =>
      o.items.forEach((i) => {
        if (!itemCount[i.name]) itemCount[i.name] = 0;
        itemCount[i.name]++;
      }),
    );
    const sorted = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : "-";
  }, [dateOrders]);

  // Chart data without COMPLETED
  const chartData = useMemo(() => {
    const counts = {};
    dateOrders.forEach((o) => (counts[o.status] = (counts[o.status] || 0) + 1));

    // Fixed order without COMPLETED
    const fixedOrder = ["SERVED", "READY", "PREPARING", "NEW"];

    return fixedOrder.map((status) => ({
      status,
      count: counts[status] || 0,
    }));
  }, [dateOrders]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Analytics Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="analytics-stats">
          <div className="stat-box pending">
            <h5>Pending Orders</h5>
            <p>{pendingOrders.length}</p>
          </div>
          <div className="stat-box avg-time">
            <h5>Avg Preparation Time (s)</h5>
            <p>{avgPrepTime}</p>
          </div>
          <div className="stat-box most-item">
            <h5>Most Ordered Item</h5>
            <p>{mostOrdered}</p>
          </div>
        </div>

        <div style={{ marginTop: "30px", height: "300px" }}>
          <h5>Orders Status</h5>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
