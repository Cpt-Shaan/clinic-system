import { useEffect, useState } from "react";
import API from "../api/api";

function BillingDashboard({ user }) {
  const [data, setData] = useState([]);

  // Fetch data only for this specific doctor
  const loadData = () => {
    API.get(`/billing/report/${user.id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error loading bills:", err));
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  // Handle typing in the table inputs
  const handleRowChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  // Send the updated data back to FastAPI
  const handleSave = async (bill) => {
    try {
      await API.put(`/billing/update/${bill.billing_id}`, {
        amount: Number(bill.amount),
        payment_status: bill.status,
        payment_mode: bill.payment_mode,
      });
      alert(`Successfully updated bill for ${bill.patient}`);
      loadData(); // Refresh the table to show updated data
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update billing");
    }
  };

  return (
    <div className="card">
      <h2>My Patients' Billing Report</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Amount ($)</th>
            <th>Status</th>
            <th>Mode</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d, i) => (
            <tr key={d.billing_id}>
              <td>{d.patient}</td>
              
              {/* Editable Amount Input */}
              <td>
                <input
                  type="number"
                  value={d.amount}
                  onChange={(e) => handleRowChange(i, "amount", e.target.value)}
                  style={{ width: "80px", padding: "5px" }}
                />
              </td>

              {/* Editable Status Dropdown */}
              <td>
                <select
                  value={d.status}
                  onChange={(e) => handleRowChange(i, "status", e.target.value)}
                  style={{ padding: "5px" }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>

              {/* Editable Mode Input */}
              <td>
                <input
                  type="text"
                  placeholder="Cash/Card"
                  value={d.payment_mode}
                  onChange={(e) => handleRowChange(i, "payment_mode", e.target.value)}
                  style={{ width: "90px", padding: "5px" }}
                />
              </td>

              {/* Save Button */}
              <td>
                <button onClick={() => handleSave(d)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillingDashboard;