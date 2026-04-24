import { useState } from "react";
import API from "../api/api";

export default function AddDoctor() {
  const [formData, setFormData] = useState({
    doctor_id: "", 
    first_name: "", 
    last_name: "", 
    specialization: "", 
    phone: "",
    department_id: "" // <--- Added state
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure IDs are numbers to match the backend 'int' requirement
      const payload = {
        ...formData,
        doctor_id: parseInt(formData.doctor_id),
        department_id: parseInt(formData.department_id)
      };

      await API.post("/doctor/add", payload);
      setMessage({ type: "success", text: "Doctor added successfully!" });
      
      // Reset form
      setFormData({ 
        doctor_id: "", first_name: "", last_name: "", 
        specialization: "", phone: "", department_id: "" 
      });
    } catch (err) {
      console.error(err.response?.data);
      setMessage({ type: "error", text: "Error adding doctor. Ensure all fields are valid." });
    }
  };

  const inputClass = "w-full border border-gray-300 rounded p-2 bg-white text-gray-900 mb-4 focus:ring-2 focus:ring-red-500 outline-none";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto mt-8 relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-red-800 border-b pb-2">Register New Doctor</h2>
      
      {message.text && (
        <div className={`p-3 rounded mb-4 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
            <input type="number" placeholder="Doctor ID" className={inputClass} value={formData.doctor_id} onChange={(e) => setFormData({...formData, doctor_id: e.target.value})} required />
            <input type="number" placeholder="Dept ID" className={inputClass} value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})} required />
        </div>
        
        <div className="flex gap-2">
          <input type="text" placeholder="First Name" className={inputClass} value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
          <input type="text" placeholder="Last Name" className={inputClass} value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
        </div>
        
        <input type="text" placeholder="Specialization" className={inputClass} value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
        <input type="text" placeholder="Phone Number" className={inputClass} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
        
        <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition shadow-lg">
            Add Doctor
        </button>
      </form>
    </div>
  );
}