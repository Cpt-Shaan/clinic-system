import { useState, useEffect } from "react";
import API from "../api/api"; // Adjust path if necessary

export default function AppointmentHistory({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Automatically fetch appointments for the logged-in user when the page loads!
  useEffect(() => {
    if (user && user.id) {
      API.get(`/patient/${user.id}/appointments`)
        .then((res) => {
          setAppointments(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load history", err);
          setError("Could not load your appointment history at this time.");
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Appointment History</h2>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-gray-600 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your history...
        </div>
      ) : appointments.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-50 text-gray-600 p-6 rounded-lg text-center border border-gray-200">
          You have no past or upcoming appointments on record.
        </div>
      ) : (
        /* Data Table */
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <th className="p-4 font-semibold text-sm">Appointment ID</th>
                <th className="p-4 font-semibold text-sm">Date</th>
                <th className="p-4 font-semibold text-sm">Time Slot</th>
                <th className="p-4 font-semibold text-sm">Doctor ID</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.appointment_id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-800 font-medium">#{appt.appointment_id}</td>
                  <td className="p-4 text-gray-600">{appt.date}</td>
                  <td className="p-4 text-gray-600">{appt.slot}:00</td>
                  <td className="p-4 text-gray-600">{appt.doctor_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}