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

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [produitDialog, setProduitDialog] = useState(false);
  const [produit, setProduit] = useState({ name: "", price: 0 });
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://192.168.18.9:9090/produits";

  const fetchProduits = async () => {
    try {
      const res = await axios.get(API_URL);
      setProduits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const openNew = () => {
    setProduit({ name: "", price: 0 });
    setEditing(false);
    setProduitDialog(true);
  };

  const hideDialog = () => setProduitDialog(false);

  const saveProduit = async () => {
    try {
      if (editing) {
        await axios.put(`${API_URL}/${produit.id}`, produit);
        toast.current.show({ severity: "success", summary: "Updated", detail: "Produit updated" });
      } else {
        await axios.post(API_URL, produit);
        toast.current.show({ severity: "success", summary: "Created", detail: "Produit created" });
      }
      fetchProduits();
      hideDialog();
    } catch (err) {
      console.error(err);
      toast.current.show({ severity: "error", summary: "Error", detail: "Operation failed" });
    }
  };

  const editProduit = (produit) => {
    setProduit(produit);
    setEditing(true);
    setProduitDialog(true);
  };

  const confirmDeleteProduit = (produit) => {
    confirmDialog({
      message: `Delete produit "${produit.name}"?`,
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/${produit.id}`);
          fetchProduits();
          toast.current.show({ severity: "success", summary: "Deleted", detail: "Produit deleted" });
        } catch (err) {
          console.error(err);
          toast.current.show({ severity: "error", summary: "Error", detail: "Deletion failed" });
        }
      },
    });
  };

  const produitDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduit} />
    </>
  );

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produits</h2>
        <Button label="Add Produit" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={produits} stripedRows responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
        <Column field="name" header="Name"></Column>
        <Column field="price" header="Price"></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2" onClick={() => editProduit(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteProduit(rowData)} />
            </>
          )}
        ></Column>
      </DataTable>

      <Dialog
        visible={produitDialog}
        style={{ width: "450px" }}
        header={editing ? "Edit Produit" : "New Produit"}
        modal
        className="p-fluid"
        footer={produitDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={produit.name} onChange={(e) => setProduit({ ...produit, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="price">Price</label>
          <InputText id="price" type="number" value={produit.price} onChange={(e) => setProduit({ ...produit, price: parseFloat(e.target.value) })} />
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
