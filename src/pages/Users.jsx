import React, { useState, useEffect, useRef } from "react";
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
  const [userDialog, setUserDialog] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://192.168.18.9:9090/api/users";

  const fetchUsers = async () => { try { const res = await axios.get(API_URL); setUsers(res.data); } catch (err) { console.error(err); } };
  useEffect(() => { fetchUsers(); }, []);

  const openNew = () => { setUser({ name: "", email: "", password: "" }); setEditing(false); setUserDialog(true); };
  const hideDialog = () => setUserDialog(false);

  const saveUser = async () => {
    try {
      if (editing) { await axios.put(`${API_URL}/${user.id}`, user); toast.current.show({ severity: "success", summary: "Updated", detail: "User updated" }); }
      else { await axios.post(API_URL, user); toast.current.show({ severity: "success", summary: "Created", detail: "User created" }); }
      fetchUsers(); hideDialog();
    } catch (err) { console.error(err); toast.current.show({ severity: "error", summary: "Error", detail: "Operation failed" }); }
  };

  const editUser = (user) => { setUser(user); setEditing(true); setUserDialog(true); };
  const confirmDeleteUser = (user) => {
    confirmDialog({
      message: `Delete user "${user.name}"?`,
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: async () => { try { await axios.delete(`${API_URL}/${user.id}`); fetchUsers(); toast.current.show({ severity: "success", summary: "Deleted", detail: "User deleted" }); } 
      catch (err) { console.error(err); toast.current.show({ severity: "error", summary: "Error", detail: "Deletion failed" }); } },
    });
  };

  const userDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
    </>
  );

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button label="Add User" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={users} stripedRows responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
        <Column field="name" header="Name"></Column>
        <Column field="email" header="Email"></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2" onClick={() => editUser(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteUser(rowData)} />
            </>
          )}
        ></Column>
      </DataTable>

      <Dialog visible={userDialog} style={{ width: "450px" }} header={editing ? "Edit User" : "New User"} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <InputText id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
        </div>
        {!editing && (
          <div className="field">
            <label htmlFor="password">Password</label>
            <InputText id="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password" />
          </div>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
