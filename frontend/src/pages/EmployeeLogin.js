import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EmployeeLogin() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const handleLogin = async () => {
    if (!selectedId) {
      toast.error("Please select an employee");
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === parseInt(selectedId));

    try {
      const res = await axios.post("http://localhost:8000/employee/login", {
        email: selectedEmployee.email, // Use the actual email
        password: "password123"        // Use default password
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", "employee");
      localStorage.setItem("employee_id", selectedId);

      toast.success("Login successful!");
      navigate(`/employee/dashboard/${selectedId}`);
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.detail || "Error"));
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Employee Login</h2>
        <select style={styles.select} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <button style={styles.button} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f8" },
  card: { width: 330, padding: 30, background: "#fff", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  title: { marginBottom: 20, textAlign: "center" },
  select: { width: "100%", padding: 10, marginBottom: 15, borderRadius: 6, border: "1px solid #ddd" },
  button: { width: "100%", padding: 10, borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" }
};

export default EmployeeLogin;