import { useState, useEffect, useRef } from "react";
import { fetchStudents } from "../services/api"; // Import your API service function

const NAV = ["Features", "How it works", "For schools", "Get started"];

const FEATURES = [
  {
    icon: "⚠️",
    title: "Early risk detection",
    desc: "AI flags at-risk students 4–6 weeks before they fail — not after the exam results are in.",
    color: "#FF6B6B",
  },
  {
    icon: "📊",
    title: "Live analytics dashboard",
    desc: "Attendance trends, grade trajectories, and assignment patterns — all in one view per class.",
    color: "#00D4AA",
  },
  {
    icon: "💡",
    title: "Intervention suggestions",
    desc: "Not just a score — EduTrack tells you exactly what to do: tutoring, parent meeting, counsellor referral.",
    color: "#FFB347",
  },
  {
    icon: "🔍",
    title: "Explainable AI (SHAP)",
    desc: "Every risk score comes with a plain-English breakdown of exactly which factors drove it.",
    color: "#7C6FCD",
  },
  {
    icon: "🏫",
    title: "Multi-role access",
    desc: "Teachers see their class. Admins see the school. Parents see their child. One system, three views.",
    color: "#00B4D8",
  },
  {
    icon: "🔒",
    title: "Secure & private",
    desc: "JWT authentication, role-based access, HTTPS — student data stays where it belongs.",
    color: "#06D6A0",
  },
];

const STEPS = [
  { num: "01", title: "Teacher logs data", desc: "Grades, attendance, assignment scores — entered manually or uploaded as CSV." },
  { num: "02", title: "ML model runs", desc: "HuggingFace Random Forest analyses patterns across all students in the class." },
  { num: "03", title: "Risk scores generated", desc: "Each student gets a 0–100 risk score and a Low / Medium / High label, updated daily." },
  { num: "04", title: "Alerts fired", desc: "When risk rises, the teacher gets an automatic alert with the student's name and reason." },
  { num: "05", title: "Teacher acts", desc: "EduTrack shows the exact intervention to take. Teacher marks it done and sets a follow-up." },
];

function RiskBadge({ level }) {
  const map = {
    High:   { bg: "rgba(255,107,107,0.15)", color: "#FF6B6B" },
    Medium: { bg: "rgba(255,179,71,0.15)",  color: "#FFB347" },
    Low:    { bg: "rgba(0,212,170,0.15)",   color: "#00D4AA" },
  };
  const s = map[level] || map.Low;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 20, fontFamily: "Inter, sans-serif", whiteSpace: "nowrap"
    }}>{level}</span>
  );
}

export default function Landing({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [students, setStudents] = useState([]); // Dynamic state for database data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Fetch student data from the Django database on component load
  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students from server:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F7F9FC", color: "#0F1B3C", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        @media (max-width: 700px) {
          .hero-grid { flex-direction: column !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-row { flex-direction: column !important; }
          .stat-row { flex-direction: column !important; gap: 24px !important; }
          .nav-links { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(15,27,60,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.3s", padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.07)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#00D4AA,#0070F3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📈</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#F7F9FC", letterSpacing: -0.5 }}>EduTrack</span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 32 }}>
          {NAV.slice(0, 3).map(n => (
            <a key={n} href={`#${n.toLowerCase().replace(/ /g, "-")}`}
              style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
            >{n}</a>
          ))}
        </div>
        <button onClick={onGetStarted} style={{
          background: "#00D4AA", color: "#0F1B3C", fontSize: 13, fontWeight: 700,
          padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer"
        }}>Sign In / Register</button>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg,#0F1B3C 0%,#0D2240 60%,#0A2A1F 100%)", minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 5% 80px" }}>
        <div className="hero-grid" style={{ display: "flex", gap: 60, alignItems: "center", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,212,170,0.1)", border: "0.5px solid rgba(0,212,170,0.3)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4AA", display: "inline-block" }}></span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#00D4AA", letterSpacing: 0.5 }}>AI-Powered · HuggingFace + Django</span>
            </div>
            <h1 style={{ fontSize: "clamp(36px,5vw,62px)", fontWeight: 900, color: "#F7F9FC", lineHeight: 1.08, letterSpacing: -2, marginBottom: 24 }}>
              Know which students<br />
              <span style={{ color: "#00D4AA" }}>need help</span><br />
              before they fail.
            </h1>
            <p style={{ fontSize: 17, color: "#94A3B8", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              EduTrack uses machine learning to predict dropout risk weeks in advance — giving teachers the time and guidance to actually make a difference.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={onGetStarted} style={{ background: "#00D4AA", color: "#0F1B3C", fontWeight: 700, fontSize: 15, padding: "13px 28px", borderRadius: 10, border: "none", cursor: "pointer" }}>
                Get Started →
              </button>
              <a href="#how-it-works" style={{ background: "rgba(255,255,255,0.06)", color: "#F7F9FC", fontWeight: 600, fontSize: 15, padding: "13px 28px", borderRadius: 10, textDecoration: "none", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                See how it works
              </a>
            </div>
            <div className="stat-row" style={{ display: "flex", gap: 36, marginTop: 48 }}>
              {[["4–6 wks", "earlier detection"], ["80%+", "test coverage"], ["3 roles", "teacher · admin · parent"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#F7F9FC", fontFamily: "JetBrains Mono, monospace" }}>{v}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HERO PREVIEW CARD - FULLY DYNAMIC DATABASE DATA */}
          <div style={{ flexShrink: 0, width: 380 }}>
            <div style={{ background: "#0D1F3C", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#F7F9FC" }}>Class Risk Overview</span>
                <span style={{ fontSize: 11, color: "#64748B" }}>{students.length} students</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 55px 55px 55px 64px", gap: 4, paddingBottom: 8, borderBottom: "0.5px solid rgba(255,255,255,0.05)", marginBottom: 8 }}>
                {["Student", "Attend", "Grade", "Risk", "Level"].map(h => (
                  <span key={h} style={{ fontSize: 10, color: "#475569", fontWeight: 500, textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {loading ? (
                <div style={{ color: "#94A3B8", textAlign: "center", padding: "20px 0", fontSize: 13 }}>Loading server data...</div>
              ) : students.length === 0 ? (
                <div style={{ color: "#94A3B8", textAlign: "center", padding: "20px 0", fontSize: 13 }}>No student records found.</div>
              ) : (
                students.map((s) => {
                  const attendVal = s.attendance ?? s.attend ?? 0;
                  const gradeVal = s.grade_score ?? s.grade ?? 0;
                  const riskVal = s.risk_score ?? s.risk ?? 0;
                  const levelVal = s.risk_level ?? s.level ?? "Low";

                  return (
                    <div key={s.id || s.name} style={{ display: "grid", gridTemplateColumns: "1fr 55px 55px 55px 64px", gap: 4, alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.03)" }}>
                      <span style={{ fontSize: 12, color: "#CBD5E1", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                      <span style={{ fontSize: 12, fontFamily: "JetBrains Mono", color: attendVal < 60 ? "#FF6B6B" : "#94A3B8" }}>{attendVal}%</span>
                      <span style={{ fontSize: 12, fontFamily: "JetBrains Mono", color: gradeVal < 50 ? "#FF6B6B" : "#94A3B8" }}>{gradeVal}</span>
                      <span style={{ fontSize: 13, fontFamily: "JetBrains Mono", color: riskVal > 70 ? "#FF6B6B" : "#FFB347", fontWeight: 700 }}>{riskVal}</span>
                      <RiskBadge level={levelVal} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{ background: "#F7F9FC", padding: "88px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#00D4AA", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>What EduTrack does</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#0F1B3C" }}>Built for teachers. Powered by AI.</h2>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F1B3C", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: "#0F1B3C", padding: "88px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#00D4AA", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>The process</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#F7F9FC" }}>From data to action in 5 steps</h2>
          </div>
          <div className="steps-row" style={{ display: "flex", gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, padding: "0 10px" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#00D4AA", fontWeight: 700, marginBottom: 12 }}>{s.num}</div>
                <div style={{ width: 40, height: 2, background: "#00D4AA", marginBottom: 16 }} />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F7F9FC", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    <footer style={{ background: "#0B1628", padding: "28px 5%", textAlign: "center", color: "#475569", fontSize: 12 }}>
  &copy; {new Date().getFullYear()} EduTrack. All rights reserved.
</footer>
    </div>
  );
}