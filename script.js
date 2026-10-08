// ---------------------------------------------
// PM-04 Final Project: ResourceHub
// ---------------------------------------------

const form = document.getElementById("requestForm");
const formMessage = document.getElementById("formMessage");

let requests = [];
let nextId = 1;
let searchTerm = "";
let urgencyValue = "all";

function loadRequests() {
    const saved = localStorage.getItem("resourceHubRequests");

    if (saved) {
        const parsed = JSON.parse(saved);
        requests = parsed.records;
        nextId = parsed.nextId;
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

function validateForm(data) {
    const errors = {};

    if (!data.requesterName.trim()) {
        errors.requesterName = "Enter the requester's name.";
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

    if (isNaN(data.quantity) || Number(data.quantity) <= 0) {
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

        const field = document
            .getElementById(id)
            .closest(".field");

        document.getElementById("err-" + id).textContent =
            errors[id] || "";

        field.classList.toggle(
            "invalid",
            Boolean(errors[id])
        );
    });
}

/* RH-02 test submit */
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
        requesterName:
            document.getElementById("requesterName").value,

        department:
            document.getElementById("department").value,

        resourceType:
            document.getElementById("resourceType").value,

        description:
            document.getElementById("description").value,

        quantity:
            document.getElementById("quantity").value
    };

    const errors = validateForm(data);

    showFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
        formMessage.textContent =
            "Please fix the highlighted fields.";

        formMessage.className =
            "form-message error";

        return;
    }

    formMessage.textContent =
        "Form is valid.";

    formMessage.className =
        "form-message success";

    saveRequests();
});