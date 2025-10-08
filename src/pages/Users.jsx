import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://localhost:8081/api/auth/users";
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL, axiosConfig);
      setUsers(res.data);
    } catch {
      toast.current.show({ severity: "error", summary: "Erreur" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNew = () => {
    setUser({ name: "", email: "", role: "" });
    setVisible(true);
    setEditing(false);
  };

  const saveUser = async () => {
    try {
      if (editing) await axios.put(`${API_URL}/${user.id}`, user, axiosConfig);
      else await axios.post(API_URL, user, axiosConfig);
      fetchUsers();
      toast.current.show({ severity: "success", summary: "Sauvegardé" });
      setVisible(false);
    } catch {
      toast.current.show({ severity: "error", summary: "Erreur" });
    }
  };

  const deleteUser = (u) => {
    confirmDialog({
      message: `Supprimer ${u.name} ?`,
      accept: async () => {
        await axios.delete(`${API_URL}/${u.id}`, axiosConfig);
        fetchUsers();
        toast.current.show({ severity: "success", summary: "Supprimé" });
      },
    });
  };

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">👤 Gestion des Utilisateurs</h2>
        <Button label="Ajouter" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={users}>
        <Column field="id" header="ID" />
        <Column field="name" header="Nom" />
        <Column field="email" header="Email" />
        <Column field="role" header="Rôle" />
        <Column
          header="Actions"
          body={(r) => (
            <>
              <Button icon="pi pi-pencil" onClick={() => { setUser(r); setEditing(true); setVisible(true); }} />
              <Button icon="pi pi-trash" onClick={() => deleteUser(r)} />
            </>
          )}
        />
      </DataTable>

      <Dialog visible={visible} onHide={() => setVisible(false)} footer={
        <>
          <Button label="Annuler" onClick={() => setVisible(false)} />
          <Button label="Enregistrer" onClick={saveUser} />
        </>
      }>
        <div>
          <label>Nom</label>
          <InputText value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
        </div>
        <div>
          <label>Email</label>
          <InputText value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        </div>
        <div>
          <label>Rôle</label>
          <InputText value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} />
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
