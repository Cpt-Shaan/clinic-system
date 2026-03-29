import { useState } from "react";
import API from "../api/api";

function RegisterPatient() {

  const [form, setForm] = useState({
    name:"",
    gender:"",
    date_of_birth:"",
    phone:"",
    email:"",
    address:""
  });

  const submit = async () => {

    await API.post("/patients/register", form);

    alert("Patient registered");
  };

  return (
    <div>
      <h2>Register Patient</h2>

      <input placeholder="Name"
      onChange={(e)=>setForm({...form,name:e.target.value})}/>

      <input placeholder="Gender"
      onChange={(e)=>setForm({...form,gender:e.target.value})}/>

      <input type="date"
      onChange={(e)=>setForm({...form,date_of_birth:e.target.value})}/>

      <input placeholder="Phone"
      onChange={(e)=>setForm({...form,phone:e.target.value})}/>

      <button onClick={submit}>Register</button>
    </div>
  );
}

export default RegisterPatient;