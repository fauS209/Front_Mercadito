import React, { useState, useEffect } from "react";
import "../css/Register.css";
import Navbar from "../components/Navbar";
import Footers from "../components/Footers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Modificar el body solo para esta página
  useEffect(() => {
    document.body.classList.add("register-page"); // Agregar clase al body al montar la página
    return () => {
      document.body.classList.remove("register-page"); // Eliminar clase cuando la página se desmonta
    };
  }, []);

  async function register(event) {
    event.preventDefault();
    setErrorMessage("");
    try {
      const res = await axios.post("http://localhost:8080/api/v1/mercadito/users/register", {
        email,
        password,
        userName,
      });
      if (res.userName == res.data.userName) {
        navigate("/login"); // Redirige al login después del registro exitoso
      } else {
        setErrorMessage("Error desconocido al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      const errorResponse = error.response?.data?.message || "Error en la conexión. Intenta de nuevo.";
      setErrorMessage(errorResponse);
    }
  }

  return (
    <div className="container">
      <Navbar />
      <h2 className="header">Personal information</h2>
      <form className="form" onSubmit={register}>
        <div  className="input-group">
          <label htmlFor="userName" className="label">Name</label>
          <input
            type="text"
            id="userName"
            name="userName"
            required
            className="input"
            placeholder="Write your name"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email" className="label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="input"
            placeholder="Write your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="button">Register</button>
      </form>
      <Footers />
    </div>
  );
};

export default Register;
