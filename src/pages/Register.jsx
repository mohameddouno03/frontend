import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { label: "Admin", value: "ADMIN" },
    { label: "User", value: "USER" },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value || "",
    }));
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.role) {
      setMessage("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/register",
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("Inscription réussie !");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Une erreur est survenue !"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex flex-column h-screen rounded-lg shadow-lg md:flex-row">
        <div className="w-full md:w-6 flex flex-column align-items-center justify-content-center gap-3 py-5">
          <h2>Créer un compte</h2>

          <div className="flex flex-wrap justify-center align-items-center gap-2">
            <label htmlFor="username" className="w-6rem font-medium">Username</label>
            <InputText
              id="username"
              type="text"
              className="w-15rem"
              value={formData.username || ""}
              onChange={handleChange}
              placeholder="Entrez un nom d'utilisateur"
            />
          </div>

          <div className="flex flex-wrap justify-center align-items-center gap-2">
            <label htmlFor="password" className="w-6rem font-medium">Password</label>
            <Password
              id="password"
              toggleMask
              feedback={false}
              inputClassName="w-15rem"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value || "",
                }))
              }
              placeholder="Entrez un mot de passe"
            />
          </div>

          <div className="flex flex-wrap justify-center align-items-center gap-2">
            <label htmlFor="role" className="w-6rem font-medium">Rôle</label>
            <Dropdown
              id="role"
              value={formData.role || ""}
              options={roles}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.value || "",
                }))
              }
              placeholder="Choisir un rôle"
              className="w-12rem"
            />
          </div>

          {message && <p className="text-center text-sm text-red-500">{message}</p>}

          <Button
            label={loading ? "Inscription..." : "S'inscrire"}
            icon="pi pi-user-plus"
            className="w-10rem"
            severity="success"
            onClick={handleRegister}
            disabled={loading}
          />
        </div>

        <Divider layout="vertical" className="hidden md:flex">
          <b>OU</b>
        </Divider>
        <Divider layout="horizontal" className="flex md:hidden" align="center">
          <b>OU</b>
        </Divider>

        <div className="w-full md:w-6 flex align-items-center justify-content-center py-5">
          <Button
            label="Se connecter"
            icon="pi pi-sign-in"
            className="w-10rem"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    </div>
  );
}
