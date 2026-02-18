import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EmployeeDash() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/employee/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  const submitFeedback = async (reviewId) => {
    if (!feedbackText.trim()) return alert("Please enter feedback");
    try {
      await axios.put(`http://localhost:8000/reviews/${reviewId}/feedback`, {
        feedback_text: feedbackText,
      });
      alert("Feedback submitted successfully!");
      setFeedbackText("");
      setActiveReviewId(null);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <nav style={navbar}>
        <h3 style={{ margin: 0 }}>Employee Portal</h3>
        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </nav>

      <div style={container}>
        <h2 style={{ color: "#1f2937", marginBottom: "24px" }}>My Assigned Reviews</h2>

        {reviews.length === 0 ? (
          <div style={card}>
            <p style={{ textAlign: "center", color: "#6b7280" }}>No reviews assigned at this time.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "#111827" }}>{review.title}</h4>
                  <p style={{ margin: 0, color: "#4b5563", fontSize: "14px" }}>{review.description}</p>
                </div>
                {activeReviewId !== review.id && (
                  <button 
                    style={btn} 
                    onClick={() => {
                        setActiveReviewId(review.id);
                        setFeedbackText(review.feedback || ""); 
                    }}
                  >
                    {review.feedback ? "Edit Feedback" : "Give Feedback"}
                  </button>
                )}
              </div>

              {activeReviewId === review.id && (
                <div style={feedbackSection}>
                  <textarea
                    style={textarea}
                    placeholder="Write your performance review feedback here..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button style={submitBtn} onClick={() => submitFeedback(review.id)}>
                      Submit Feedback
                    </button>
                    <button style={cancelBtn} onClick={() => setActiveReviewId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {review.feedback && activeReviewId !== review.id && (
                <div style={submittedBadge}>✓ Feedback Submitted</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


const navbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 10%",
  background: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  marginBottom: "30px",
};

const container = {
  maxWidth: "700px",
  margin: "0 auto",
  padding: "0 20px",
};

const card = {
  background: "#ffffff",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e5e7eb",
};

const feedbackSection = {
  marginTop: "20px",
  paddingTop: "15px",
  borderTop: "1px solid #eee",
};

const textarea = {
  width: "100%",
  height: "100px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const btn = {
  padding: "8px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const submitBtn = { ...btn, background: "#10b981" };
const cancelBtn = { ...btn, background: "#ef4444" };

const logoutBtn = {
  padding: "6px 15px",
  background: "transparent",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};

const submittedBadge = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#059669",
  fontWeight: "bold",
};

export default EmployeeDash;