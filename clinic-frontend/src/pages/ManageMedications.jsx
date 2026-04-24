import { useState, useEffect } from "react";
import API from "../api/api";

export default function ManageMedications() {
  const [meds, setMeds] = useState([]);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });

  const fetchMeds = () => {
    API.get("/medications")
      .then((res) => setMeds(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchMeds(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName) return;

    try {
      await API.post("/medications/add", { name: newName });
      setStatus({ type: "success", msg: `Added ${newName} successfully!` });
      setNewName("");
      fetchMeds(); // Refresh the list
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to add medication." });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-8 relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Medicine Inventory</h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter New Medication Name"
          className="flex-grow border border-gray-300 rounded p-2 bg-white text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded font-bold hover:bg-green-600 transition">
          + Add to List
        </button>
      </form>

      {status.msg && (
        <div className={`p-3 rounded mb-4 text-sm ${status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status.msg}
        </div>
      )}

      {/* Current List Table */}
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3 text-sm font-bold text-gray-600">ID</th>
              <th className="p-3 text-sm font-bold text-gray-600">Medication Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {meds.map((m) => (
              <tr key={m.medication_id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">#{m.medication_id}</td>
                <td className="p-3 text-gray-800 font-medium">{m.medication_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}