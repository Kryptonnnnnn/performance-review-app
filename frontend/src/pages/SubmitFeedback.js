import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function SubmitFeedback() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const submit = async () => {
    if (!feedback) return alert("Please enter feedback");

    try {
      await axios.put(`${API}/reviews/${id}/feedback`, {
        feedback_text: feedback,
      });

      alert("Feedback Submitted Successfully");
      
      const empId = localStorage.getItem("employee_id");
      navigate(`/employee/dashboard/${empId}`);
    } catch (error) {
      alert("Error submitting feedback");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2>Submit Feedback</h2>
      <textarea
        style={{ width: "100%", height: "150px", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        placeholder="Write your performance review feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <br /><br />
      <button 
        style={{ padding: "10px 20px", background: "#2563eb", color: "#white", border: "none", borderRadius: "4px", cursor: "pointer" }} 
        onClick={submit}
      >
        Submit Feedback
      </button>
    </div>
  );
}

export default SubmitFeedback;