import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function EmployeeLogin() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const handleLogin = async () => {
    if (!selectedEmail || !password) {
      toast.error("Enter both email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/employee/login", {
        email: selectedEmail,
        password: password 
      });

      localStorage.setItem("employee_id", res.data.employee_id);
      toast.success("Login successful!");
      navigate(`/employee/dashboard/${res.data.employee_id}`);
    } catch (error) {
      toast.error("Login failed: Invalid credentials");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Employee Login</h2>
        <select style={styles.select} onChange={(e) => setSelectedEmail(e.target.value)}>
          <option value="">Select Account</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.email}>{emp.name}</option>
          ))}
        </select>
        <input 
          type="password" 
          placeholder="Enter Password" 
          style={styles.select} 
          onChange={(e) => setPassword(e.target.value)} 
        />
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