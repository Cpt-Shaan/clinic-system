import { useState } from "react";
import API from "../api/api";
import DoctorList from "../components/DoctorList";

function BookAppointment({ user }) {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!doctor) return alert("Please select a doctor!");

    const formattedDate = new Date(date).toISOString().split("T")[0];

    try {
      await API.post("/appointments/book", {
        patient_id: Number(user.id),
        doctor_id: Number(doctor),
        appointment_date: formattedDate,
        time_slot: Number(slot)
      });
      alert("Appointment booked successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "Error booking appointment.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-themeCard p-8 rounded-2xl shadow-2xl border border-themeBorder">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-2 h-8 bg-themeYellow rounded-full"></span>
        Book Appointment
      </h2>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Select Doctor</label>
          <DoctorList setDoctor={setDoctor} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Appointment Date</label>
          <input type="date" required onChange={(e) => setDate(e.target.value)} className="w-full" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-400">Hour Slot (0-23)</label>
          <input type="number" min="0" max="23" placeholder="e.g., 14 for 2:00 PM" required onChange={(e) => setSlot(e.target.value)} className="w-full" />
        </div>

        <button 
          type="submit"
          className="mt-4 p-4 bg-themeYellow text-themeBg text-lg font-bold rounded-lg hover:bg-themeYellowHover transition-all shadow-[0_4px_14px_rgba(234,179,8,0.3)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)]"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;