export default function StaffDashboard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-8 relative z-10">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Staff Portal</h2>
        <p className="text-gray-500 mt-1">Welcome back, {user.first_name}!</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Your Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Staff ID</span>
            <span className="text-lg text-gray-900">{user.staff_id}</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Department ID</span>
            <span className="text-lg text-gray-900">{user.department_id}</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-gray-500 uppercase tracking-wide">First Name</span>
            <span className="text-lg text-gray-900">{user.first_name}</span>
          </div>
          <div>
            <span className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Last Name</span>
            <span className="text-lg text-gray-900">{user.last_name}</span>
          </div>
          <div className="md:col-span-2 mt-2">
            <span className="block text-sm font-bold text-gray-500 uppercase tracking-wide">Position / Title</span>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md font-semibold mt-1">
              {user.position || "Staff"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}