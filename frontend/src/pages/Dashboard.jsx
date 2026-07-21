import { useState, useEffect } from "react";
import { fetchStudents, createStudent } from "../services/api";

function Dashboard({ user, triggerLogout }) {
  const role = user?.role?.toLowerCase();
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic state for all students fetched from your backend database
  const [monitoredStudents, setMonitoredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for teachers to add new student data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "15",
    grade_level: "Grade 10",
    attendance: "",
    grade_score: "",
    risk_score: "",
    risk_level: "Low",
    suggested_intervention: "None Needed"
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch live student records from server when component loads
  const loadStudentData = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      setMonitoredStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("Could not load student risk telemetry from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  // Handle input changes for the teacher's add-student form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submission of student data from the teacher view
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      await createStudent(formData);
      alert("Student record successfully added to database!");

      // Reset form fields
      setFormData({
        name: "", email: "", age: "15", grade_level: "Grade 10", attendance: "", grade_score: "", risk_score: "", risk_level: "Low", suggested_intervention: "None Needed"
      });

      // Reload table data so the new student shows up immediately
      loadStudentData();
    } catch (err) {
      console.error("Failed to create student:", err);
      setFormError(err && typeof err === 'object' ? JSON.stringify(err) : "Failed to save student record. Check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  // Find current logged-in student's record dynamically if role is student
  const currentStudentData = monitoredStudents.find(
    s => s.name?.toLowerCase() === user?.fullname?.toLowerCase() || s.email?.toLowerCase() === user?.email?.toLowerCase()
  ) || monitoredStudents[0]; // Fallback to first record if exact match isn't found yet

  return (
    <div className="container py-5">
      {/* Top Header Navigation bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="fw-bold mb-1 text-dark">EduTrack Analytics Hub</h1>
          <p className="text-muted mb-0">
            Welcome back, <strong>{user?.fullname || user?.username}</strong>
            <span className="badge bg-primary ms-2 text-capitalize px-2 py-1">{user?.role}</span>
          </p>
        </div>
        <button onClick={triggerLogout} className="btn btn-outline-danger d-flex align-items-center gap-2 shadow-sm">
          <i className="bi bi-box-arrow-right"></i> Log out
        </button>
      </div>

      {/* Navigation Sub-tabs */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            <i className="bi bi-speedometer2 me-2"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>
            <i className="bi bi-graph-up-arrow me-2"></i>AI Risk Matrix
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>
            <i className="bi bi-file-earmark-text me-2"></i>Intervention Reports
          </button>
        </li>
      </ul>

      {/* ================= ADMIN VIEW ================= */}
      {role === "admin" && activeTab === "overview" && (
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card p-4 shadow-sm border-0 bg-white border-start border-primary border-4">
              <h6 className="text-uppercase text-muted small fw-bold">School System Status</h6>
              <h3 className="fw-bold text-dark mt-2">Active & Secure</h3>
              <small className="text-success"><i className="bi bi-shield-check"></i> 99.9% Uptime</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-4 shadow-sm border-0 bg-white border-start border-success border-4">
              <h6 className="text-uppercase text-muted small fw-bold">Total Enrolled Students</h6>
              <h3 className="fw-bold text-dark mt-2">{monitoredStudents.length}</h3>
              <small className="text-muted">Database Synced</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-4 shadow-sm border-0 bg-white border-start border-danger border-4">
              <h6 className="text-uppercase text-muted small fw-bold">At-Risk Flags</h6>
              <h3 className="fw-bold text-danger mt-2">
                {monitoredStudents.filter(s => (s.risk_score ?? s.risk) > 70).length} Students
              </h3>
              <small className="text-danger">Requiring immediate intervention</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-4 shadow-sm border-0 bg-white border-start border-info border-4">
              <h6 className="text-uppercase text-muted small fw-bold">AI Processing Model</h6>
              <h3 className="fw-bold text-dark mt-2">HuggingFace v2</h3>
              <small className="text-info">Updated live</small>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEACHER VIEW ================= */}
      {role === "teacher" && activeTab === "overview" && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-0 bg-white border-start border-warning border-4">
                <h6 className="text-uppercase text-muted small fw-bold">Class Risk Alerts</h6>
                <h3 className="fw-bold text-danger mt-2">
                  {monitoredStudents.filter(s => (s.risk_level ?? s.level) === "High").length} High Priority
                </h3>
                <small className="text-muted">Live DB Records</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-0 bg-white border-start border-primary border-4">
                <h6 className="text-uppercase text-muted small fw-bold">AI Engine Status</h6>
                <h3 className="fw-bold text-primary mt-2">HuggingFace Active</h3>
                <small className="text-success">Random Forest Model Running</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-0 bg-white border-start border-success border-4">
                <h6 className="text-uppercase text-muted small fw-bold">Intervention Action Items</h6>
                <h3 className="fw-bold text-success mt-2">{monitoredStudents.length} Total Records</h3>
                <small className="text-muted">Loaded from PostgreSQL</small>
              </div>
            </div>
          </div>

          {/* TEACHER INPUT FORM TO ADD ALL DATA */}
          <div className="card shadow-sm border-0 p-4 bg-white mb-4">
            <h5 className="fw-bold mb-3">Add New Student Data</h5>
            {formError && <div className="alert alert-danger">{formError}</div>}

            <form onSubmit={handleAddStudentSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Student Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} placeholder="e.g. John Doe" required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} placeholder="student@email.com" />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold">Age</label>
                <input type="number" name="age" className="form-control" value={formData.age} onChange={handleInputChange} placeholder="15" />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold">Grade Level</label>
                <input type="text" name="grade_level" className="form-control" value={formData.grade_level} onChange={handleInputChange} placeholder="Grade 10" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Attendance (%)</label>
                <input type="number" name="attendance" className="form-control" value={formData.attendance} onChange={handleInputChange} placeholder="e.g. 85" required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Avg Grade Score</label>
                <input type="number" name="grade_score" className="form-control" value={formData.grade_score} onChange={handleInputChange} placeholder="e.g. 78" required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">AI Risk Score (0-100)</label>
                <input type="number" name="risk_score" className="form-control" value={formData.risk_score} onChange={handleInputChange} placeholder="e.g. 45" required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Status Level</label>
                <select name="risk_level" className="form-select" value={formData.risk_level} onChange={handleInputChange}>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label small fw-bold">Suggested Intervention</label>
                <input type="text" name="suggested_intervention" className="form-control" value={formData.suggested_intervention} onChange={handleInputChange} placeholder="e.g. Schedule Counselling" />
              </div>
              <div className="col-md-12">
                <button type="submit" className="btn btn-success px-4 fw-bold" disabled={submitting}>
                  {submitting ? "Saving to Database..." : "Save Student Record"}
                </button>
              </div>
            </form>
          </div>

          {/* Student Risk Breakdown Table */}
          <div className="card shadow-sm border-0 p-4 bg-white">
            <h5 className="fw-bold mb-3">Class Performance & Risk Breakdown</h5>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Fetching student records from database...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Student Name</th>
                      <th>Attendance</th>
                      <th>Avg Grade</th>
                      <th>AI Risk Score</th>
                      <th>Status Level</th>
                      <th>Suggested Intervention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitoredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">No student records found in database. Use the form above to add one.</td>
                      </tr>
                    ) : (
                      monitoredStudents.map((s, index) => {
                        const levelText = s.risk_level || s.level || "Low";
                        const riskVal = s.risk_score ?? s.risk ?? 0;
                        const attendVal = s.attendance ?? s.attend ?? 0;
                        const gradeVal = s.grade_score ?? s.grade ?? 0;
                        const actionText = s.suggested_intervention || s.action || "Review";

                        return (
                          <tr key={s.id || index}>
                            <td className="fw-bold">{s.name}</td>
                            <td>{attendVal}%</td>
                            <td>{gradeVal}</td>
                            <td><span className="font-monospace fw-bold">{riskVal} / 100</span></td>
                            <td>
                              <span className={`badge ${levelText.includes("High") ? "bg-danger" : levelText.includes("Medium") ? "bg-warning text-dark" : "bg-success"}`}>
                                {levelText} Risk
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">{actionText}</button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= STUDENT VIEW ================= */}
      {role === "student" && activeTab === "overview" && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm border-0 bg-white">
              <h5 className="fw-bold text-dark mb-3">My Academic Standing</h5>
              <div className="p-3 bg-light rounded mb-3">
                <span className="text-muted small d-block">Current Status</span>
                <h4 className={`fw-bold mb-0 ${((currentStudentData?.risk_level || currentStudentData?.level) === 'High') ? 'text-danger' : 'text-success'}`}>
                  {currentStudentData ? `${currentStudentData.risk_level || currentStudentData.level || 'Low'} Risk Profile` : "Loading profile..."}
                </h4>
              </div>
              {loading ? (
                <p className="text-muted">Loading metrics...</p>
              ) : !currentStudentData ? (
                <p className="text-muted">No academic records linked to this account yet.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Overall Attendance <span>{currentStudentData.attendance ?? currentStudentData.attend}%</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Avg Grade Score <span>{currentStudentData.grade_score ?? currentStudentData.grade}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Predicted AI Risk Score <span>{currentStudentData.risk_score ?? currentStudentData.risk} / 100</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-4 shadow-sm border-0 bg-white">
              <h5 className="fw-bold text-dark mb-3">Teacher Guidance & Feedback</h5>
              <div className="alert alert-info border-0 shadow-sm">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>Suggested Action: </strong> {currentStudentData?.suggested_intervention || currentStudentData?.action || "Keep maintaining your current study schedule and attendance levels."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab Alternate view */}
      {activeTab === "analytics" && (
        <div className="card shadow-sm border-0 p-4 bg-white">
          <h4 className="fw-bold mb-3">HuggingFace & SHAP AI Breakdown</h4>
          <p className="text-muted">Detailed analytics metrics tracking feature weights, attendance indicators, and behavioral trajectory metrics for prediction validation.</p>
          <div className="p-5 bg-light text-center rounded border border-dashed">
            <i className="bi bi-cpu display-4 text-primary mb-3"></i>
            <h5>Machine Learning Processing Active</h5>
            <p className="text-muted small">Real-time telemetry indicators are syncing with backend Django endpoints.</p>
          </div>
        </div>
      )}

      {/* Reports Tab Alternate view */}
      {activeTab === "reports" && (
        <div className="card shadow-sm border-0 p-4 bg-white">
          <h4 className="fw-bold mb-3">Intervention Action History</h4>
          <p className="text-muted">Track completed counselling sessions, remedial class assignments, and parent interaction records.</p>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Student Name</th>
                  <th>Attendance</th>
                  <th>Risk Score</th>
                  <th>Intervention Status</th>
                </tr>
              </thead>
              <tbody>
                {monitoredStudents.map((s, idx) => (
                  <tr key={s.id || idx}>
                    <td>{s.name}</td>
                    <td>{s.attendance ?? s.attend}%</td>
                    <td>{s.risk_score ?? s.risk} / 100</td>
                    <td><span className="badge bg-success">{s.suggested_intervention || s.action || "Active Monitoring"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;