import { Link } from "react-router-dom";

function Navbar({ user, setUser }) {
  return (
    <div className="navbar">
      {user.role === "admin" && (
        <>
          <Link to="/">Employees</Link>
          <Link to="/create-review">Create Review</Link>
        </>
      )}

      {user.role === "employee" && (
        <>
          <Link to="/">My Reviews</Link>
        </>
      )}

      <button
        className="logout-btn"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;