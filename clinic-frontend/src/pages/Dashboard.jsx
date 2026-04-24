import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  // A safety check just in case the user prop hasn't loaded yet
  if (!user) return null; 

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl relative z-10 mx-auto mt-8">
      
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-green-600">Patient #{user.id}</span>
        </h2>
        <p className="text-gray-500 mt-2">What would you like to do today?</p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Book Appointment Card */}
        <Link 
          to="/book" 
          className="flex flex-col items-center justify-center p-8 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md group cursor-pointer"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform"></span>
          <h3 className="text-lg font-bold text-green-800">Book Appointment</h3>
          <p className="text-sm text-green-600 text-center mt-2">Schedule a new visit with a doctor</p>
        </Link>

        {/* Appointment History Card */}
        <Link 
          to="/history" 
          className="flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md group cursor-pointer"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform"></span>
          <h3 className="text-lg font-bold text-blue-800">Appointment History</h3>
          <p className="text-sm text-blue-600 text-center mt-2">View your past and upcoming visits</p>
        </Link>

        {/* Prescriptions Card */}
        <Link 
          to="/prescription" 
          className="flex flex-col items-center justify-center p-8 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md group cursor-pointer"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform"></span>
          <h3 className="text-lg font-bold text-purple-800">View Prescriptions</h3>
          <p className="text-sm text-purple-600 text-center mt-2">Check your medical prescriptions</p>
        </Link>

      </div>
    </div>
  );
}