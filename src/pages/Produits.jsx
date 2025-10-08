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
  const [produit, setProduit] = useState({
    id: null,
    nom: "",
    prix: 0,
    quantite: 0,
    image: null,
    categorie: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const API_URL = "http://localhost:8080/api/produits";
  const token = localStorage.getItem("token");

  // Configuration par défaut d'axios avec le token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // 📥 Récupérer tous les produits
  const fetchProduits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProduits(res.data);
    } catch (err) {
      console.error(err);
      showError("Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  // Fonction utilitaire pour afficher les erreurs
  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Erreur",
      detail: message,
      life: 3000
    });
  };

  // Fonction utilitaire pour afficher les succès
  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Succès",
      detail: message,
      life: 3000
    });
  };

  // ➕ Ouvrir le formulaire pour un nouveau produit
  const openNew = () => {
    setProduit({ 
      id: null, 
      nom: "", 
      prix: 0, 
      quantite: 0, 
      image: null, 
      categorie: "" 
    });
    setImagePreview(null);
    setEditing(false);
    setVisible(true);
  };

  // 💾 Enregistrer ou modifier un produit
  const saveProduit = async () => {
    try {
      const formData = new FormData();
      formData.append("nom", produit.nom);
      formData.append("prix", produit.prix);
      formData.append("quantité", produit.quantite.toString());
      formData.append("categorie", produit.categorie);
      
      if (produit.image) {
        formData.append("image", produit.image);
      }

      if (editing) {
        await axios.put(`${API_URL}/${produit.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccess("Produit modifié avec succès");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccess("Produit ajouté avec succès");
      }

      setVisible(false);
      fetchProduits();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      showError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  // 📝 Modifier un produit
  const editProduit = (p) => {
    setProduit({
      id: p.id,
      nom: p.nom,
      prix: p.prix,
      quantite: p.quantité || 0,
      categorie: p.categorie,
      image: null
    });
    
    // Afficher l'image existante si elle existe
    if (p.image) {
      setImagePreview(p.image);
    } else {
      setImagePreview(null);
    }
    
    setEditing(true);
    setVisible(true);
  };

  // ❌ Supprimer un produit
  const deleteProduit = (p) => {
    confirmDialog({
      message: `Voulez-vous vraiment supprimer le produit "${p.nom}" ?`,
      header: "Confirmation de suppression",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/${p.id}`);
          showSuccess("Produit supprimé avec succès");
          fetchProduits();
        } catch (err) {
          console.error(err);
          showError("Échec de la suppression du produit");
        }
      }
    });
  };

  // Rendu de l'image dans le tableau
  const imageBodyTemplate = (rowData) => {
    if (!rowData.image) return null;
    return (
      <img 
        src={rowData.image} 
        alt={rowData.nom} 
        style={{ 
          width: '50px', 
          height: '50px', 
          objectFit: 'cover', 
          borderRadius: '4px' 
        }} 
      />
    );
  };

  // Rendu du prix formaté
  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0
    }).format(rowData.prix);
  };

  return (
    <DashboardLayout>
      <Toast ref={toast} />
      <div className="card">
        <div className="flex justify-between align-items-center mb-4">
          <h2 className="text-2xl font-bold">🛍️ Gestion des Produits</h2>
          <Button 
            label="Ajouter un produit" 
            icon="pi pi-plus" 
            className="p-button-primary" 
            onClick={openNew} 
          />
        </div>

        <div className="card">
          <DataTable 
            value={produits} 
            paginator 
            rows={10} 
            loading={loading}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} produits"
            emptyMessage="Aucun produit trouvé"
            stripedRows
            responsiveLayout="scroll"
            className="p-datatable-sm"
          >
            <Column field="id" header="ID" style={{ width: '5%' }} />
            <Column field="nom" header="Nom" sortable style={{ width: '20%' }} />
            <Column 
              field="prix" 
              header="Prix" 
              body={priceBodyTemplate}
              sortable 
              style={{ width: '15%' }} 
            />
            <Column 
              field="quantité" 
              header="Quantité" 
              body={(rowData) => rowData.quantité || 0} 
              sortable 
              style={{ width: '15%' }} 
            />
            <Column 
              field="categorie" 
              header="Catégorie" 
              sortable 
              style={{ width: '15%' }} 
            />
            <Column 
              header="Image" 
              body={imageBodyTemplate} 
              style={{ width: '10%', textAlign: 'center' }} 
            />
            <Column 
              header="Actions" 
              body={(rowData) => (
                <div className="flex gap-2">
                  <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-text p-button-primary" 
                    tooltip="Modifier"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => editProduit(rowData)} 
                  />
                  <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-text p-button-danger" 
                    tooltip="Supprimer"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => deleteProduit(rowData)} 
                  />
                </div>
              )} 
              style={{ width: '15%', textAlign: 'center' }} 
            />
          </DataTable>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header={editing ? "Modifier le produit" : "Nouveau produit"}
        modal
        style={{ width: '450px' }}
        footer={
          <div>
            <Button 
              label="Annuler" 
              icon="pi pi-times" 
              className="p-button-text" 
              onClick={() => setVisible(false)} 
            />
            <Button 
              label="Enregistrer" 
              icon="pi pi-check" 
              className="p-button-primary" 
              onClick={saveProduit} 
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="nom">Nom *</label>
            <InputText
              id="nom"
              value={produit.nom}
              onChange={(e) => setProduit({ ...produit, nom: e.target.value })}
              required
              autoFocus
            />
          </div>
          
          <div className="field">
            <label htmlFor="prix">Prix (GNF) *</label>
            <InputText
              id="prix"
              type="number"
              value={produit.prix}
              onChange={(e) => setProduit({ ...produit, prix: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          
          <div className="field">
            <label htmlFor="quantite">Quantité *</label>
            <InputText
              id="quantite"
              type="number"
              value={produit.quantite}
              onChange={(e) => setProduit({ ...produit, quantite: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          
          <div className="field">
            <label htmlFor="categorie">Catégorie *</label>
            <InputText
              id="categorie"
              value={produit.categorie}
              onChange={(e) => setProduit({ ...produit, categorie: e.target.value })}
              required
            />
          </div>
          
          <div className="field">
            <label htmlFor="image">Image</label>
            <div className="p-inputgroup">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProduit({ ...produit, image: file });
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="p-inputtext"
              />
            </div>
            {imagePreview && (
              <div className="mt-3 text-center">
                <img 
                  src={imagePreview} 
                  alt="Aperçu" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '5px'
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  );
}