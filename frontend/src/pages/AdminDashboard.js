import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reviewedEmployeeId, setReviewedEmployeeId] = useState("");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchReviews();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get(`${API}/employees`);
    setEmployees(res.data);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`${API}/reviews`);
    setReviews(res.data);
  };

  const addEmployee = async () => {
    if (!name || !email) return alert("Fill all fields");
    await axios.post(`${API}/employees`, { name, email });
    setName(""); setEmail(""); fetchEmployees();
  };

  const handleUpdateEmployee = async (id) => {
    if (!name || !email) return alert("Fill Name/Email inputs to update");
    await axios.put(`${API}/employees/${id}`, { name, email });
    setName(""); setEmail(""); fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`);
    fetchEmployees(); fetchReviews();
  };

  const createReview = async () => {
    if (!title || !description || !reviewedEmployeeId || !assignedEmployeeId) return alert("Fill all fields");
    await axios.post(`${API}/reviews`, {
      title, description,
      reviewed_employee_id: Number(reviewedEmployeeId),
      assigned_employee_id: Number(assignedEmployeeId),
    });
    setTitle(""); setDescription(""); setReviewedEmployeeId(""); setAssignedEmployeeId(""); fetchReviews();
  };

  const handleUpdateReview = async (id) => {
    if (!title || !description) return alert("Fill Title/Description to update");
    await axios.put(`${API}/reviews/${id}`, { title, description });
    setTitle(""); setDescription(""); fetchReviews();
  };

  const deleteReview = async (id) => {
    await axios.delete(`${API}/reviews/${id}`);
    fetchReviews();
  };

  const cardStyle = { background: "#fff", padding: "20px", marginBottom: "20px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" };
  const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" };
  const buttonStyle = { padding: "6px 12px", border: "none", borderRadius: "4px", background: "#2563eb", color: "#fff", cursor: "pointer" };
  const updateBtn = { ...buttonStyle, background: "#10b981", marginLeft: "10px" };
  const deleteBtn = { ...buttonStyle, background: "#dc2626", marginLeft: "10px" };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Dashboard</h2>

      <div style={cardStyle}>
        <h4>Add/Update Employee (Type here first, then click Add or Update below)</h4>
        <input style={inputStyle} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={inputStyle} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button style={buttonStyle} onClick={addEmployee}>Add New</button>
      </div>

      <div style={cardStyle}>
        <h4>All Employees</h4>
        {employees.map((emp) => (
          <div key={emp.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span><b>{emp.name}</b> ({emp.email})</span>
            <div>
              <button style={updateBtn} onClick={() => handleUpdateEmployee(emp.id)}>Update</button>
              <button style={deleteBtn} onClick={() => deleteEmployee(emp.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h4>Create/Update Review (Type details first, then click Create or Update below)</h4>
        <input style={inputStyle} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea style={{ ...inputStyle, height: "80px" }} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select style={inputStyle} value={reviewedEmployeeId} onChange={(e) => setReviewedEmployeeId(e.target.value)}>
          <option value="">Select Employee To Review</option>
          {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
        </select>
        <select style={inputStyle} value={assignedEmployeeId} onChange={(e) => setAssignedEmployeeId(e.target.value)}>
          <option value="">Select Employee To Assign</option>
          {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
        </select>
        <button style={buttonStyle} onClick={createReview}>Create New</button>
      </div>

      <div style={cardStyle}>
        <h4>All Reviews</h4>
        {reviews.map((rev) => (
          <div key={rev.id} style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <b>{rev.title}</b>
            <p style={{ margin: "4px 0" }}>{rev.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <small>Reviewed: {rev.reviewed_employee_id} | Assigned: {rev.assigned_employee_id}</small>
              <div>
                <button style={updateBtn} onClick={() => handleUpdateReview(rev.id)}>Update</button>
                <button style={deleteBtn} onClick={() => deleteReview(rev.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}