import { useState } from "react";
import API from "../api/api";

export default function AddStaff() {
  const [formData, setFormData] = useState({
    staff_id: "", first_name: "", last_name: "", position: "", department_id: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/staff/add", formData);
      setMessage({ type: "success", text: "Staff member added successfully!" });
      setFormData({ staff_id: "", first_name: "", last_name: "", position: "", department_id: "" });
    } catch (err) {
      setMessage({ type: "error", text: "Error adding staff member." });
    }
  };

  const inputClass = "w-full border border-gray-300 rounded p-2 bg-white text-gray-900 mb-4 focus:ring-2 focus:ring-orange-500 outline-none";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto mt-8 relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-orange-800 border-b pb-2">Register New Staff</h2>
      {message.text && (
        <div className={`p-3 rounded mb-4 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Staff ID" className={inputClass} value={formData.staff_id} onChange={(e) => setFormData({...formData, staff_id: e.target.value})} required />
        <div className="flex gap-2">
          <input type="text" placeholder="First Name" className={inputClass} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
          <input type="text" placeholder="Last Name" className={inputClass} value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
        </div>
        <input type="text" placeholder="Position (e.g. Nurse, Admin)" className={inputClass} value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
        <input type="number" placeholder="Department ID" className={inputClass} value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})} required />
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700 transition">Add Staff Member</button>
      </form>
    </div>
  );
}