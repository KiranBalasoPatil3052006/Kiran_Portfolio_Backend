// Helper module that returns the complete self-contained Glassmorphic Dashboard HTML
function getDashboardHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Visitor Analytics | Live Dashboard</title>
    <meta name="description" content="Real-time visitor tracking and engagement analytics for portfolio website.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    <style>
:root {
  --bg-primary: #0a0e1a;
  --bg-secondary: #0f172a;
  --bg-card: rgba(17, 24, 39, 0.75);
  --bg-card-hover: rgba(30, 41, 59, 0.85);
  --border-card: rgba(255, 255, 255, 0.08);
  --border-card-hover: rgba(0, 242, 254, 0.35);
  --accent-cyan: #00f2fe;
  --accent-blue: #4facfe;
  --accent-purple: #8b5cf6;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --gradient-cyan-blue: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  --gradient-purple: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  --gradient-emerald: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-amber: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  --shadow-glow-cyan: 0 0 25px rgba(0, 242, 254, 0.15);
  --shadow-card: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
  --font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  line-height: 1.6;
}

.ambient-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  pointer-events: none;
  opacity: 0.45;
}
.glow-1 {
  width: 500px; height: 500px; top: -100px; left: -100px;
  background: radial-gradient(circle, rgba(0, 242, 254, 0.3) 0%, rgba(79, 172, 254, 0.05) 70%);
}
.glow-2 {
  width: 600px; height: 600px; top: 30%; right: -150px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(236, 72, 153, 0.05) 70%);
}

.app-container {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 60px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border-card);
  margin-bottom: 32px;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo-wrapper {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.brand-logo-fallback {
  color: var(--accent-cyan);
  font-size: 24px;
}

.brand-title {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-card);
}

.status-live {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.25);
}

.status-db {
  background: rgba(79, 172, 254, 0.1);
  color: #60a5fa;
  border-color: rgba(79, 172, 254, 0.25);
}
.status-db.connected {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.25);
}
.status-db.error {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.25);
}

.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #34d399; box-shadow: 0 0 10px #34d399;
  animation: pulseAnimation 2s infinite;
}

@keyframes pulseAnimation {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: var(--radius-md);
  font-size: 13px; font-weight: 600; font-family: var(--font-body);
  cursor: pointer; border: 1px solid transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: var(--gradient-cyan-blue); color: #02111d;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.25);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05); color: var(--text-primary);
  border-color: var(--border-card);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  padding: 22px;
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-card-hover);
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.6), var(--shadow-glow-cyan);
}

.metric-card-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px;
}

.metric-label {
  font-size: 13px; font-weight: 600; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.5px;
}

.metric-icon-box {
  width: 40px; height: 40px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.metric-icon-box.cyan { background: rgba(0, 242, 254, 0.12); color: var(--accent-cyan); }
.metric-icon-box.emerald { background: rgba(16, 185, 129, 0.12); color: var(--accent-emerald); }
.metric-icon-box.amber { background: rgba(245, 158, 11, 0.12); color: var(--accent-amber); }
.metric-icon-box.purple { background: rgba(139, 92, 246, 0.12); color: var(--accent-purple); }

.metric-value {
  font-family: var(--font-heading);
  font-size: 36px; font-weight: 800; line-height: 1.1;
  margin-bottom: 12px; letter-spacing: -0.5px;
}

.metric-footer { display: flex; flex-direction: column; gap: 8px; }
.metric-subtext { font-size: 12px; color: var(--text-muted); }

.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: var(--radius-full);
  font-size: 11px; font-weight: 600; width: fit-content;
}
.badge-cyan { background: rgba(0, 242, 254, 0.1); color: var(--accent-cyan); }
.badge-emerald { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
.badge-amber { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }

.progress-bar-container {
  width: 100%; height: 6px; background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full); overflow: hidden;
}
.progress-bar-fill {
  height: 100%; background: var(--gradient-purple);
  border-radius: var(--radius-full); transition: width 0.6s ease;
}

.table-container {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(16px);
  overflow: hidden;
}

.table-header-toolbar {
  padding: 22px 24px; display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 18px;
  border-bottom: 1px solid var(--border-card);
}

.table-title { font-family: var(--font-heading); font-size: 18px; font-weight: 700; }
.table-subtitle { font-size: 12px; color: var(--text-muted); }

.table-controls { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

.search-box { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; color: var(--text-muted); font-size: 13px; }
.search-box input {
  background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-card);
  border-radius: var(--radius-md); padding: 8px 32px 8px 36px;
  color: var(--text-primary); font-family: var(--font-body); font-size: 13px;
  width: 220px; transition: all 0.2s ease;
}
.search-box input:focus {
  outline: none; border-color: var(--accent-cyan);
  background: rgba(255, 255, 255, 0.07); width: 260px;
}

.filter-tabs {
  display: flex; background: rgba(255, 255, 255, 0.04);
  padding: 3px; border-radius: var(--radius-md); border: 1px solid var(--border-card);
}
.filter-tab {
  background: transparent; border: none; color: var(--text-secondary);
  padding: 6px 14px; border-radius: var(--radius-sm); font-size: 12px;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
}
.filter-tab.active { background: rgba(255, 255, 255, 0.1); color: #ffffff; }

.table-responsive { width: 100%; overflow-x: auto; min-height: 200px; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table thead { background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid var(--border-card); }
.data-table th {
  padding: 14px 20px; font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted);
}
.data-table td {
  padding: 16px 20px; font-size: 13.5px; border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.data-table tbody tr:hover { background: rgba(0, 242, 254, 0.03); }
.text-right { text-align: right; }

.visitor-cell { display: flex; align-items: center; gap: 12px; }
.visitor-avatar {
  width: 34px; height: 34px; border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; color: var(--accent-cyan);
}
.visitor-avatar.skipped { background: rgba(245, 158, 11, 0.12); color: var(--accent-amber); }

.visitor-name { font-weight: 600; color: var(--text-primary); }
.visitor-id-tag { font-size: 11px; color: var(--text-muted); font-family: monospace; }

.status-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: var(--radius-full); font-size: 12px; font-weight: 600;
}
.status-tag.tag-entered { background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.25); }
.status-tag.tag-skipped { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.25); }

.time-full { color: var(--text-secondary); font-size: 12.5px; }
.time-relative { color: var(--text-muted); font-size: 12px; font-weight: 500; }

.empty-state { padding: 60px 20px; text-align: center; }
.empty-state-icon { font-size: 40px; color: var(--text-muted); margin-bottom: 14px; opacity: 0.6; }
.empty-state-title { font-family: var(--font-heading); font-size: 17px; color: var(--text-primary); margin-bottom: 6px; }
.empty-state-desc { font-size: 13px; color: var(--text-muted); }

.table-footer {
  padding: 16px 24px; background: rgba(255, 255, 255, 0.015);
  border-top: 1px solid var(--border-card); display: flex;
  justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted);
}

.toast-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 1000;
  display: flex; flex-direction: column; gap: 12px; max-width: 360px;
}
.toast {
  background: rgba(15, 23, 42, 0.95); border: 1px solid var(--border-card);
  border-radius: var(--radius-md); padding: 14px 18px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px); display: flex; align-items: flex-start; gap: 12px;
  animation: toastSlideIn 0.3s ease;
}
.toast.toast-new-visitor { border-left: 3px solid var(--accent-cyan); }
.toast.toast-success { border-left: 3px solid var(--accent-emerald); }
.toast.toast-error { border-left: 3px solid var(--accent-rose); }
.toast-title { font-weight: 600; font-size: 13px; color: var(--text-primary); }
.toast-msg { font-size: 12px; color: var(--text-secondary); }

@keyframes toastSlideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
.spinning { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .app-container { padding: 20px 14px 40px; }
  .app-header { flex-direction: column; align-items: flex-start; }
  .header-actions { width: 100%; justify-content: flex-start; }
  .table-header-toolbar { flex-direction: column; align-items: flex-start; }
  .table-controls { width: 100%; flex-direction: column; align-items: stretch; }
  .search-box input { width: 100%; }
}
    </style>
</head>
<body>
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>

    <div class="app-container">
        <header class="app-header">
            <div class="brand-section">
                <div class="brand-logo-wrapper">
                    <div class="brand-logo-fallback">
                        <i class="fa-solid fa-chart-simple"></i>
                    </div>
                </div>
                <div class="brand-info">
                    <h1 class="brand-title">Portfolio Analytics</h1>
                    <p class="brand-subtitle">Real-time visitor tracking & engagement metrics</p>
                </div>
            </div>

            <div class="header-actions">
                <div class="status-pill status-live" id="liveStatusPill">
                    <span class="pulse-dot"></span>
                    <span id="liveStatusText">Live Feed</span>
                </div>
                <div class="status-pill status-db" id="dbStatusPill">
                    <i class="fa-solid fa-database"></i>
                    <span id="dbStatusText">Checking DB...</span>
                </div>
                <button class="btn btn-secondary" id="refreshBtn" title="Refresh data">
                    <i class="fa-solid fa-rotate" id="refreshIcon"></i>
                    <span>Refresh</span>
                </button>
                <button class="btn btn-primary" id="testVisitorBtn" title="Simulate a new visitor">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>Test Visitor</span>
                </button>
            </div>
        </header>

        <section class="metrics-grid">
            <div class="metric-card">
                <div class="metric-card-header">
                    <span class="metric-label">Total Visitors</span>
                    <div class="metric-icon-box cyan"><i class="fa-solid fa-users"></i></div>
                </div>
                <div class="metric-value" id="totalVisitors">0</div>
                <div class="metric-footer">
                    <span class="badge badge-cyan"><i class="fa-solid fa-globe"></i> All Time</span>
                    <span class="metric-subtext">Total recorded sessions</span>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-card-header">
                    <span class="metric-label">Entered Name</span>
                    <div class="metric-icon-box emerald"><i class="fa-solid fa-id-card"></i></div>
                </div>
                <div class="metric-value" id="enteredVisitors">0</div>
                <div class="metric-footer">
                    <span class="badge badge-emerald"><i class="fa-solid fa-circle-check"></i> Active</span>
                    <span class="metric-subtext">Engaged with preloader</span>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-card-header">
                    <span class="metric-label">Skipped Preloader</span>
                    <div class="metric-icon-box amber"><i class="fa-solid fa-forward-step"></i></div>
                </div>
                <div class="metric-value" id="skippedVisitors">0</div>
                <div class="metric-footer">
                    <span class="badge badge-amber"><i class="fa-solid fa-bolt"></i> Fast Path</span>
                    <span class="metric-subtext">Direct to portfolio</span>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-card-header">
                    <span class="metric-label">Engagement Rate</span>
                    <div class="metric-icon-box purple"><i class="fa-solid fa-chart-pie"></i></div>
                </div>
                <div class="metric-value" id="engagementRate">0%</div>
                <div class="metric-footer">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" id="engagementBar" style="width: 0%;"></div>
                    </div>
                    <span class="metric-subtext" id="engagementRatio">0 of 0 visitors</span>
                </div>
            </div>
        </section>

        <main class="table-container">
            <div class="table-header-toolbar">
                <div>
                    <h2 class="table-title">Recent Visitor Logs</h2>
                    <span class="table-subtitle" id="tableCountText">Showing latest records</span>
                </div>
                <div class="table-controls">
                    <div class="search-box">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="searchInput" placeholder="Search visitor..." autocomplete="off">
                    </div>
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-filter="all">All</button>
                        <button class="filter-tab" data-filter="entered">Entered</button>
                        <button class="filter-tab" data-filter="skipped">Skipped</button>
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 70px;">#</th>
                            <th>Visitor</th>
                            <th style="width: 170px;">Status</th>
                            <th style="width: 220px;">Timestamp</th>
                            <th style="width: 140px;" class="text-right">Relative Time</th>
                        </tr>
                    </thead>
                    <tbody id="visitorTableBody"></tbody>
                </table>

                <div class="empty-state" id="emptyState" style="display: none;">
                    <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
                    <h3 class="empty-state-title">No Visitor Records Found</h3>
                    <p class="empty-state-desc">No records match your criteria.</p>
                </div>
            </div>

            <footer class="table-footer">
                <span id="lastUpdatedTimestamp">Updated: Just now</span>
                <span><i class="fa-solid fa-bell"></i> Real-time Monitoring</span>
            </footer>
        </main>
    </div>

    <div class="toast-container" id="toastContainer"></div>

    <script>
let visitorsData = [];
let lastVisitorId = null;
let currentFilter = "all";
let currentSearch = "";
let isInitialLoad = true;

const totalEl = document.getElementById("totalVisitors");
const enteredEl = document.getElementById("enteredVisitors");
const skippedEl = document.getElementById("skippedVisitors");
const rateEl = document.getElementById("engagementRate");
const rateBarEl = document.getElementById("engagementBar");
const rateRatioEl = document.getElementById("engagementRatio");
const tableBody = document.getElementById("visitorTableBody");
const emptyState = document.getElementById("emptyState");
const tableCountText = document.getElementById("tableCountText");
const searchInput = document.getElementById("searchInput");
const filterTabs = document.querySelectorAll(".filter-tab");
const refreshBtn = document.getElementById("refreshBtn");
const refreshIcon = document.getElementById("refreshIcon");
const testVisitorBtn = document.getElementById("testVisitorBtn");
const dbStatusPill = document.getElementById("dbStatusPill");
const dbStatusText = document.getElementById("dbStatusText");
const lastUpdatedTimestamp = document.getElementById("lastUpdatedTimestamp");
const toastContainer = document.getElementById("toastContainer");

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  if (diffInSeconds < 30) return "Just now";
  if (diffInSeconds < 60) return diffInSeconds + "s ago";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return diffInMinutes + "m ago";
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return diffInHours + "h ago";
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return diffInDays + "d ago";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getInitials(name) {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    if (data.database && data.database.status === "connected") {
      dbStatusPill.className = "status-pill status-db connected";
      dbStatusText.textContent = "MongoDB Connected";
    } else {
      dbStatusPill.className = "status-pill status-db error";
      dbStatusText.textContent = "DB Disconnected";
    }
  } catch (err) {
    dbStatusPill.className = "status-pill status-db error";
    dbStatusText.textContent = "Server Offline";
  }
}

async function loadStats(isManual = false) {
  if (isManual && refreshIcon) refreshIcon.classList.add("spinning");
  try {
    const res = await fetch("/api/visitors");
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Fetch failed");

    visitorsData = Array.isArray(data.visitors) ? data.visitors : [];
    const total = typeof data.total === "number" ? data.total : visitorsData.length;
    const skipped = typeof data.skippedCount === "number" ? data.skippedCount : visitorsData.filter(v => v.skipped).length;
    const entered = typeof data.enteredCount === "number" ? data.enteredCount : total - skipped;
    const rate = total > 0 ? Math.round((entered / total) * 100) : 0;

    totalEl.textContent = total.toLocaleString();
    enteredEl.textContent = entered.toLocaleString();
    skippedEl.textContent = skipped.toLocaleString();
    rateEl.textContent = rate + "%";
    rateBarEl.style.width = rate + "%";
    rateRatioEl.textContent = entered + " of " + total + " engaged";

    renderTable();

    if (visitorsData.length > 0) {
      const latest = visitorsData[0];
      if (!isInitialLoad && lastVisitorId && latest._id !== lastVisitorId) {
        showToast("New Visitor Event", latest.name + (latest.skipped ? " skipped preloader" : " entered name"), "new-visitor");
      }
      lastVisitorId = latest._id;
    }
    lastUpdatedTimestamp.textContent = "Updated: " + new Date().toLocaleTimeString();
  } catch (err) {
    console.error("loadStats Error:", err);
    if (isManual) showToast("Error", "Could not load visitors", "error");
  } finally {
    isInitialLoad = false;
    if (refreshIcon) setTimeout(() => refreshIcon.classList.remove("spinning"), 600);
  }
}

function renderTable() {
  const query = currentSearch.toLowerCase().trim();
  const filtered = visitorsData.filter(v => {
    if (currentFilter === "entered" && v.skipped) return false;
    if (currentFilter === "skipped" && !v.skipped) return false;
    if (query) {
      const name = (v.name || "").toLowerCase();
      const status = (v.skipped ? "skipped" : "entered").toLowerCase();
      return name.includes(query) || status.includes(query);
    }
    return true;
  });

  tableBody.innerHTML = "";
  if (filtered.length === 0) {
    emptyState.style.display = "block";
    tableCountText.textContent = "0 records";
    return;
  }
  emptyState.style.display = "none";
  tableCountText.textContent = "Showing " + filtered.length + " of " + visitorsData.length + " records";

  filtered.forEach((v, index) => {
    const row = document.createElement("tr");
    const isSkipped = Boolean(v.skipped);
    const dateObj = new Date(v.visitedAt || Date.now());
    const fullDate = dateObj.toLocaleString();
    const relTime = formatRelativeTime(v.visitedAt || Date.now());
    const initials = getInitials(v.name || (isSkipped ? "Skip" : "Guest"));
    const shortId = v._id ? "#" + v._id.slice(-6) : "#" + (index + 1);

    row.innerHTML = \`
      <td><strong>\${index + 1}</strong></td>
      <td>
        <div class="visitor-cell">
          <div class="visitor-avatar \${isSkipped ? 'skipped' : ''}">\${initials}</div>
          <div>
            <div class="visitor-name">\${escapeHtml(v.name || (isSkipped ? "Anonymous Visitor" : "Visitor"))}</div>
            <div class="visitor-id-tag">\${shortId}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="status-tag \${isSkipped ? 'tag-skipped' : 'tag-entered'}">
          <i class="fa-solid \${isSkipped ? 'fa-forward-step' : 'fa-circle-check'}"></i>
          \${isSkipped ? "Skipped Preloader" : "Entered Name"}
        </span>
      </td>
      <td><span class="time-full">\${fullDate}</span></td>
      <td class="text-right"><span class="time-relative" title="\${fullDate}">\${relTime}</span></td>
    \`;
    tableBody.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(title, message, type = "success") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.innerHTML = \`
    <div class="toast-content">
      <div class="toast-title">\${escapeHtml(title)}</div>
      <div class="toast-msg">\${escapeHtml(message)}</div>
    </div>
  \`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

if (refreshBtn) refreshBtn.addEventListener("click", () => { checkHealth(); loadStats(true); });
if (testVisitorBtn) {
  testVisitorBtn.addEventListener("click", async () => {
    testVisitorBtn.disabled = true;
    try {
      const res = await fetch("/api/visitors/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast("Success", "Created test visitor: " + data.visitor.name);
        await loadStats();
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      testVisitorBtn.disabled = false;
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderTable();
  });
}

filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.getAttribute("data-filter") || "all";
    renderTable();
  });
});

checkHealth();
loadStats();
setInterval(loadStats, 5000);
setInterval(checkHealth, 30000);
    </script>
</body>
</html>`;
}

module.exports = getDashboardHtml;
