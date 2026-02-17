import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Feedback() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const submitFeedback = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/feedback/${reviewId}`, {
        feedback: feedback,
      });

      alert("Feedback submitted successfully");
      navigate(-1);
    } catch (error) {
      alert("Error submitting feedback");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Submit Feedback</h2>
        <textarea
          style={textarea}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write feedback here..."
        />
        <button style={button} onClick={submitFeedback}>
          Submit
        </button>
      </div>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
  marginTop: "60px",
};

const card = {
  width: "500px",
  background: "#fff",
  padding: "30px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const textarea = {
  width: "100%",
  height: "120px",
  marginBottom: "15px",
  padding: "10px",
};

const button = {
  padding: "8px 16px",
  background: "#2f5bd3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Feedback;