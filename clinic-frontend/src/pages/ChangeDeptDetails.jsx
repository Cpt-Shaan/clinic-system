import { useState, useEffect } from "react";
import API from "../api/api";

export default function ChangeDeptDetails({ user }) {
  const [deptName, setDeptName] = useState("");
  const [deptId, setDeptId] = useState(""); // You might fetch this from the user's profile
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/department/update", { department_id: deptId, new_name: deptName });
      setMessage("Department updated successfully!");
    } catch (err) {
      setMessage("Error updating department.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto mt-8 relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Department Settings</h2>
      {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}
      <form onSubmit={handleUpdate}>
        <label className="block text-sm font-bold text-gray-700 mb-1">Department ID to Edit</label>
        <input type="number" className="w-full border border-gray-300 rounded p-2 mb-4" value={deptId} onChange={(e) => setDeptId(e.target.value)} required />
        
        <label className="block text-sm font-bold text-gray-700 mb-1">New Department Name</label>
        <input type="text" className="w-full border border-gray-300 rounded p-2 mb-6" value={deptName} onChange={(e) => setDeptName(e.target.value)} required />
        
        <button type="submit" className="w-full bg-gray-800 text-white font-bold py-2 rounded hover:bg-black transition">
          Update Department
        </button>
      </form>
    </div>
  ); 
}