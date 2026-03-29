import { useState } from "react";
import API from "../api/api";
import "../styles.css";

function PrescriptionView(){

  const [appointmentId,setAppointmentId]=useState("");
  const [data,setData]=useState(null);

  const loadPrescription = async () => {

    try{
      const res = await API.get(`/prescriptions/appointment/${appointmentId}`);
      setData(res.data);
    }
    catch(err){
      alert("Prescription not found");
    }

  };

  return(

    <div className="container">

      <h2>Prescription Details</h2>

      <div className="form-row">

        <input
          placeholder="Enter Appointment ID"
          value={appointmentId}
          onChange={(e)=>setAppointmentId(e.target.value)}
        />

        <button onClick={loadPrescription}>
          Load Prescription
        </button>

      </div>

      {data && (

        <table className="table">

          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
            </tr>
          </thead>

          <tbody>

            {data.medications.map((m,i)=>(
              <tr key={i}>
                <td>{m.medicine}</td>
                <td>{m.dosage}</td>
                <td>{m.frequency}</td>
                <td>{m.duration}</td>
              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>

  );
}

export default PrescriptionView;