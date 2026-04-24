import { useState } from "react";

export default function Login({ setUser, onSwitchToRegister }) {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError(""); // Clear any previous errors

    if (!role || !id) {
      setError("Please select a role and enter your ID.");
      return;
    }

    try {
      if (role === "patient") {
        const response = await fetch(`http://localhost:8000/patient/${id}`);
        if (!response.ok) {
          throw new Error("Patient not found. Please check your ID or register.");
        }
        const userData = await response.json();
        setUser({ ...userData, role: "patient", id: id });

      } else if (role === "staff") {
        const response = await fetch(`http://localhost:8000/staff/${id}`);
        if (!response.ok) {
          throw new Error("Staff member not found. Please check your ID.");
        }
        const userData = await response.json();
        setUser({ ...userData, role: "staff", id: id });

      } else if (role === "doctor") {
        const response = await fetch(`http://localhost:8000/doctor/${id}`);
        
        if (!response.ok) {
          throw new Error("Doctor not found. Please check your ID.");
        }
        
        const userData = await response.json();
        
        // userData now contains { id, first_name, last_name, specialization, isHead }
        // We spread it (...) to make sure 'isHead' is passed to the user state!
        setUser({ ...userData, role: "doctor" }); 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Reusable Tailwind classes for bright, clean styling
  const inputClass = "w-full border border-gray-300 rounded p-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm relative z-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className={labelClass}>Select Role</label>
        <select 
          className={inputClass} 
          onChange={(e) => setRole(e.target.value)}
          value={role}
        >
          <option value="" disabled>Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* ID Input */}
      <div>
        <label className={labelClass}>User ID</label>
        <input 
          type="text"
          placeholder="Enter your ID" 
          className={inputClass}
          onChange={(e) => setId(e.target.value)} 
          value={id}
        />
      </div>

      {/* Login Button */}
      <button 
        onClick={login}
        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition mt-2"
      >
        Login
      </button>

      {/* Registration Toggle */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button 
          type="button" 
          onClick={onSwitchToRegister} 
          className="text-green-600 font-semibold hover:underline"
        >
          Register here
        </button>
      </div>
    </div>
  );
}