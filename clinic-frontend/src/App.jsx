import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StaffDashboard from "./pages/StaffDashboard";
import BookAppointment from "./pages/BookAppointment";
import AppointmentHistory from "./pages/AppointmentHistory";
import BillingDashboard from "./pages/BillingDashboard";
import PrescriptionView from "./pages/PrescriptionView";
import DoctorAppointments from "./pages/DoctorAppointments";
import CreatePrescription from "./pages/CreatePrescription";
import ManageMedications from "./pages/ManageMedications";
import AddDoctor from "./pages/AddDoctor";
import AddStaff from "./pages/AddStaff";
import ChangeDeptDetails from "./pages/ChangeDeptDetails";

// Doctor Dashboard Component 
function DoctorDashboard({ user }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl mx-auto mt-8 relative z-10">
      <div className="text-center mb-8 border-b border-gray-100 pb-4">
        {/* Changed text color to gray-800 for visibility */}
        <h2 className="text-3xl font-bold text-gray-800">
          {user.isHead ? "Chief of Department Portal" : "Physician Portal"}
        </h2>
        <p className="text-gray-500 mt-2 font-medium">Welcome, Dr. {user.first_name}.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Schedule - Using deep blue text */}
        <Link to="/doctor-appointments" className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition flex flex-col items-center group">
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform"></span>
            <h3 className="font-bold text-blue-900 text-lg">Schedule</h3>
            <p className="text-xs text-blue-700 mt-1">View Appointments</p>
        </Link>

        {/* Issue Rx - Using deep green text */}
        <Link to="/create-prescription" className="p-6 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition flex flex-col items-center group">
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform"></span>
            <h3 className="font-bold text-green-900 text-lg">Issue Rx</h3>
            <p className="text-xs text-green-700 mt-1">Write Prescriptions</p>
        </Link>

        {/* Inventory - Using deep purple text */}
        <Link to="/manage-meds" className="p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition flex flex-col items-center group">
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform"></span>
            <h3 className="font-bold text-purple-900 text-lg">Inventory</h3>
            <p className="text-xs text-purple-700 mt-1">Manage Medicines</p>
        </Link>

        {/* --- ADMIN ONLY TOOLS (Visible for Head Doctor) --- */}
        {user.isHead && (
          <>
            {/* Add Doctor - Using deep red text */}
            <Link to="/add-doctor" className="p-6 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition flex flex-col items-center group">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform"></span>
                <h3 className="font-bold text-red-900 text-lg">Add Doctor</h3>
                <p className="text-xs text-red-700 mt-1">Register Faculty</p>
            </Link>
            
            {/* Add Staff - Using deep orange text */}
            <Link to="/add-staff" className="p-6 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition flex flex-col items-center group">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform"></span>
                <h3 className="font-bold text-orange-900 text-lg">Add Staff</h3>
                <p className="text-xs text-orange-700 mt-1">Register Personnel</p>
            </Link>

            {/* Dept Info - Using deep gray/slate text */}
            <Link to="/dept-settings" className="p-6 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition flex flex-col items-center group">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform"></span>
                <h3 className="font-bold text-slate-900 text-lg">Dept Info</h3>
                <p className="text-xs text-slate-700 mt-1">Manage Settings</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
function AnimatedRoutes({ user, setUser }) {
  const location = useLocation();

  return (
    <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-10 animate-fade-up">
      <Routes location={location}>
        {/* Main Dashboard Route */}
        <Route path="/" element={
            user.role === "staff" ? <StaffDashboard user={user} /> :
            user.role === "doctor" ? <DoctorDashboard user={user} /> :
            <Dashboard user={user} setUser={setUser} />
        } />

        {/* PATIENT PROTECTED ROUTES */}
        {user.role === "patient" && (
          <>
            <Route path="/book" element={<BookAppointment user={user} />} />
            <Route path="/history" element={<AppointmentHistory user={user} />} />
            <Route path="/prescription" element={<PrescriptionView user={user} />} />
          </>
        )}

        {/* DOCTOR PROTECTED ROUTES */}
        {user.role === "doctor" && (
          <>
            <Route path="/doctor-appointments" element={<DoctorAppointments user={user} />} />
            <Route path="/create-prescription" element={<CreatePrescription user={user} />} />
            <Route path="/billing-report" element={<BillingDashboard user={user} />} />
            <Route path="/manage-meds" element={<ManageMedications />} />
            {user.isHead && (
              <>
                <Route path="/add-doctor" element={<AddDoctor />} />
                <Route path="/add-staff" element={<AddStaff />} />
                <Route path="/dept-settings" element={<ChangeDeptDetails user={user} />} />
              </>
            )}
          </>
        )}

        {/* STAFF PROTECTED ROUTES */}
        {user.role === "staff" && (
          <>
            {/* Add any specific staff routes here if needed */}
          </>
        )}

        {/* THE FIX: Redirect any unknown or unauthorized route back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("tc_user");
    if (saved) { 
      try { 
        setUser(JSON.parse(saved)); 
      } catch (e) { 
        sessionStorage.removeItem("tc_user"); 
      } 
    }
  }, []);

  const handleSetUser = (u) => {
    setUser(u);
    if (u) sessionStorage.setItem("tc_user", JSON.stringify(u));
    else sessionStorage.removeItem("tc_user");
  };

  return (
    <BrowserRouter>
      {!user ? (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
          {isLoginView ? 
            <Login setUser={handleSetUser} onSwitchToRegister={() => setIsLoginView(false)} /> : 
            <Register onSwitchToLogin={() => setIsLoginView(true)} />
          }
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar role={user.role} user={user} onLogout={() => handleSetUser(null)} />
          <AnimatedRoutes user={user} setUser={handleSetUser} />
          <footer className="mt-auto py-5 text-center text-xs text-gray-400 border-t border-gray-100">
            © {new Date().getFullYear()} TrinityClinic · Secure Medical Portal
          </footer>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;