const STORAGE_KEY = "ilm_prayer_times";
const ADMIN_PASSWORD = "ilmadmin123";
const defaultPrayerTimes = {
  Fajr: "5:15 AM",
  Dhuhr: "1:30 PM",
  Asr: "5:00 PM",
  Maghrib: "7:45 PM",
  Isha: "9:15 PM",
};

function getPrayerTimes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...defaultPrayerTimes };
  try {
    return JSON.parse(saved);
  } catch {
    return { ...defaultPrayerTimes };
  }
}

function savePrayerTimes(times) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(times));
}

function renderPrayerTimesTable() {
  const body = document.getElementById("prayer-times-body");
  if (!body) return;

  const times = getPrayerTimes();
  body.innerHTML = "";

  Object.entries(times).forEach(([prayer, time]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${prayer}</td><td>${time}</td>`;
    body.appendChild(row);
  });
}

function setupDonationForm() {
  const form = document.getElementById("donation-form");
  if (!form) return;

  const message = document.getElementById("donation-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("donor-name").value.trim();
    const amount = document.getElementById("donation-amount").value;

    message.textContent = `Thank you, ${name}! Your donation of $${amount} has been received.`;
    form.reset();
  });
}

function setupAdminPage() {
  const loginForm = document.getElementById("admin-login-form");
  const loginMessage = document.getElementById("login-message");
  const loginSection = document.getElementById("admin-login-section");
  const editorSection = document.getElementById("admin-editor-section");
  const editForm = document.getElementById("prayer-edit-form");
  const adminMessage = document.getElementById("admin-message");

  if (!loginForm || !editForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("admin-password").value;

    if (password !== ADMIN_PASSWORD) {
      loginMessage.textContent = "Incorrect password. Please try again.";
      return;
    }

    loginMessage.textContent = "Access granted.";
    loginSection.classList.add("hidden");
    editorSection.classList.remove("hidden");

    const times = getPrayerTimes();
    editForm.innerHTML = "";

    Object.entries(times).forEach(([prayer, time]) => {
      const label = document.createElement("label");
      label.innerHTML = `${prayer}<input required name="${prayer}" value="${time}" />`;
      editForm.appendChild(label);
    });

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = "Save Timings";
    editForm.appendChild(saveButton);
  });

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    const updated = {};

    for (const [name, value] of formData.entries()) {
      updated[name] = value;
    }

    savePrayerTimes(updated);
    adminMessage.textContent = "Prayer timings updated successfully.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPrayerTimesTable();
  setupDonationForm();
  setupAdminPage();
});
