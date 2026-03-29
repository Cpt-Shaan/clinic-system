import { useState } from "react";
import API from "../api/api";

function AppointmentHistory(){

  const [id,setId]=useState("");
  const [appointments,setAppointments]=useState([]);

  const load = async ()=>{

    const res = await API.get(`/appointments/patient/${id}`);

    setAppointments(res.data);

  };

  return(

    <div>

      <h2>Patient Appointment History</h2>

      <input placeholder="Patient ID"
      onChange={(e)=>setId(e.target.value)}/>

      <button onClick={load}>Load</button>

      <table>

        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

        {appointments.map(a=>(
          <tr key={a.appointment_id}>
            <td>{a.doctor}</td>
            <td>{a.date}</td>
            <td>{a.slot}</td>
            <td>{a.status}</td>
          </tr>
        ))}

        </tbody>

      </table>

    </div>

  );
}

export default AppointmentHistory;