import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/admin/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Invalid admin credentials";
      toast.error(errorMsg);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <input
          style={styles.input}
          placeholder="Admin Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.btn} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f4f6f8", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#fff", padding: 40, borderRadius: 10, width: 350, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  title: { textAlign: "center", marginBottom: 20 },
  input: { width: "100%", padding: 10, marginBottom: 15, border: "1px solid #ddd", borderRadius: 6 },
  btn: { width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};

export default AdminLogin;