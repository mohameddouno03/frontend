import React, { useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // sidebar ouvert par défaut

  const menuItems = [
    { label: "Dashboard", icon: "pi pi-home", path: "/dashboard" },
    { label: "Books", icon: "pi pi-book", path: "/books" },
    { label: "Loans", icon: "pi pi-calendar-plus", path: "/loans" },
    { label: "Users", icon: "pi pi-users", path: "/users" },
    { label: "Produits", icon: "pi pi-tags", path: "/produits" },
    { label: "Settings", icon: "pi pi-cog", path: "/settings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-48 h-screen bg-gray-100 shadow-lg flex flex-col justify-between transition-width duration-300">
          <div>
            <div className="p-4 text-xl font-bold text-blue-600">Your Logo</div>
            <ul className="list-none p-0 m-0">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors rounded"
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                    <Ripple />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex align-items-center gap-2 p-3 cursor-pointer hover:bg-gray-200 rounded">
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              shape="circle"
            />
            <span className="font-bold">Amy Elsner</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white shadow-sm">
          <Button
            icon="pi pi-bars"
            className="p-button-rounded p-button-text"
            onClick={() => setSidebarOpen(!sidebarOpen)} // même bouton ouvre/ferme
          />
          <div className="flex items-center gap-4">
            <span>Bienvenue, Amy</span>
            <Avatar
              image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
              shape="circle"
            />
          </div>
        </div>

        {/* Contenu dynamique */}
        <div className="p-4 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
