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
      localStorage.setItem('accessToken', data.data);
      location.assign('/make-predictions');
    })
    .catch(err => {
      showError(err.message);
    })

  return false;
}