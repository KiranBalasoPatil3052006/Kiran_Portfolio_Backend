// State Management
let visitorsData = [];
let lastVisitorId = null;
let currentFilter = "all";
let currentSearch = "";
let isInitialLoad = true;

// DOM Elements
const totalEl = document.getElementById("totalVisitors");
const enteredEl = document.getElementById("enteredVisitors");
const skippedEl = document.getElementById("skippedVisitors");
const rateEl = document.getElementById("engagementRate");
const rateBarEl = document.getElementById("engagementBar");
const rateRatioEl = document.getElementById("engagementRatio");
const tableBody = document.getElementById("visitorTableBody");
const emptyState = document.getElementById("emptyState");
const tableLoading = document.getElementById("tableLoading");
const tableCountText = document.getElementById("tableCountText");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const filterTabs = document.querySelectorAll(".filter-tab");
const refreshBtn = document.getElementById("refreshBtn");
const refreshIcon = document.getElementById("refreshIcon");
const testVisitorBtn = document.getElementById("testVisitorBtn");
const dbStatusPill = document.getElementById("dbStatusPill");
const dbStatusText = document.getElementById("dbStatusText");
const dbAlertBanner = document.getElementById("dbAlertBanner");
const dbAlertMessage = document.getElementById("dbAlertMessage");
const lastUpdatedTimestamp = document.getElementById("lastUpdatedTimestamp");
const toastContainer = document.getElementById("toastContainer");

// Browser Notifications Permission Request
if ("Notification" in window) {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// Format Relative Time (e.g. "Just now", "5m ago", "2h ago")
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 30) return "Just now";
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Generate Avatar Initials
function getInitials(name) {
  if (!name || name.trim() === "") return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Check Health & DB Connectivity
async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.database && data.database.status === "connected") {
      dbStatusPill.className = "status-pill status-db connected";
      dbStatusText.textContent = "MongoDB Connected";
      dbAlertBanner.style.display = "none";
    } else if (data.database && data.database.status === "error") {
      dbStatusPill.className = "status-pill status-db error";
      dbStatusText.textContent = "DB Auth / Network Error";
      dbAlertBanner.style.display = "flex";
      dbAlertMessage.textContent = data.database.error || "Authentication failed. Check MONGO_URI credentials.";
    } else if (data.database && data.database.status === "missing_env_var") {
      dbStatusPill.className = "status-pill status-db warning";
      dbStatusText.textContent = "MONGO_URI Missing";
      dbAlertBanner.style.display = "flex";
      dbAlertMessage.textContent = "MONGO_URI environment variable is missing in Vercel project settings.";
    } else {
      dbStatusPill.className = "status-pill status-db warning";
      dbStatusText.textContent = "Connecting to DB...";
    }
  } catch (err) {
    dbStatusPill.className = "status-pill status-db error";
    dbStatusText.textContent = "Server Offline";
  }
}

// Load Visitor Stats
async function loadStats(isManual = false) {
  if (isManual && refreshIcon) {
    refreshIcon.classList.add("spinning");
  }

  try {
    const res = await fetch("/api/visitors");
    const data = await res.json();

    if (!res.ok || !data.success) {
      if (data.error === "Database Connection Error" || data.message) {
        dbStatusPill.className = "status-pill status-db error";
        dbStatusText.textContent = "DB Connection Error";
        dbAlertBanner.style.display = "flex";
        dbAlertMessage.textContent = data.message || "Failed to query MongoDB.";
      }
      throw new Error(data.message || "Failed to fetch visitor statistics");
    }

    // Update global state
    visitorsData = Array.isArray(data.visitors) ? data.visitors : [];
    const total = typeof data.total === "number" ? data.total : visitorsData.length;
    const skipped = typeof data.skippedCount === "number" ? data.skippedCount : visitorsData.filter(v => v.skipped).length;
    const entered = typeof data.enteredCount === "number" ? data.enteredCount : total - skipped;
    const rate = total > 0 ? Math.round((entered / total) * 100) : 0;

    // Update Metrics Cards
    totalEl.textContent = total.toLocaleString();
    enteredEl.textContent = entered.toLocaleString();
    skippedEl.textContent = skipped.toLocaleString();
    rateEl.textContent = `${rate}%`;
    rateBarEl.style.width = `${rate}%`;
    rateRatioEl.textContent = `${entered} of ${total} engaged`;

    // Render Table
    renderTable();

    // Check for new visitor notification
    if (visitorsData.length > 0) {
      const latest = visitorsData[0];
      if (!isInitialLoad && lastVisitorId && latest._id !== lastVisitorId) {
        handleNewVisitor(latest);
      }
      lastVisitorId = latest._id;
    }

    // Hide Loading Skeleton
    if (tableLoading) tableLoading.style.display = "none";
    lastUpdatedTimestamp.textContent = `Updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

  } catch (err) {
    console.error("loadStats Error:", err);
    if (tableLoading) tableLoading.style.display = "none";
    if (isManual) {
      showToast("Error", "Could not connect to database or API.", "error");
    }
  } finally {
    isInitialLoad = false;
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove("spinning"), 600);
    }
  }
}

// Render Table Based on Search & Active Filter
function renderTable() {
  const query = currentSearch.toLowerCase().trim();

  const filtered = visitorsData.filter(v => {
    // Filter type check
    if (currentFilter === "entered" && v.skipped) return false;
    if (currentFilter === "skipped" && !v.skipped) return false;

    // Search query check
    if (query) {
      const name = (v.name || "").toLowerCase();
      const status = (v.skipped ? "skipped preloader" : "entered name").toLowerCase();
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
  tableCountText.textContent = `Showing ${filtered.length} of ${visitorsData.length} records`;

  filtered.forEach((v, index) => {
    const row = document.createElement("tr");
    const isSkipped = Boolean(v.skipped);
    const dateObj = new Date(v.visitedAt || Date.now());
    const fullDate = dateObj.toLocaleString([], {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const relTime = formatRelativeTime(v.visitedAt || Date.now());
    const initials = getInitials(v.name || (isSkipped ? "Skip" : "Guest"));
    const shortId = v._id ? `#${v._id.slice(-6)}` : `#${index + 1}`;

    row.innerHTML = `
      <td><strong>${index + 1}</strong></td>
      <td>
        <div class="visitor-cell">
          <div class="visitor-avatar ${isSkipped ? 'skipped' : ''}">${initials}</div>
          <div class="visitor-name-info">
            <span class="visitor-name">${escapeHtml(v.name || (isSkipped ? "Anonymous Visitor" : "Visitor"))}</span>
            <span class="visitor-id-tag">${shortId}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="status-tag ${isSkipped ? 'tag-skipped' : 'tag-entered'}">
          <i class="fa-solid ${isSkipped ? 'fa-forward-step' : 'fa-circle-check'}"></i>
          ${isSkipped ? "Skipped Preloader" : "Entered Name"}
        </span>
      </td>
      <td>
        <span class="time-full">${fullDate}</span>
      </td>
      <td class="text-right">
        <span class="time-relative" title="${fullDate}">${relTime}</span>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// XSS Sanitizer Helper
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Handle New Visitor Alert & Notifications
function handleNewVisitor(visitor) {
  const name = visitor.name || "Anonymous Visitor";
  const actionText = visitor.skipped ? "skipped the preloader" : "entered their name";

  // In-app Toast Alert
  showToast("New Visitor Event", `${name} ${actionText}`, "new-visitor");

  // Browser Notification
  browserNotify(visitor);

  // Email Notification via EmailJS
  emailNotify(visitor);
}

// Browser Push Notification
function browserNotify(visitor) {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("New Portfolio Visitor 👋", {
        body: `${visitor.name || "Visitor"} (${visitor.skipped ? "Skipped" : "Entered Name"})`,
        icon: "image/unnamed-removebg-preview (4).png"
      });
    } catch (e) {
      console.warn("Notification error:", e);
    }
  }
}

// Email Notification
function emailNotify(visitor) {
  if (typeof emailjs !== "undefined" && emailjs.send) {
    emailjs.send(
      "service_lmyi4cf",
      "template_hwpq4db",
      {
        visitor_name: visitor.name || "Anonymous",
        status: visitor.skipped ? "Skipped Preloader" : "Entered Name",
        time: new Date(visitor.visitedAt).toLocaleString()
      }
    ).catch(err => {
      console.warn("EmailJS send warning:", err);
    });
  }
}

// Toast Notification Manager
function showToast(title, message, type = "success") {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconClass = "fa-circle-check";
  if (type === "new-visitor") iconClass = "fa-user-check";
  if (type === "error") iconClass = "fa-circle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Event Listeners
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    checkHealth();
    loadStats(true);
  });
}

if (testVisitorBtn) {
  testVisitorBtn.addEventListener("click", async () => {
    testVisitorBtn.disabled = true;
    testVisitorBtn.innerHTML = `<i class="fa-solid fa-spinner spinning"></i> <span>Sending...</span>`;

    try {
      const res = await fetch("/api/visitors/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Success", `Created test record for ${data.visitor.name}`, "success");
        await loadStats();
      } else {
        showToast("Database Notice", data.message || "Failed to create visitor (DB disconnected)", "error");
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      testVisitorBtn.disabled = false;
      testVisitorBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> <span>Test Visitor</span>`;
    }
  });
}

// Search Input Listeners
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = currentSearch ? "block" : "none";
    }
    renderTable();
  });
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    currentSearch = "";
    clearSearchBtn.style.display = "none";
    renderTable();
  });
}

// Filter Tabs Listeners
filterTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    filterTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.getAttribute("data-filter") || "all";
    renderTable();
  });
});

// Periodic Polling
checkHealth();
loadStats();
setInterval(loadStats, 5000);
setInterval(checkHealth, 30000);
