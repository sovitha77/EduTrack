import { useState } from "react";
import API from "../services/api";

function Login({ onLoginSuccess, switchToRegister }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!credentials.username || !credentials.password) {
      setError("Please enter both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/accounts/login/", credentials);
      localStorage.setItem("access", res.data.tokens.access);
      localStorage.setItem("refresh", res.data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (err) {
      setError("Invalid username or password configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="brand-mark"><div className="brand-icon">📈</div> EduTrack</div>
        <div>
          <h2 className="left-headline">Predict risk.<br /><span>Act early.</span></h2>
          <p className="left-sub">EduTrack flags at-risk students weeks before they fail — giving teachers time to help.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your EduTrack account</p>
          {error && <div className="auth-alert error show"><i className="bi bi-exclamation-circle-fill me-2"></i>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" name="username" className="form-control" placeholder="e.g. asmita_teacher" onChange={handleChange} />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-control" placeholder="Your password" onChange={handleChange} />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <div className="spinner-border spinner-border-sm"></div> : "Sign In"}
            </button>
          </form>
          <div className="divider-or">or</div>
          <p className="switch-text">Need an account? <span className="switch-link" onClick={switchToRegister}>Create one →</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;