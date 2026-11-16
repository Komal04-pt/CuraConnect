import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllAppointments } from "../../redux/actions/appointmentAction";
import "./AllAppointments.css";

const AllAppointments = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(getAllAppointments({ page, limit }));
  }, [dispatch, page]);

  const { appointments, pagination } = useSelector((state) => state.appointments);
  const totalPages = pagination?.totalPages || 1;

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Visit Completed";
      case "no-show":
        return "No Show";
      case "cancelled":
        return "Cancelled";
      case "scheduled":
      default:
        return "Scheduled";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "no-show":
        return "status-noshow";
      case "cancelled":
        return "status-cancelled";
      case "scheduled":
      default:
        return "status-scheduled";
    }
  };

  return (
    <Layout>
      <div className="appointments-header">
        <div>
          <h2>All Appointments</h2>
          <p>{pagination?.totalCount ?? appointments?.length ?? 0} total bookings</p>
        </div>
      </div>

      <div className="appointments-table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((a, i) => (
              <tr key={a?._id || i}>
                <td>{(page - 1) * limit + i + 1}</td>
                <td className="text-muted small-id">{a?._id}</td>
                <td>{a?.slotDate}</td>
                <td>{a?.slotTime}</td>
                <td className="fw-semibold">₹{a?.amount}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(a?.visitStatus)}`}>
                    {getStatusLabel(a?.visitStatus)}
                  </span>
                </td>
                <td>
                  {a?.payment ? (
                    <span className="payment-badge payment-online">Paid Online</span>
                  ) : (
                    <span className="payment-badge payment-cash">Pay at Hospital</span>
                  )}
                </td>
                <td>
                  <Link to={`/appointment-details/${a?._id}`} className="details-link">
                    View Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 my-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Prev
        </button>
        <span className="small">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </Layout>
  );
};

export default AllAppointments;