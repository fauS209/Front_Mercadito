import React, { useState, useEffect } from "react";
import "../css/Dashbord.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footers from "../components/Footers";
import { useNavigate } from "react-router-dom";

const Dashbord = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async (filter = "") => {
    try {
      const url = filter
        ? `http://localhost:8080/api/v1/mercadito/posts/filter/${filter}`
        : "http://localhost:8080/api/v1/mercadito/posts/all";
      const response = await axios.get(url);
      setPosts(response.data);
    } catch (err) {
      setError("Error al cargar los posts. Por favor, intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("body-Dashbord");
    return () => {
      document.body.classList.remove("body-Dashbord");
    };
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/Error");
      return;
    }

    fetchPosts();
  }, [navigate]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const filter = searchTerm.trim();
    fetchPosts(filter);
  };

  if (loading) return <p>Cargando posts...</p>;
  if (error) return <div> <h2> Producto no encontrado </h2>  </div>;

  return (
    <div>
      <Navbar />
      <h1 className="titleMercadito">El Mercadito Trigreño</h1>
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Filtrar</button>
      </form>

      <div className="posts-container">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            {post.postsImgData && (
              <img
                src={`data:${post.postsImgType};base64,${post.postsImgData}`}
                alt={post.title}
              />
            )}
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <p>
              <strong>Teléfono:</strong> {post.telNumber}
            </p>
            <p>
              <strong>Fecha:</strong> {post.date}
            </p>
            <a
              href={`https://wa.me/506${post.telNumber}?text=Hola!%20Estoy%20interesado%20en%20el%20producto%20"${post.title}"`}
              className="whatsapp-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
              />
              Contáctanos
            </a>
          </div>
        ))}
      </div>
      <footer className="footerDash">
        <Footers />
      </footer>
    </div>
  );
};

export default Dashbord;
