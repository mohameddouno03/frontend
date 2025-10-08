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

export default function Books() {
  const [books, setBooks] = useState([]);
  const [bookDialog, setBookDialog] = useState(false);
  const [book, setBook] = useState({ titre: "", auteur: "", disponible: true });
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://localhost:8081/books";
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_URL, axiosConfig);
      setBooks(res.data);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger les livres",
      });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openNew = () => {
    setBook({ titre: "", auteur: "", disponible: true });
    setEditing(false);
    setBookDialog(true);
  };

  const hideDialog = () => setBookDialog(false);

  const saveBook = async () => {
    try {
      if (editing) {
        await axios.put(`${API_URL}/${book.id}`, book, axiosConfig);
        toast.current.show({ severity: "success", summary: "Livre modifié" });
      } else {
        await axios.post(API_URL, book, axiosConfig);
        toast.current.show({ severity: "success", summary: "Livre ajouté" });
      }
      fetchBooks();
      hideDialog();
    } catch (err) {
      toast.current.show({ severity: "error", summary: "Erreur" });
    }
  };

  const editBook = (book) => {
    setBook(book);
    setEditing(true);
    setBookDialog(true);
  };

  const confirmDeleteBook = (book) => {
    confirmDialog({
      message: `Supprimer "${book.titre}" ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/${book.id}`, axiosConfig);
          fetchBooks();
          toast.current.show({ severity: "success", summary: "Livre supprimé" });
        } catch {
          toast.current.show({ severity: "error", summary: "Erreur de suppression" });
        }
      },
    });
  };

  const footer = (
    <>
      <Button label="Annuler" icon="pi pi-times" onClick={hideDialog} />
      <Button label="Enregistrer" icon="pi pi-check" onClick={saveBook} />
    </>
  );

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📚 Gestion des Livres</h2>
        <Button label="Ajouter un livre" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={books}>
        <Column field="id" header="ID" />
        <Column field="titre" header="Titre" />
        <Column field="auteur" header="Auteur" />
        <Column
          field="disponible"
          header="Disponible"
          body={(r) => (r.disponible ? "✅ Oui" : "❌ Non")}
        />
        <Column
          header="Actions"
          body={(r) => (
            <>
              <Button icon="pi pi-pencil" onClick={() => editBook(r)} />
              <Button icon="pi pi-trash" onClick={() => confirmDeleteBook(r)} />
            </>
          )}
        />
      </DataTable>

      <Dialog visible={bookDialog} footer={footer} onHide={hideDialog}>
        <div>
          <label>Titre</label>
          <InputText value={book.titre} onChange={(e) => setBook({ ...book, titre: e.target.value })} />
        </div>
        <div>
          <label>Auteur</label>
          <InputText value={book.auteur} onChange={(e) => setBook({ ...book, auteur: e.target.value })} />
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
