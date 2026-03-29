import { useEffect, useState } from "react";
import API from "../api/api";

function DoctorList({setDoctor}) {

  const [doctors,setDoctors]=useState([]);

  useEffect(()=>{

    API.get("/doctors").then(res=>{
      setDoctors(res.data);
    });

  },[]);

  return (

    <select onChange={(e)=>setDoctor(e.target.value)}>

      <option>Select Doctor</option>

      {doctors.map(d=>(
        <option key={d.doctor_id} value={d.doctor_id}>
          {d.name} ({d.specialization})
        </option>
      ))}

    </select>

  );
}

export default DoctorList;