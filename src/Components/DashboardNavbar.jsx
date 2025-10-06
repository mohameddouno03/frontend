import React from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

export default function DashboardNavbar({ toggleSidebar, userName = "Amy Elsner", userAvatar }) {
  return (
    <div className="flex items-center justify-between bg-white shadow px-4 h-16">
      {/* Bouton sidebar */}
      <Button
        icon="pi pi-bars"
        className="p-button-rounded p-button-text"
        onClick={toggleSidebar}
      />

      {/* Titre / Dashboard */}
      <div className="text-xl font-semibold text-gray-700">Dashboard</div>

      {/* Profil et déconnexion */}
      <div className="flex items-center gap-4">
        {/* Avatar utilisateur */}
        <Avatar
          image={userAvatar || "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"}
          shape="circle"
        />
        <span className="font-medium text-gray-700 hidden sm:inline">{userName}</span>

        {/* Bouton déconnexion */}
        <Button
          label="Déconnexion"
          icon="pi pi-sign-out"
          className="p-button-text p-button-sm"
        />
      </div>
    </div>
  );
}
