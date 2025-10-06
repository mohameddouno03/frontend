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

  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_URL);
      setBooks(res.data);
    } catch (err) {
      console.error("Erreur de récupération :", err);
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
        await axios.put(`${API_URL}/${book.id}`, book);
        toast.current.show({
          severity: "success",
          summary: "Succès",
          detail: "Livre modifié avec succès",
        });
      } else {
        await axios.post(API_URL, book);
        toast.current.show({
          severity: "success",
          summary: "Succès",
          detail: "Livre ajouté avec succès",
        });
      }
      fetchBooks();
      hideDialog();
    } catch (err) {
      console.error("Erreur Axios :", err.response || err);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: err.response?.data?.message || "Opération échouée",
      });
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
          await axios.delete(`${API_URL}/${book.id}`);
          fetchBooks();
          toast.current.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Livre supprimé avec succès",
          });
        } catch (err) {
          console.error(err);
          toast.current.show({
            severity: "error",
            summary: "Erreur",
            detail: "Échec de la suppression",
          });
        }
      },
    });
  };

  const bookDialogFooter = (
    <>
      <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" onClick={saveBook} />
    </>
  );

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-6 ml-">
        <h2 className="text-2xl font-bold text-gray-700 ">📚 Gestion des Livres</h2>
        <Button label="Ajouter un livre" icon="pi pi-plus" className="p-button-primary" onClick={openNew} />
      </div>

      <DataTable value={books} stripedRows responsiveLayout="scroll" className="shadow-lg rounded-lg">
        <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
        <Column field="titre" header="Titre"></Column>
        <Column field="auteur" header="Auteur"></Column>
        <Column
          field="disponible"
          header="Disponible"
          body={(rowData) => (
            <span
              className={`px-2 py-1 rounded text-sm ${
                rowData.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {rowData.disponible ? "Oui" : "Non"}
            </span>
          )}
        ></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text mr-2"
                onClick={() => editBook(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() => confirmDeleteBook(rowData)}
              />
            </>
          )}
        ></Column>
      </DataTable>

      <Dialog
        visible={bookDialog}
        style={{ width: "450px" }}
        header={editing ? "Modifier un Livre" : "Nouveau Livre"}
        modal
        className="p-fluid"
        footer={bookDialogFooter}
        onHide={hideDialog}
      >
        <div className="field mb-3">
          <label htmlFor="titre" className="font-semibold">Titre</label>
          <InputText
            id="titre"
            value={book.titre}
            onChange={(e) => setBook({ ...book, titre: e.target.value })}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="auteur" className="font-semibold">Auteur</label>
          <InputText
            id="auteur"
            value={book.auteur}
            onChange={(e) => setBook({ ...book, auteur: e.target.value })}
          />
        </div>

        <div className="field flex items-center gap-2">
          <label htmlFor="disponible" className="font-semibold">Disponible</label>
          <input
            type="checkbox"
            id="disponible"
            checked={book.disponible}
            onChange={(e) => setBook({ ...book, disponible: e.target.checked })}
          />
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
