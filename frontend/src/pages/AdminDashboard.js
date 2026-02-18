import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Creation States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reviewedEmployeeId, setReviewedEmployeeId] = useState("");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");

  // Modal (Pop-up) States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); 
  const [viewDetails, setViewDetails] = useState(null); 

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addEmployee = async () => {
    if (!name || !email || !password) return alert("Fill Name, Email, and Password");
    await axios.post(`${API}/employees`, { name, email, password });
    setName(""); setEmail(""); setPassword(""); fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("CRITICAL: Deleting this employee will remove ALL reviews assigned to them or by them. Continue?")) {
      await axios.delete(`${API}/employees/${id}`);
      fetchEmployees(); fetchReviews();
    }
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

  const deleteReview = async (id) => {
    if (window.confirm("Delete this review assignment?")) {
      await axios.delete(`${API}/reviews/${id}`);
      fetchReviews();
    }
  };

  const handleUpdateSave = async () => {
    try {
      if (editItem.type === 'employee') {
        await axios.put(`${API}/employees/${editItem.id}`, { name: editItem.name, email: editItem.email });
        fetchEmployees();
      } else {
        await axios.put(`${API}/reviews/${editItem.id}`, { title: editItem.title, description: editItem.description });
        fetchReviews();
      }
      setIsEditModalOpen(false);
    } catch (err) { alert("Update failed"); }
  };

  const getEmpName = (id) => employees.find(e => e.id === id)?.name || `ID: ${id}`;

  const navbar = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 10%", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", marginBottom: "30px" };
  const cardStyle = { background: "#fff", padding: "20px", marginBottom: "20px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" };
  const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd", boxSizing: "border-box" };
  const primaryBtn = { padding: "10px 20px", border: "none", borderRadius: "4px", background: "#2563eb", color: "#fff", cursor: "pointer" };
  const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: 'Segoe UI, sans-serif' }}>
      <nav style={navbar}>
        <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
        <button onClick={handleLogout} style={{ ...primaryBtn, background: "transparent", color: "#374151", border: "1px solid #d1d5db" }}>Logout</button>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        
        <div style={cardStyle}>
          <h4>Add New Employee</h4>
          <input style={inputStyle} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={inputStyle} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button style={primaryBtn} onClick={addEmployee}>Add Employee</button>
        </div>

        <div style={cardStyle}>
          <h4>All Employees</h4>
          {employees.map((emp) => (
            <div key={emp.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <span><strong>{emp.name}</strong> ({emp.email})</span>
              <div>
                <button style={{ ...primaryBtn, background: "#10b981", marginRight: "5px" }} onClick={() => { setEditItem({ type: 'employee', ...emp }); setIsEditModalOpen(true); }}>Update</button>
                <button style={{ ...primaryBtn, background: "#dc2626" }} onClick={() => deleteEmployee(emp.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h4>Assign Performance Review</h4>
          <input style={inputStyle} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea style={{ ...inputStyle, height: "60px" }} placeholder="Instructions" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div style={{ display: "flex", gap: "10px" }}>
              <select style={inputStyle} value={reviewedEmployeeId} onChange={(e) => setReviewedEmployeeId(e.target.value)}>
                  <option value="">Target Employee</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <select style={inputStyle} value={assignedEmployeeId} onChange={(e) => setAssignedEmployeeId(e.target.value)}>
                  <option value="">Assigned Reviewer</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
          </div>
          <button style={primaryBtn} onClick={createReview}>Assign Review</button>
        </div>

        <div style={cardStyle}>
          <h4>Review Results & Feedback</h4>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ padding: "15px", border: "1px solid #f0f0f0", borderRadius: "8px", marginBottom: "15px", background: "#fcfcfc" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <strong>{rev.title}</strong>
                    <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px" }}>
                        Target: {getEmpName(rev.reviewed_employee_id)} | Reviewer: {getEmpName(rev.assigned_employee_id)}
                    </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                    <button style={{ ...primaryBtn, background: "#10b981", padding: "5px 10px" }} onClick={() => { setEditItem({ type: 'review', ...rev }); setIsEditModalOpen(true); }}>Edit</button>
                    <button style={{ ...primaryBtn, background: "#dc2626", padding: "5px 10px" }} onClick={() => deleteReview(rev.id)}>Delete</button>
                </div>
              </div>
              
              <div style={{ marginTop: "12px", background: "#f1f5f9", padding: "10px", borderRadius: "6px" }}>
                {rev.feedback ? (
                    <div>
                        <span style={{ fontSize: "14px", color: "#475569" }}>
                            {rev.feedback.length > 50 ? `${rev.feedback.substring(0, 50)}...` : rev.feedback}
                        </span>
                        <button 
                            onClick={() => setViewDetails(rev)}
                            style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "12px", marginLeft: "10px", textDecoration: "underline" }}
                        >
                            View Full Feedback
                        </button>
                    </div>
                ) : (
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>Awaiting Feedback Submission</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewDetails && (
        <div style={modalOverlay}>
            <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", width: "500px", maxWidth: "90%" }}>
                <h3 style={{ marginTop: 0 }}>Full Review Feedback</h3>
                <hr style={{ opacity: 0.2 }} />
                <p><strong>Review:</strong> {viewDetails.title}</p>
                <p><strong>Reviewer:</strong> {getEmpName(viewDetails.assigned_employee_id)}</p>
                <p><strong>Target:</strong> {getEmpName(viewDetails.reviewed_employee_id)}</p>
                <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "10px", minHeight: "100px", whiteSpace: "pre-wrap" }}>
                    {viewDetails.feedback}
                </div>
                <div style={{ textAlign: "right", marginTop: "20px" }}>
                    <button style={primaryBtn} onClick={() => setViewDetails(null)}>Close</button>
                </div>
            </div>
        </div>
      )}

      {isEditModalOpen && (
        <div style={modalOverlay}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "8px", width: "350px" }}>
            <h3>Update {editItem.type === 'employee' ? 'Employee' : 'Review'}</h3>
            {editItem.type === 'employee' ? (
              <>
                <input style={inputStyle} value={editItem.name} onChange={(e) => setEditItem({...editItem, name: e.target.value})} />
                <input style={inputStyle} value={editItem.email} onChange={(e) => setEditItem({...editItem, email: e.target.value})} />
              </>
            ) : (
              <>
                <input style={inputStyle} value={editItem.title} onChange={(e) => setEditItem({...editItem, title: e.target.value})} />
                <textarea style={{...inputStyle, height: "80px"}} value={editItem.description} onChange={(e) => setEditItem({...editItem, description: e.target.value})} />
              </>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
              <button style={{ ...primaryBtn, background: "#888" }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button style={primaryBtn} onClick={handleUpdateSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}