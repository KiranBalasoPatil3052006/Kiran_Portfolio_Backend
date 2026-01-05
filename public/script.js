let lastVisitorId = null;

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

async function loadStats() {
    const res = await fetch("/api/visitors");
    const data = await res.json();

    document.getElementById("total").textContent = data.total;
    document.getElementById("skipped").textContent = data.skippedCount;

    const tbody = document.getElementById("visitorTableBody");
    tbody.innerHTML = "";

    data.visitors.forEach((v, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${v.name}</td>
      <td>${v.skipped ? "Skipped" : "Entered"}</td>
      <td>${new Date(v.visitedAt).toLocaleString()}</td>
    `;

        tbody.appendChild(row);
    });

    if (data.visitors.length > 0) {
        const latest = data.visitors[0];

        if (latest._id !== lastVisitorId) {
            browserNotify(latest);
            emailNotify(latest);
            lastVisitorId = latest._id;
        }
    }
}

function browserNotify(visitor) {
    if (Notification.permission === "granted") {
        new Notification("New Portfolio Visitor 👋", {
            body: `${visitor.name} (${visitor.skipped ? "Skipped" : "Entered"})`
        });
    }
}

function emailNotify(visitor) {
    emailjs.send(
        "service_lmyi4cf",
        "template_hwpq4db",
        {
            visitor_name: visitor.name,
            status: visitor.skipped ? "Skipped Preloader" : "Entered Name",
            time: new Date(visitor.visitedAt).toLocaleString()
        }
    );
}

setInterval(loadStats, 5000);
loadStats();
