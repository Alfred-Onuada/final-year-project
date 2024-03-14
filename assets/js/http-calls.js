function showError(msg) {
  const errorDiv = document.getElementById("failure-container");

  errorDiv.scrollIntoView();
  errorDiv.classList.remove("hide");
  errorDiv.textContent = msg;

  setTimeout(() => {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }, 3000);
}

function showSuccess(msg) {
  const successDiv = document.getElementById("success-container");

  successDiv.scrollIntoView();
  successDiv.classList.remove("hide");
  successDiv.textContent = msg;

  setTimeout(() => {
    successDiv.textContent = "";
    successDiv.classList.add("hide");
  }, 3000);
}

let resultTimeOut = null;
function showPredictionResult(msg) {
  const resultDiv = document.getElementById("prediction-container");

  resultDiv.scrollIntoView();
  resultDiv.classList.remove("hide");
  resultDiv.textContent = msg;

  if (resultTimeOut) {
    clearTimeout(resultTimeOut);
  }

  resultTimeOut = setTimeout(() => {
    resultDiv.textContent = "";
    resultDiv.classList.add("hide");
  }, 20000);
}

function register() {
  const fields = [
    "firstName",
    "lastName",
    "middleName",
    "hospitalName",
    "email",
    "phone",
    "password",
    "specialization",
  ];

  const payload = {};
  fields.forEach((field) => {
    payload[field] = document
      .querySelector(`input[name='${field}']`)
      .value.toLowerCase();
  });

  payload["specialization"] = payload["specialization"]
    .split(",")
    .map((specialization) => specialization.trim());

  fetch("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      location.assign("/make-prediction");
    })
    .catch((err) => {
      showError(err.message);
    });

  return false;
}

function login() {
  const fields = ["email", "password"];

  const payload = {};
  fields.forEach((field) => {
    payload[field] = document
      .querySelector(`input[name='${field}']`)
      .value.toLowerCase();
  });

  fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      location.assign("/make-prediction");
    })
    .catch((err) => {
      showError(err.message);
    });

  return false;
}

function contact() {
  const fields = ["name", "email", "phone", "subject"];

  const payload = {};
  fields.forEach((field) => {
    payload[field] = document
      .querySelector(`input[name='${field}']`)
      .value.toLowerCase();
  });

  payload["message"] = document.querySelector(`textarea[name='message']`).value;

  fetch("/api/store-contact-messages", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      showSuccess("Message Receieved Successfully");
    })
    .catch((err) => {
      showError(err.message);
    });

  return false;
}

function editProfile() {
  const editBtn = document.getElementById("edit-profile");
  const saveChanges = document.getElementById("save-changes");

  editBtn.classList.add("hide");
  saveChanges.classList.remove("hide");

  // make the content editable
  const elementsToMakeEditable = document.querySelectorAll(
    ".profile-data-value"
  );

  elementsToMakeEditable.forEach((elem, index) => {
    elem.setAttribute("contenteditable", true);
    // Set focus on the first editable element
    if (index === 0) {
      elem.focus();
      // Ensure cursor is at the start
      const range = document.createRange();
      range.selectNodeContents(elem);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}

function saveProfileChanges() {
  const editBtn = document.getElementById("edit-profile");
  const saveChanges = document.getElementById("save-changes");

  saveChanges.textContent = "Saving...";
  saveChanges.setAttribute("disabled", true);

  // remove the content editable
  const elementsToRemoveEditable = document.querySelectorAll(
    ".profile-data-value"
  );
  const payload = {};

  elementsToRemoveEditable.forEach((elem, index) => {
    elem.removeAttribute("contenteditable");

    payload[elem.dataset.name] = elem.textContent;
  });

  payload["specialization"] = payload["specialization"]
    .split(",")
    .map((specialization) => specialization.trim());

  fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      showSuccess("Profile Updated Successfully");
    })
    .catch((err) => {
      showError(err.message);
    })
    .finally(() => {
      editBtn.classList.remove("hide");
      saveChanges.classList.add("hide");

      saveChanges.textContent = "Save Changes";
      saveChanges.removeAttribute("disabled");
    });
}

function editPassword() {
  const newPassContainer = document.getElementById("new-password-container");

  newPassContainer.classList.remove("hide");
}

function savePassword() {
  const newPassContainer = document.getElementById("new-password-container");
  const savePassBtn = document.getElementById("save-pass-btn");

  savePassBtn.textContent = "Saving...";

  const newPassword = document.getElementById("new-password");
  const confirmPassword = document.getElementById("confirm-password");

  if (newPassword.value !== confirmPassword.value) {
    showError("Both passwords must match");
    savePassBtn.textContent = "Save Password";
    return;
  }

  fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ password: newPassword.value }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      showSuccess("Password Updated Successfully");
    })
    .catch((err) => {
      showError(err.message);
    })
    .finally(() => {
      newPassContainer.classList.add("hide");
      savePassBtn.textContent = "Save Password";
    });
}

function saveProfileImage(imageFile) {
  // Create FormData object to send the file
  const formData = new FormData();
  formData.append("image", imageFile);

  // Send POST request to server
  fetch("/api/update-profile-image", {
    method: "PATCH",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        // Handle successful response from server
        return response.json();
      }
      // Handle error response from server
      throw new Error("Error uploading image");
    })
    .then((data) => {
      showSuccess("Profile image updated successfully");
    })
    .catch((error) => {
      showError(error.message);
    });
}

function handleProfileImageChange() {
  const profileImagePreview = document.getElementById("profile-image-preview");
  const profileImageInput = document.getElementById("profile-image");

  // Check if a file is selected
  if (profileImageInput.files && profileImageInput.files[0]) {
    const file = profileImageInput.files[0];
    const reader = new FileReader();

    // Check if the selected file is an image
    if (file.type.startsWith("image/")) {
      reader.onload = function (event) {
        profileImagePreview.src = event.target.result;

        // Upload image to server
        saveProfileImage(file);
      };
      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    } else {
      showError("Please upload an actual image file");
    }
  }
}

function handleImageUpload() {
  const previewImage = document.getElementById("preview-image");
  const imageInput = document.getElementById("tumor-image");

  // Check if a file is selected
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    const reader = new FileReader();

    // Check if the selected file is an image
    if (file.type.startsWith("image/")) {
      reader.onload = function (event) {
        previewImage.src = event.target.result;
        previewImage.style.maxWidth = "100%"; // Set max width to prevent stretching
        previewImage.classList.remove("hide");

        // Upload image to server
        uploadImage(file);
      };
      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    } else {
      showError("Please upload an actual image file");
    }
  }
}

function uploadImage(imageFile) {
  // Create FormData object to send the file
  const formData = new FormData();
  formData.append("image", imageFile);

  // Send POST request to server
  fetch("/api/make-prediction", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        // Handle successful response from server
        return response.json();
      }
      // Handle error response from server
      throw new Error("Error uploading image");
    })
    .then((data) => {
      showPredictionResult(
        `The above image has a '${(data.data.confidenceScore * 100).toFixed(
          2
        )}%' chance of been '${data.data.inference}'`
      );
    })
    .catch((error) => {
      showError(error.message);
    });
}

function filter(tag) {
  const elements = document.getElementsByClassName("inference");

  [].forEach.call(elements, (elem) => {
    elem.parentNode.classList.add("hide");

    if (tag === "all" || elem.textContent.toLowerCase() === tag) {
      elem.parentNode.classList.remove("hide");
    }
  });
}

function adminLogin() {
  const fields = ["email", "password"];

  const payload = {};
  fields.forEach((field) => {
    payload[field] = document
      .querySelector(`input[name='${field}']`)
      .value.toLowerCase();
  });

  fetch("/api/youmustbeajoker/login", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      location.assign("/youmustbeajoker/doctors");
    })
    .catch((err) => {
      showError(err.message);
    });

  return false;
}

function registerAnAdmin() {
  const fields = [
    "fullName",
    "email",
    "password",
  ];

  const payload = {};
  fields.forEach((field) => {
    payload[field] = document
      .querySelector(`input[name='${field}']`)
      .value.toLowerCase();
  });

  fetch("/api/youmustbeajoker/register", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then((data) => {
      showSuccess('Admin account created successfully');
    })
    .catch((err) => {
      showError(err.message);
    });

  return false;
}