import { useState } from "react";
import API from "../api/api";
import DoctorList from "../components/DoctorList";

function BookAppointment(){

  const [doctor,setDoctor]=useState("");
  const [patient,setPatient]=useState("");
  const [date,setDate]=useState("");
  const [slot,setSlot]=useState("");

  const book = async () =>{

    await API.post("/appointments/book",{
      patient_id:patient,
      doctor_id:doctor,
      appointment_date:date,
      time_slot:slot
    });

    alert("Appointment booked");

  };

  return(

    <div>

      <h2>Book Appointment</h2>

      <input placeholder="Patient ID"
      onChange={(e)=>setPatient(e.target.value)}/>

      <DoctorList setDoctor={setDoctor}/>

      <input type="date"
      onChange={(e)=>setDate(e.target.value)}/>

      <input placeholder="Time Slot"
      onChange={(e)=>setSlot(e.target.value)}/>

      <button onClick={book}>Book</button>

    </div>

  );
}

export default BookAppointment;