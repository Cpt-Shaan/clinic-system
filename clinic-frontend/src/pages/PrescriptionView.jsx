import { useState, useEffect } from "react";
import API from "../api/api"; // Adjust this import path if needed!

export default function PrescriptionView({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState("");
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [error, setError] = useState("");

  // Fetch the patient's appointments as soon as the page loads
  useEffect(() => {
    if (user && user.id) {
      API.get(`/patient/${user.id}/appointments`)
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Failed to load appointments", err));
    }
  }, [user]);

  const loadPrescription = async () => {
    if (!selectedAppt) {
      setError("Please select an appointment first.");
      return;
    }
    
    setError("");
    setPrescriptionDetails(null);
    
    try {
      // NOTE: Ensure this matches your actual backend endpoint for fetching a single prescription
      const res = await API.get(`/prescriptions/${selectedAppt}`);
      setPrescriptionDetails(res.data);
    } catch (err) {
      setError("No prescription was found for this appointment, or it hasn't been issued yet.");
    }
  };

  // Clean Tailwind styles to override the dark mode CSS
  const selectClass = "w-full border border-gray-300 rounded p-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Prescription Details</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Appointment
        </label>
        <div className="flex gap-4">
          <select 
            value={selectedAppt}
            onChange={(e) => setSelectedAppt(e.target.value)}
            className={selectClass}
          >
            <option value="">-- Choose an Appointment --</option>
            {appointments.map(appt => (
              <option key={appt.appointment_id} value={appt.appointment_id}>
                Appt #{appt.appointment_id} - {appt.date} (Slot: {appt.slot}:00)
              </option>
            ))}
          </select>
          
          <button 
            onClick={loadPrescription}
            className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition shrink-0"
          >
            Load
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-4 text-sm border border-yellow-200">
          {error}
        </div>
      )}
      
      {/* Prescription Display Area */}
      {prescriptionDetails && (
        <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-gray-50 text-gray-800">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Medical Prescription</h3>
          
          {/* This simply prints the raw JSON data for now so you can see it working. 
              You can map over this data later to make it look like a real medical document! */}
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(prescriptionDetails, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}