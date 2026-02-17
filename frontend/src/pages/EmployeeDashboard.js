import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function EmployeeDash() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/employee/${id}/reviews`
      );
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <h2>My Assigned Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews assigned</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={card}>
            <h4>{review.title}</h4>
            <p>{review.description}</p>
            <Link to={`/feedback/${review.id}`}>
              <button style={btn}>Give Feedback</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

const container = {
  maxWidth: "600px",
  margin: "40px auto",
};

const card = {
  background: "#f4f4f4",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "6px",
};

const btn = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default EmployeeDash;