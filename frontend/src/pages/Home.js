import React from "react";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Performance Review System</h2>
        <div style={{ marginTop: 20 }}>
          <button style={styles.btn} onClick={() => navigate("/admin/login")}>
            Login as Admin
          </button>
          <button
            style={{ ...styles.btn, marginLeft: 10 }}
            onClick={() => navigate("/employee/login")}
          >
            Login as Employee
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: 40,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  btn: {
    padding: "8px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default Main;