import { useState } from "react";
import API from "../services/api";

function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({ username: "", fullname: "", password: "", role: "teacher" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username || !formData.fullname || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/accounts/register/", formData);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => switchToLogin(), 1500);
    } catch (err) {
      const serverError = err.response?.data;

      if (serverError && typeof serverError === "object") {
        // Dynamically catches and displays specific errors (e.g., short passwords or duplicate usernames)
        if (serverError.password) {
          setError(`Password: ${serverError.password.join(" ")}`);
        } else if (serverError.username) {
          setError(`Username: ${serverError.username.join(" ")}`);
        } else {
          setError("Registration failed. Please check your inputs.");
        }
      } else {
        setError("Network error. Make sure your Django server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="brand-mark"><div className="brand-icon">📈</div> EduTrack</div>
        <div>
          <h2 className="left-headline">Join the future of<br /><span>Student Success.</span></h2>
          <p className="left-sub">Empower your academic team with analytics that help prevent dropouts seamlessly.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-sub">Get started with your tracking dashboard</p>

          {error && <div className="auth-alert error show"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                placeholder="e.g. Asmita Sharma"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="e.g. asmita_teacher"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Choose a strong password (min 8 chars)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
               <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <div className="spinner-border spinner-border-sm"></div> : "Register"}
            </button>
          </form>
          <div className="divider-or">or</div>
          <p className="switch-text">Already have an account? <span className="switch-link" onClick={switchToLogin}>Sign in →</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;