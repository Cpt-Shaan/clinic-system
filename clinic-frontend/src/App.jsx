import {BrowserRouter,Routes,Route} from "react-router-dom";

import Navbar from "./components/Navbar";
import RegisterPatient from "./pages/RegisterPatient";
import BookAppointment from "./pages/BookAppointment";
import BillingDashboard from "./pages/BillingDashboard";
import AppointmentHistory from "./pages/AppointmentHistory";
import PrescriptionView from "./pages/PrescriptionView";

function App(){

  return(

    <BrowserRouter>

      <Navbar/>

      <Routes>

        <Route path="/" element={<RegisterPatient/>}/>
        <Route path="/appointment" element={<BookAppointment/>}/>
        <Route path="/billing" element={<BillingDashboard/>}/>
        <Route path="/history" element={<AppointmentHistory/>}/>
        <Route path="/prescription" element={<PrescriptionView/>}/>

      </Routes>

    </BrowserRouter>

  );
}

export default App;