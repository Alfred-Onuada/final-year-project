function showError(msg) {
  const errorDiv = document.getElementById('failure-container');

  errorDiv.scrollIntoView();
  errorDiv.classList.remove('hide');
  errorDiv.textContent = msg;

  setTimeout(() => {
    errorDiv.textContent = '';
    errorDiv.classList.add('hide');
  }, 3000)
}

function showSuccess(msg) {
  const successDiv = document.getElementById('success-container');

  successDiv.scrollIntoView();
  successDiv.classList.remove('hide');
  successDiv.textContent = msg;

  setTimeout(() => {
    successDiv.textContent = '';
    successDiv.classList.add('hide');
  }, 3000)
}

function register() {
  const fields = ['firstName', 'lastName', 'middleName', 'hospitalName', 'email', 'phone', 'password', 'specialization'];

  const payload = {};
  fields.forEach(field => {
    payload[field] = document.querySelector(`input[name='${field}']`).value.toLowerCase();
  })

  payload['specialization'] = payload['specialization'].split(',').map(specialization => specialization.trim());

  fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(async resp => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then(data => {
      location.assign('/make-prediction');
    })
    .catch(err => {
      showError(err.message);
    })

  return false;
}

function login() {
  const fields = ['email', 'password'];

  const payload = {};
  fields.forEach(field => {
    payload[field] = document.querySelector(`input[name='${field}']`).value.toLowerCase();
  })

  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(async resp => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then(data => {
      location.assign('/make-prediction');
    })
    .catch(err => {
      showError(err.message);
    })

  return false;
}

function contact() {
  const fields = ['name', 'email', 'phone', 'subject'];

  const payload = {};
  fields.forEach(field => {
    payload[field] = document.querySelector(`input[name='${field}']`).value.toLowerCase();
  })

  payload['message'] = document.querySelector(`textarea[name='message']`).value;

  fetch('/api/store-contact-messages', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(async resp => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then(data => {
      showSuccess('Message Receieved Successfully');
    })
    .catch(err => {
      showError(err.message);
    })

  return false;
}

function editProfile() {
  const editBtn = document.getElementById('edit-profile');
  const saveChanges = document.getElementById('save-changes');

  editBtn.classList.add('hide');
  saveChanges.classList.remove('hide');

  // make the content editable
  const elementsToMakeEditable = document.querySelectorAll('.profile-data-value');

  elementsToMakeEditable.forEach((elem, index) => {
    elem.setAttribute('contenteditable', true);
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
  const editBtn = document.getElementById('edit-profile');
  const saveChanges = document.getElementById('save-changes');

  saveChanges.textContent = "Saving...";
  saveChanges.setAttribute('disabled', true);

  // remove the content editable
  const elementsToRemoveEditable = document.querySelectorAll('.profile-data-value');
  const payload = {};

  elementsToRemoveEditable.forEach((elem, index) => {
    elem.removeAttribute('contenteditable');

    payload[elem.dataset.name] = elem.textContent;
  });

  payload['specialization'] = payload['specialization'].split(',').map(specialization => specialization.trim());

  fetch('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(async resp => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then(data => {
      showSuccess('Profile Updated Successfully');
    })
    .catch(err => {
      showError(err.message);
    })
    .finally(() => {
      editBtn.classList.remove('hide');
      saveChanges.classList.add('hide');

      saveChanges.textContent = "Save Changes";
      saveChanges.removeAttribute('disabled');
    })
}

function editPassword() {
  const newPassContainer = document.getElementById('new-password-container');

  newPassContainer.classList.remove('hide');
}

function savePassword() {
  const newPassContainer = document.getElementById('new-password-container');
  const savePassBtn = document.getElementById('save-pass-btn');

  savePassBtn.textContent = 'Saving...';

  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');

  if (newPassword.value !== confirmPassword.value) {
    showError("Both passwords must match");
    savePassBtn.textContent = 'Save Password';
    return;
  }

  fetch('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify({password: newPassword.value}),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(async resp => {
      if (!resp.ok) {
        const errData = await resp.json();
        throw errData;
      }
      return resp.json();
    })
    .then(data => {
      showSuccess('Password Updated Successfully');
    })
    .catch(err => {
      showError(err.message);
    })
    .finally(() => {
      newPassContainer.classList.add('hide');
      savePassBtn.textContent = 'Save Password';
    })
}