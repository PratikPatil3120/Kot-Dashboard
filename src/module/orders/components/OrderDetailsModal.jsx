import { Modal, Button } from "react-bootstrap";
import "./OrderModal.css";
import { useState } from "react";
import Loader from "../../../shared/components/Loader";
import { ORDER_STATUS } from "../../../shared/utils/constants";

const SLA_LIMIT = 120;

export default function OrderDetailsModal({ order, onClose, updateStatus }) {
  const [loading, setLoading] = useState(false); // loader state

  if (!order) return null;

  const createdTime = new Date(order.createdAt).toLocaleTimeString();
  const elapsedSeconds = Math.floor((Date.now() - order.createdAt) / 1000);
  const isOverdue = elapsedSeconds > SLA_LIMIT;
  const currentStep = ORDER_STATUS.indexOf(order.status);

  const handleStatusChange = async (status) => {
    setLoading(true); // show spinner
    await updateStatus(order.id, status); // assuming updateStatus can be async
    setLoading(false);
    onClose();
  };

  return (
    <Modal show onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>🍽️ Order -: {`Table ${order.table}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="dish-items">
          {order.items.map((item) => (
            <div key={item.id || item.name} className="dish-card">
              {item.name}
            </div>
          ))}
        </div>

        <div className="info-grid mt-1">
          <div>
            <span>Table</span>
            <strong>{order.table}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{order.status}</strong>
          </div>
          <div>
            <span>Order Time</span>
            <strong>{createdTime}</strong>
          </div>
          <div>
            <span>Elapsed</span>
            <strong className={isOverdue ? "sla-red" : ""}>
              {elapsedSeconds}s
            </strong>
          </div>
        </div>

        <div className="timeline">
          {ORDER_STATUS.map((s, i) => (
            <div
              key={s}
              className={`timeline-step ${i <= currentStep ? "active" : ""}`}
            >
              {s}
            </div>
          ))}
        </div>

        <p className="modal-desc">
          Freshly prepared order. Please prioritize based on SLA.
        </p>

        <div className="status-actions">
          {ORDER_STATUS.map((s) => (
            <Button
              key={s}
              variant={order.status === s ? "secondary" : "outline-primary"}
              disabled={order.status === s || loading} // disable when loading
              onClick={() => handleStatusChange(s)}
            >
              {loading ? <Loader /> : s} {/* show spinner when loading */}
            </Button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
