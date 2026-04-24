import { useState, useEffect } from "react";
import API from "../api/api";

function CreatePrescription({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState("");
  
  // Array to hold the dynamic list of medications from the DB
  const [availableMedications, setAvailableMedications] = useState([]);

  // Array to hold multiple medications chosen by the doctor
  const [medicationsList, setMedicationsList] = useState([]);

  // Form states for a single medication
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    // 1. Fetch Appointments
    API.get(`/doctor/${user.id}/appointments`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to load appointments", err));

    // 2. Fetch Dynamic Medication List
    API.get("/medications")
      .then((res) => setAvailableMedications(res.data))
      .catch((err) => console.error("Failed to load medications", err));
  }, [user.id]);

  // Function to add a single med to our local array
  const handleAddMedication = (e) => {
    e.preventDefault(); 
    
    if (!medication || !dosage || !frequency || !duration) {
      alert("Please fill out all medication details first.");
      return;
    }

    const newMed = {
      medication_name: medication,
      dosage: dosage,
      frequency: Number(frequency),
      duration_days: Number(duration)
    };

    setMedicationsList([...medicationsList, newMed]);

    // Clear the input fields so they can add another
    setMedication("");
    setDosage("");
    setFrequency("");
    setDuration("");
  };

  // Function to send the final array to FastAPI
  const submitFinalPrescription = async () => {
    if (!selectedAppt) {
      alert("Please select an appointment.");
      return;
    }
    if (medicationsList.length === 0) {
      alert("Please add at least one medication to the list.");
      return;
    }

    try {
      await API.post("/prescriptions/create", {
        appointment_id: Number(selectedAppt),
        doctor_id: Number(user.id),
        medications: medicationsList // Sending the whole array!
      });
      
      alert(`Success! Saved ${medicationsList.length} medications.`);
      
      // Reset everything
      setSelectedAppt("");
      setMedicationsList([]);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create prescription");
    }
  };

  return (
    <div className="card">
      <h2>Issue New Prescription</h2>
      
      {/* 1. Appointment Selection */}
      <select 
        value={selectedAppt} 
        onChange={(e) => setSelectedAppt(e.target.value)}
        style={{ marginBottom: "20px", width: "100%", padding: "8px" }}
      >
        <option value="">-- Select an Appointment --</option>
        {appointments.map((a) => (
          <option key={a.appointment_id} value={a.appointment_id}>
            Appt #{a.appointment_id} - Patient {a.patient_id} ({a.date} at {a.slot}:00)
          </option>
        ))}
      </select>

      <hr />
      
      {/* 2. Add Medication Form */}
      <h3>Add Medications</h3>
      <form onSubmit={handleAddMedication} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        
        {/* DYNAMIC DROPDOWN HERE */}
        <select value={medication} onChange={(e) => setMedication(e.target.value)} style={{flex: 1, padding: "8px"}}>
          <option value="">-- Select Drug --</option>
          {availableMedications.map((med) => (
            <option key={med.medication_id} value={med.medication_name}>
              {med.medication_name}
            </option>
          ))}
        </select>

        <input type="text" placeholder="Dosage (e.g., 500mg)" value={dosage} onChange={(e) => setDosage(e.target.value)} style={{width: "140px", padding: "8px"}}/>
        <input type="number" min="1" placeholder="Freq/Day" value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{width: "100px", padding: "8px"}}/>
        <input type="number" min="1" placeholder="Days" value={duration} onChange={(e) => setDuration(e.target.value)} style={{width: "100px", padding: "8px"}}/>
        
        <button type="submit" style={{ backgroundColor: "#2ecc71", padding: "8px 16px", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          + Add
        </button>
      </form>

      {/* 3. Display the List of Added Medications */}
      {medicationsList.length > 0 && (
        <div style={{ marginTop: "20px", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
          <h4>Medications to be prescribed:</h4>
          <ul style={{ paddingLeft: "20px" }}>
            {medicationsList.map((m, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                <strong>{m.medication_name}</strong> - {m.dosage} ({m.frequency}x/day for {m.duration_days} days)
              </li>
            ))}
          </ul>
          
          <button onClick={submitFinalPrescription} style={{ width: "100%", marginTop: "15px", padding: "10px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
            Submit Entire Prescription
          </button>
        </div>
      )}

    </div>
  );
}

export default CreatePrescription;