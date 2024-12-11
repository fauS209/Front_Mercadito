import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreatePost.css";
import Navbar from "../components/Navbar";
import Footers from "../components/Footers";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    telNumber: "",
  });
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Agregar clase al body cuando el componente se monta
    document.body.classList.add("body-CreatePost");

    // Limpiar clase cuando el componente se desmonta
    return () => {
      document.body.classList.remove("body-CreatePost");
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!storedUserId || isLoggedIn !== "true") {
      navigate("/Error"); // Redirige si no está autenticado
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{8,10}$/; // Número de 8 a 10 dígitos
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErrorMessage("Por favor, selecciona un archivo.");
      return;
    }

    if (!validatePhoneNumber(formData.telNumber)) {
      setErrorMessage("Número de teléfono no válido. Debe tener entre 8 y 10 dígitos.");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("postDto", JSON.stringify({ ...formData, userId }));

      const response = await axios.post(
        "http://localhost:8080/api/v1/mercadito/posts/create",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("¡Post creado exitosamente!");
      setErrorMessage(""); // Limpia mensajes de error si todo fue exitoso
    } catch (error) {
      console.error("Error al crear el post:", error);
      setErrorMessage("Ocurrió un error al crear el post.");
      setSuccessMessage(""); // Limpia mensajes de éxito si hubo error
    }
  };

  return (
    <div className="create-post-page">
      <Navbar />
      <h2 className="create-post-title">Sell a product</h2>
      <div className="create-post-container">
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Item name"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your item"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="telNumber">Telephone Number</label>
            <input
              type="text"
              id="telNumber"
              name="telNumber"
              placeholder="Phone number"
              value={formData.telNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">File</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Create Post</button>
        </form>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <Footers />
    </div>
  );
};

export default CreatePost;
