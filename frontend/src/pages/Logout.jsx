import { useEffect } from "react";

function Logout({ onLogoutComplete }) {
  useEffect(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    onLogoutComplete();
  }, [onLogoutComplete]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3"></div>
        <p className="text-muted">Logging out securely...</p>
      </div>
    </div>
  );
}

export default Logout;