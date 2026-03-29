import { useEffect, useState } from "react";
import API from "../api/api";
import { Bar } from "react-chartjs-2";

function BillingDashboard(){

  const [data,setData]=useState([]);

  useEffect(()=>{

    API.get("/billing/report").then(res=>{
      setData(res.data);
    });

  },[]);

  const chartData = {
    labels:data.map(d=>d.patient),
    datasets:[
      {
        label:"Billing Amount",
        data:data.map(d=>d.amount)
      }
    ]
  };

  return(
    <div>
      <h2>Billing Dashboard</h2>
      <Bar data={chartData}/>
    </div>
  );
}

export default BillingDashboard;