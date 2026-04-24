import { useState } from "react";

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    patient_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ensure data types match backend expectations
    const payload = {
      ...formData,
      patient_id: parseInt(formData.patient_id, 10)
    };

    try {
      const response = await fetch("http://localhost:8000/patient/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Registration failed");
      }

      setSuccess("Registration successful! You can now log in.");
      // Automatically switch to login after 2 seconds
      setTimeout(onSwitchToLogin, 2000); 

    } catch (err) {
      setError(err.message);
    }
  };

  // Reusable Tailwind classes to enforce white backgrounds, dark text, and green focus rings
  const inputClass = "w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Patient Registration</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient ID */}
        <div>
          <label className={labelClass}>Patient ID</label>
          <input 
            type="number" 
            name="patient_id" 
            required 
            value={formData.patient_id} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="e.g. 101" 
          />
        </div>

        {/* Name Fields */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className={labelClass}>First Name</label>
            <input 
              type="text" 
              name="first_name" 
              required 
              value={formData.first_name} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="John" 
            />
          </div>
          <div className="w-1/2">
            <label className={labelClass}>Last Name</label>
            <input 
              type="text" 
              name="last_name" 
              required 
              value={formData.last_name} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Doe" 
            />
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label className={labelClass}>Email</label>
          <input 
            type="email" 
            name="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="john.doe@example.com" 
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            value={formData.phone} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="123-456-7890" 
          />
        </div>

        {/* Address & DOB */}
        <div>
          <label className={labelClass}>Address</label>
          <input 
            type="text" 
            name="address" 
            required 
            value={formData.address} 
            onChange={handleChange} 
            className={inputClass} 
            placeholder="123 Main St, City" 
          />
        </div>
        <div>
          <label className={labelClass}>Date of Birth</label>
          <input 
            type="date" 
            name="date_of_birth" 
            required 
            value={formData.date_of_birth} 
            onChange={handleChange} 
            className={inputClass} 
          />
        </div>

        <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition mt-2">
          Register
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className="text-green-600 font-semibold hover:underline">
          Log in here
        </button>
      </div>
    </div>
  );
}