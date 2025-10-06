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
  const [loan, setLoan] = useState({ book: "", user: "", startDate: null, endDate: null });
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://192.168.18.9:9090/loans";

  const fetchLoans = async () => {
    try {
      const res = await axios.get(API_URL);
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const openNew = () => { setLoan({ book: "", user: "", startDate: null, endDate: null }); setEditing(false); setLoanDialog(true); };
  const hideDialog = () => setLoanDialog(false);

  const saveLoan = async () => {
    try {
      if (editing) {
        await axios.put(`${API_URL}/${loan.id}`, loan);
        toast.current.show({ severity: "success", summary: "Updated", detail: "Loan updated" });
      } else {
        await axios.post(API_URL, loan);
        toast.current.show({ severity: "success", summary: "Created", detail: "Loan created" });
      }
      fetchLoans();
      hideDialog();
    } catch (err) {
      console.error(err);
      toast.current.show({ severity: "error", summary: "Error", detail: "Operation failed" });
    }
  };

  const editLoan = (loan) => { setLoan(loan); setEditing(true); setLoanDialog(true); };
  const confirmDeleteLoan = (loan) => {
    confirmDialog({
      message: `Delete loan of "${loan.book}" by "${loan.user}"?`,
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try { await axios.delete(`${API_URL}/${loan.id}`); fetchLoans(); toast.current.show({ severity: "success", summary: "Deleted", detail: "Loan deleted" }); } 
        catch (err) { console.error(err); toast.current.show({ severity: "error", summary: "Error", detail: "Deletion failed" }); }
      },
    });
  };

  const loanDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveLoan} />
    </>
  );

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Loans</h2>
        <Button label="Add Loan" icon="pi pi-plus" onClick={openNew} />
      </div>

      <DataTable value={loans} stripedRows responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "5rem" }}></Column>
        <Column field="book" header="Book"></Column>
        <Column field="user" header="User"></Column>
        <Column field="startDate" header="Start Date"></Column>
        <Column field="endDate" header="End Date"></Column>
        <Column
          header="Actions"
          body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2" onClick={() => editLoan(rowData)} />
              <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteLoan(rowData)} />
            </>
          )}
        ></Column>
      </DataTable>

      <Dialog visible={loanDialog} style={{ width: "450px" }} header={editing ? "Edit Loan" : "New Loan"} modal className="p-fluid" footer={loanDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="book">Book</label>
          <InputText id="book" value={loan.book} onChange={(e) => setLoan({ ...loan, book: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="user">User</label>
          <InputText id="user" value={loan.user} onChange={(e) => setLoan({ ...loan, user: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="startDate">Start Date</label>
          <Calendar id="startDate" value={loan.startDate} onChange={(e) => setLoan({ ...loan, startDate: e.value })} dateFormat="yy-mm-dd" showIcon />
        </div>
        <div className="field">
          <label htmlFor="endDate">End Date</label>
          <Calendar id="endDate" value={loan.endDate} onChange={(e) => setLoan({ ...loan, endDate: e.value })} dateFormat="yy-mm-dd" showIcon />
        </div>
      </Dialog>
    </DashboardLayout>
  );
}
