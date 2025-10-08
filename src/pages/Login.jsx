import React, { useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value || "",
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        credentials
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setMessage("Connexion réussie !");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage("Identifiants invalides !");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Erreur lors de la connexion !"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex flex-column h-screen rounded-lg shadow-lg md:flex-row">
        <div className="w-full md:w-6 flex flex-column align-items-center justify-content-center gap-3 py-5">
          <h2>Connexion</h2>

          <div className="flex flex-wrap justify-center align-items-center gap-2">
            <label htmlFor="username" className="w-6rem font-medium">Username</label>
            <InputText
              id="username"
              type="text"
              className="w-15rem"
              value={credentials.username || ""}
              onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <div className="flex flex-wrap justify-center align-items-center gap-2">
            <label htmlFor="password" className="w-6rem font-medium">Password</label>
            <Password
              id="password"
              toggleMask
              feedback={false}
              inputClassName="w-15rem"
              value={credentials.password || ""}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value || "",
                }))
              }
              placeholder="Entrez votre mot de passe"
            />
          </div>

          {message && <p className="text-center text-sm text-red-500">{message}</p>}

          <Button
            label={loading ? "Connexion..." : "Se connecter"}
            icon="pi pi-sign-in"
            className="w-10rem"
            onClick={handleLogin}
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
            label="S'inscrire"
            icon="pi pi-user-plus"
            severity="success"
            className="w-10rem"
            onClick={() => navigate("/register")}
          />
        </div>
      </div>
    </div>
  );
}
