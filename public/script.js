const form = document.getElementById('number-form');
const input = document.getElementById('number-input');
const result = document.getElementById('result');
const errorMessage = document.getElementById('error-message');

const numberValue = document.getElementById('number-value');
const digitSumValue = document.getElementById('digit-sum');
const isPrimeValue = document.getElementById('is-prime');
const isPerfectValue = document.getElementById('is-perfect');
const funFactValue = document.getElementById('fun-fact');
const propertiesContainer = document.getElementById('properties');

function showError(message) {
  result.classList.add('hidden');
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function resetState() {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
  result.classList.remove('hidden');
}

function formatBoolean(value) {
  return value ? 'Yes' : 'No';
}

const apiBaseUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const value = Number(input.value);

  if (!Number.isInteger(value)) {
    showError('Please enter a valid whole number.');
    return;
  }

  resetState();

  try {
    const response = await fetch(`${apiBaseUrl}/api/classify-number?number=${encodeURIComponent(value)}`);
    const data = await response.json();

    if (!response.ok || data.error) {
      showError('The server could not classify that number.');
      return;
    }

    numberValue.textContent = data.number;
    digitSumValue.textContent = data.digit_sum;
    isPrimeValue.textContent = formatBoolean(data.is_prime);
    isPerfectValue.textContent = formatBoolean(data.is_perfect);
    funFactValue.textContent = data.fun_fact || 'No fun fact available.';

    propertiesContainer.innerHTML = '';

    if (Array.isArray(data.properties) && data.properties.length > 0) {
      data.properties.forEach((property) => {
        const badge = document.createElement('span');
        badge.className = 'tag';
        badge.textContent = property;
        propertiesContainer.appendChild(badge);
      });
    } else {
      const fallback = document.createElement('span');
      fallback.className = 'tag muted';
      fallback.textContent = 'General integer';
      propertiesContainer.appendChild(fallback);
    }
  } catch (error) {
    showError('Unable to connect to the API. Please check the backend service on Render.');
  }
});
