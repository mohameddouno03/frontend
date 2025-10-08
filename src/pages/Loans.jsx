import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../Components/DashboardLayout";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import axios from "axios";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loanDialog, setLoanDialog] = useState(false);
  const [loan, setLoan] = useState({
    livre: "",
    emprunteur: "",
    dateEmprunt: "",
    dateRetour: "",
    retourne: false,
  });
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://localhost:8081/loans";
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Charger les prêts
  const fetchLoans = async () => {
    try {
      const res = await axios.get(API_URL, axiosConfig);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger les prêts.",
      });
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Ouvrir le dialog pour ajouter
  const openNew = () => {
    setLoan({
      livre: "",
      emprunteur: "",
      dateEmprunt: "",
      dateRetour: "",
      retourne: false,
    });
    setEditing(false);
    setLoanDialog(true);
  };

  const hideDialog = () => setLoanDialog(false);

  // Enregistrer ou modifier un prêt
  const saveLoan = async () => {
    try {
      if (editing) {
        await axios.put(`${API_URL}/${loan.id}`, loan, axiosConfig);
        toast.current.show({
          severity: "success",
          summary: "Succès",
          detail: "Prêt modifié avec succès",
        });
      } else {
        await axios.post(API_URL, loan, axiosConfig);
        toast.current.show({
          severity: "success",
          summary: "Succès",
          detail: "Prêt ajouté avec succès",
        });
      }
      fetchLoans();
      hideDialog();
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Opération échouée",
      });
    }
  };

  // Modifier un prêt existant
  const editLoan = (loan) => {
    setLoan({
      ...loan,
      dateEmprunt: new Date(loan.dateEmprunt),
      dateRetour: loan.dateRetour ? new Date(loan.dateRetour) : null,
    });
    setEditing(true);
    setLoanDialog(true);
  };

  // Supprimer un prêt
  const confirmDeleteLoan = (loan) => {
    confirmDialog({
      message: `Supprimer le prêt du livre "${loan.livre}" ?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/${loan.id}`, axiosConfig);
          fetchLoans();
          toast.current.show({
            severity: "success",
            summary: "Supprimé",
            detail: "Prêt supprimé avec succès",
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

  const footerDialog = (
    <>
      <Button label="Annuler" icon="pi pi-times" onClick={hideDialog} />
      <Button label="Enregistrer" icon="pi pi-check" onClick={saveLoan} />
    </>
  );

  return (
    <DashboardLayout>
      <Toast ref={toast} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">📄 Gestion des Prêts</h2>
        <Button label="Nouveau Prêt" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable
        value={loans}
        stripedRows
        responsiveLayout="scroll"
        className="shadow-md rounded-lg"
      >
        <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
        <Column field="livre" header="Livre"></Column>
        <Column field="emprunteur" header="Emprunteur"></Column>
        <Column field="dateEmprunt" header="Date d'emprunt" body={(row) => new Date(row.dateEmprunt).toLocaleDateString()} />
        <Column field="dateRetour" header="Date de retour" body={(row) => row.dateRetour ? new Date(row.dateRetour).toLocaleDateString() : "—"} />
        <Column
          field="retourne"
          header="Retourné"
          body={(row) => (
            <span
              className={`px-2 py-1 rounded text-sm ${
                row.retourne ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {row.retourne ? "Oui" : "Non"}
            </span>
          )}
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text mr-2"
                onClick={() => editLoan(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() => confirmDeleteLoan(rowData)}
              />
            </>
          )}
        />
      </DataTable>

      <Dialog
        visible={loanDialog}
        style={{ width: "500px" }}
        header={editing ? "Modifier un prêt" : "Nouveau prêt"}
        modal
        className="p-fluid"
        footer={footerDialog}
        onHide={hideDialog}
      >
        <div className="field mb-3">
          <label htmlFor="livre" className="font-semibold">Livre</label>
          <InputText
            id="livre"
            value={loan.livre}
            onChange={(e) => setLoan({ ...loan, livre: e.target.value })}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="emprunteur" className="font-semibold">Emprunteur</label>
          <InputText
            id="emprunteur"
            value={loan.emprunteur}
            onChange={(e) => setLoan({ ...loan, emprunteur: e.target.value })}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="dateEmprunt" className="font-semibold">Date d’emprunt</label>
          <Calendar
            id="dateEmprunt"
            value={loan.dateEmprunt}
            onChange={(e) => setLoan({ ...loan, dateEmprunt: e.value })}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="dateRetour" className="font-semibold">Date de retour</label>
          <Calendar
            id="dateRetour"
            value={loan.dateRetour}
            onChange={(e) => setLoan({ ...loan, dateRetour: e.value })}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>

        <div className="field flex items-center gap-2">
          <label htmlFor="retourne" className="font-semibold">Retourné</label>
          <input
            type="checkbox"
            id="retourne"
            checked={loan.retourne}
            onChange={(e) => setLoan({ ...loan, retourne: e.target.checked })}
          />
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
