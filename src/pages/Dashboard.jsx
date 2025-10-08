import React from "react";
import DashboardLayout from "../Components/DashboardLayout";


export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Bienvenu sur le dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded p-4">Total Books: 120</div>
        <div className="bg-white shadow rounded p-4">Total Loans: 75</div>
        <div className="bg-white shadow rounded p-4">Total Users: 50</div>
        <div className="bg-white shadow rounded p-4">Total Produits: 200</div>
      </div>
    </DashboardLayout>
  );
}
