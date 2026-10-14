
/* =========================================
   PM-04 Final Project: ResourceHub
========================================= */

// Page elements
const form = document.getElementById("requestForm");
const formMessage = document.getElementById("formMessage");
const searchInput = document.getElementById("searchInput");
const urgencyFilter = document.getElementById("urgencyFilter");
const exportCsvButton = document.getElementById("exportCsv");
const themeToggle = document.getElementById("themeToggle");

// Modal elements
const notificationModal = document.getElementById("notificationModal");
const modalBox = notificationModal.querySelector(".modal-box");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalOk = document.getElementById("modalOk");
const modalClose = document.getElementById("modalClose");

// App data
let requests = [];
let nextId = 1;
let searchTerm = "";
let urgencyValue = "all";
let draggedRequestId = null;
let lastFocusedElement = null;

// -----------------------------------------
// Modal
// -----------------------------------------

function showModal(message, type, title) {
  lastFocusedElement = document.activeElement;

  modalBox.className = "modal-box";

  if (type === "error") {
    modalBox.classList.add("error");
    modalIcon.textContent = "×";
    modalTitle.textContent = title || "Something went wrong";
  } else if (type === "warning") {
    modalBox.classList.add("warning");
    modalIcon.textContent = "!";
    modalTitle.textContent = title || "Please check your details";
  } else {
    modalIcon.textContent = "✓";
    modalTitle.textContent = title || "Success!";
  }

  modalMessage.textContent = message;
  notificationModal.hidden = false;
  modalOk.focus();
}

function closeModal() {
  notificationModal.hidden = true;

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

modalOk.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);

notificationModal.addEventListener("click", function (event) {
  if (event.target === notificationModal) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !notificationModal.hidden) {
    closeModal();
  }
});

// -----------------------------------------
// Local Storage
// -----------------------------------------

function loadRequests() {
  const saved = localStorage.getItem("resourceHubRequests");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      requests = Array.isArray(parsed.records) ? parsed.records : [];
      nextId = parsed.nextId || 1;

      // Make older saved requests safe to display.
      requests.forEach(function (request) {
        if (!request.status) {
          request.status = "Submitted";
        }
      });
    } catch (error) {
      requests = [];
      nextId = 1;
    }
  }
}

function saveRequests() {
  localStorage.setItem(
    "resourceHubRequests",
    JSON.stringify({
      records: requests,
      nextId: nextId
    })
  );
}

function formatId(id) {
  return "REQ-" + String(id).padStart(4, "0");
}

// -----------------------------------------
// Form Validation
// -----------------------------------------

function validateForm(data) {
  const errors = {};
  const requesterName = data.requesterName.trim();

  // Allow letters, spaces, apostrophes and hyphens.
  // Require at least two letters in each name part.
  const namePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+(?:[ '-][a-zA-ZÀ-ÖØ-öø-ÿ]+)*$/;
  const nameParts = requesterName.split(/[ '-]+/);

  if (!requesterName) {
    errors.requesterName = "Enter the requester's name.";
  } else if (/^[0-9\s]+$/.test(requesterName)) {
    errors.requesterName =
      "Numbers alone are not a valid name. Please enter your name.";
  } else if (
    !namePattern.test(requesterName) ||
    nameParts.some(function (part) {
      return part.length < 2;
    })
  ) {
    errors.requesterName =
      "Enter a valid name using letters. Each name part must contain at least two letters.";
  }

  if (!data.department) {
    errors.department = "Select a department.";
  }

  if (!data.resourceType) {
    errors.resourceType = "Select a resource type.";
  }

  if (!data.description.trim()) {
    errors.description = "Describe what you need.";
  }

  if (
    data.quantity === "" ||
    !Number.isFinite(Number(data.quantity)) ||
    Number(data.quantity) <= 0
  ) {
    errors.quantity = "Quantity must be more than zero.";
  }

  return errors;
}

function showFieldErrors(errors) {
  [
    "requesterName",
    "department",
    "resourceType",
    "description",
    "quantity"
  ].forEach(function (id) {
    const input = document.getElementById(id);
    const field = input.closest(".field");
    const errorElement = document.getElementById("err-" + id);

    errorElement.textContent = errors[id] || "";
    field.classList.toggle("invalid", Boolean(errors[id]));
    input.setAttribute("aria-invalid", errors[id] ? "true" : "false");
  });
}

// Clear a field's error as the user corrects it.
[
  "requesterName",
  "department",
  "resourceType",
  "description",
  "quantity"
].forEach(function (id) {
  const input = document.getElementById(id);

  input.addEventListener("input", function () {
    clearFieldError(id);
  });

  input.addEventListener("change", function () {
    clearFieldError(id);
  });
});

function clearFieldError(id) {
  const input = document.getElementById(id);
  const field = input.closest(".field");

  document.getElementById("err-" + id).textContent = "";
  field.classList.remove("invalid");
  input.setAttribute("aria-invalid", "false");
}

// -----------------------------------------
// Filter Requests
// -----------------------------------------

function getVisibleRequests() {
  return requests.filter(function (request) {
    const searchableText = (
      request.requesterName + " " +
      request.resourceType + " " +
      request.description + " " +
      request.department
    ).toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

    const matchesUrgency =
      urgencyValue === "all" || request.urgency === urgencyValue;

    return matchesSearch && matchesUrgency;
  });
}

// -----------------------------------------
// Create Request Cards
// -----------------------------------------

function renderRequestCard(request) {
  const card = document.createElement("li");

  card.className = "request-card";
  card.dataset.id = request.id;
  card.draggable = true;

  const urgencyClass =
    request.urgency === "Urgent"
      ? "request-card-urgency urgent"
      : "request-card-urgency";

  const statusClass = "status-" + request.status.toLowerCase();

  // Build the card using DOM elements so user input is not treated as HTML.
  const header = document.createElement("div");
  header.className = "request-card-header";

  const idLabel = document.createElement("span");
  idLabel.className = "request-card-id";
  idLabel.textContent = request.id;

  const urgencyLabel = document.createElement("span");
  urgencyLabel.className = urgencyClass;
  urgencyLabel.textContent = request.urgency;

  header.append(idLabel, urgencyLabel);

  const statusLabel = document.createElement("span");
  statusLabel.className = "request-card-status " + statusClass;
  statusLabel.textContent = "Status: " + request.status;

  const heading = document.createElement("h4");
  heading.textContent = request.resourceType;

  const details = document.createElement("div");
  details.className = "request-card-details";

  [
    ["Requester:", request.requesterName],
    ["Department:", request.department],
    ["Quantity:", String(request.quantity)]
  ].forEach(function (item) {
    const line = document.createElement("span");
    const strong = document.createElement("strong");

    strong.textContent = item[0] + " ";
    line.append(strong, document.createTextNode(item[1]));
    details.appendChild(line);
  });

  const description = document.createElement("p");
  description.className = "request-card-description";
  description.textContent = request.description;

  card.append(header, statusLabel, heading, details, description);

  // Start dragging a request.
  card.addEventListener("dragstart", function (event) {
    draggedRequestId = request.id;
    card.classList.add("dragging");

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", request.id);
    }
  });

  // Finish dragging a request.
  card.addEventListener("dragend", function () {
    draggedRequestId = null;
    card.classList.remove("dragging");

    document.querySelectorAll(".column").forEach(function (column) {
      column.classList.remove("drag-over");
    });
  });

  return card;
}

// -----------------------------------------
// Statistics
// -----------------------------------------

function updateStats() {
  document.getElementById("statTotal").textContent = requests.length;

  document.getElementById("statSubmitted").textContent =
    requests.filter(function (request) {
      return request.status === "Submitted";
    }).length;

  document.getElementById("statApproved").textContent =
    requests.filter(function (request) {
      return request.status === "Approved";
    }).length;

  document.getElementById("statResolved").textContent =
    requests.filter(function (request) {
      return request.status === "Resolved";
    }).length;
}

// -----------------------------------------
// Update Request Status
// -----------------------------------------

function updateRequestStatus(requestId, newStatus) {
  const request = requests.find(function (item) {
    return item.id === requestId;
  });

  if (!request || request.status === newStatus) {
    return;
  }

  request.status = newStatus;

  saveRequests();
  renderBoard();
}

// -----------------------------------------
// Render Board
// -----------------------------------------

function renderBoard() {
  const visibleRequests = getVisibleRequests();
  const statuses = ["Submitted", "Approved", "Resolved"];

  statuses.forEach(function (status) {
    const list = document.getElementById("list-" + status);
    const column = document.querySelector(
      '.column[data-status="' + status + '"]'
    );
    const count = column.querySelector(".column-count");

    list.innerHTML = "";

    const statusRequests = visibleRequests.filter(function (request) {
      return request.status === status;
    });

    statusRequests.forEach(function (request) {
      list.appendChild(renderRequestCard(request));
    });

    count.textContent = statusRequests.length;
  });

  updateStats();
}

// -----------------------------------------
// Drag and Drop
// -----------------------------------------

document.querySelectorAll(".column").forEach(function (column) {
  column.addEventListener("dragover", function (event) {
    event.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", function (event) {
    if (!column.contains(event.relatedTarget)) {
      column.classList.remove("drag-over");
    }
  });

  column.addEventListener("drop", function (event) {
    event.preventDefault();
    column.classList.remove("drag-over");

    const transferredId =
      event.dataTransfer && event.dataTransfer.getData("text/plain");

    const requestId = draggedRequestId || transferredId;

    if (!requestId) {
      return;
    }

    const newStatus = column.dataset.status;
    const requestExists = requests.some(function (request) {
      return request.id === requestId;
    });

    if (!requestExists) {
      return;
    }

    updateRequestStatus(requestId, newStatus);
    draggedRequestId = null;
  });
});

// -----------------------------------------
// Search and Urgency Filter
// -----------------------------------------

searchInput.addEventListener("input", function () {
  searchTerm = searchInput.value.trim();
  renderBoard();
});

urgencyFilter.addEventListener("change", function () {
  urgencyValue = urgencyFilter.value;
  renderBoard();
});

// -----------------------------------------
// Submit Request
// -----------------------------------------

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = {
    requesterName: document.getElementById("requesterName").value,
    department: document.getElementById("department").value,
    resourceType: document.getElementById("resourceType").value,
    description: document.getElementById("description").value,
    quantity: document.getElementById("quantity").value,
    urgency: document.querySelector(
      'input[name="urgency"]:checked'
    ).value
  };

  const errors = validateForm(data);

  showFieldErrors(errors);

  if (Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0];

    showModal(firstError, "warning", "Please check your details");
    return;
  }

  const request = {
    id: formatId(nextId),
    requesterName: data.requesterName.trim(),
    department: data.department,
    resourceType: data.resourceType,
    description: data.description.trim(),
    quantity: Number(data.quantity),
    urgency: data.urgency,
    status: "Submitted"
  };

  requests.push(request);
  nextId++;

  saveRequests();
  renderBoard();

  form.reset();
  document.getElementById("quantity").value = 1;
  showFieldErrors({});

  formMessage.textContent = "";

  showModal(
    "Your resource request " + request.id +
      " has been submitted successfully.",
    "success",
    "Request Submitted!"
  );
});

// -----------------------------------------
// Export Requests to CSV
// -----------------------------------------

function exportRequestsToCSV() {
  if (requests.length === 0) {
    showModal(
      "There are no requests to download yet. Submit a request first.",
      "warning",
      "Nothing to Export"
    );
    return;
  }

  const headers = [
    "ID",
    "Requester",
    "Department",
    "Resource Type",
    "Description",
    "Quantity",
    "Urgency",
    "Status"
  ];

  const rows = requests.map(function (request) {
    return [
      request.id,
      request.requesterName,
      request.department,
      request.resourceType,
      request.description,
      request.quantity,
      request.urgency,
      request.status
    ];
  });

  const csvRows = [headers, ...rows];

  const csvContent = csvRows.map(function (row) {
    return row.map(function (value) {
      return '"' + String(value).replace(/"/g, '""') + '"';
    }).join(",");
  }).join("\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "download-report.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  showModal(
    "Your report containing " + requests.length +
      " request(s) has been downloaded.",
    "success",
    "Report Downloaded!"
  );
}

exportCsvButton.addEventListener("click", exportRequestsToCSV);

// -----------------------------------------
// Theme Toggle
// -----------------------------------------

function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("resourceHubTheme", newTheme);

  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("resourceHubTheme") || "dark";

  document.body.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);
}

themeToggle.addEventListener("click", toggleTheme);

// -----------------------------------------
// Start Application
// -----------------------------------------

function startApp() {
  loadTheme();
  loadRequests();
  renderBoard();
}

startApp();
