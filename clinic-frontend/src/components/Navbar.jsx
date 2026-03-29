import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Register Patient</Link>
      <Link to="/appointment">Book Appointment</Link>
      <Link to="/billing">Billing</Link>
      <Link to="/history">Appointments</Link>
      <Link to="/prescription">Prescriptions</Link>
    </nav>
  );
}

export default Navbar;