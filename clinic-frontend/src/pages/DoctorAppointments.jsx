import { useEffect, useState } from "react";
import API from "../api/api";

function DoctorAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch only this logged-in doctor's appointments
    API.get(`/doctor/${user.id}/appointments`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  }, [user.id]);

  return (
    <div className="card">
      <h2>My Appointment Schedule</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Appt ID</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Slot (Hour)</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.appointment_id}>
              <td>{a.appointment_id}</td>
              <td>{a.patient_id}</td>
              <td>{a.date}</td>
              <td>{a.slot}:00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorAppointments;