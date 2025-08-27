// REPLACE THIS URL WITH YOUR ACTUAL FUNCTION URL
const AZURE_FUNCTION_URL = 'https://register-function-fgatb5gndmhtftgu.eastus-01.azurewebsites.net/api/submitForm?';

// Pre-warm function when page loads
window.addEventListener('load', () => {
    if (window.location.protocol === "https:") {
        // Send a lightweight request to wake up the function
        fetch(AZURE_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ warmup: true })
        })
        .then(() => console.log("Azure function warn-up done"))
        .catch(() => {})
    } else {
        console.log('Skipped azure warn-up')
    }
});

// Google Login feature
const loginGoogleBtn = document.getElementById("google-login");
loginGoogleBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(window.location.origin + '/api/auth-google');
        const data = await response.json();

        if (data.authUrl) {
            // Redirects to Google OAuth
            window.location.href = data.authUrl;
        } else {
            alert('Error inicializando registro con Google');
        }
    } catch(error) {
        console.log('Login failed:', error);
        alert('El registro falló, por favor intenta de nuevo.')
    }
});

const form = document.getElementById('contactForm');
// form.addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     const submitBtn = document.getElementById('submitBtn');
//     const submitText = document.getElementById('submitText');
//     const messageDiv = document.getElementById('message');
    
//     // Get form data
//     const formData = {
//         name: document.getElementById('name').value.trim(),
//         email: document.getElementById('email').value.trim(),
//         comment: document.getElementById('comment').value.trim()
//     };

//     // Show loading state
//     submitBtn.disabled = true;
//     submitText.innerHTML = '<div class="loading"></div>Enviando...';
//     messageDiv.style.display = 'none';

//     try {
//         const response = await fetch(AZURE_FUNCTION_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData)
//         });

//         const result = await response.json();

//         if (result.success) {
//             // Success
//             messageDiv.className = 'message success';
//             messageDiv.textContent = result.message;
//             messageDiv.style.display = 'block';
//             document.getElementById('contactForm').reset();
//         } else {
//             // Error from server
//             messageDiv.className = 'message error';
//             messageDiv.textContent = result.error || `Algo ha salido mal. \nPor favor intenta de nuevo.`;
//             messageDiv.style.display = 'block';
//         }

//     } catch (error) {
//         // Network or other error
//         console.error('Error:', error);
//         messageDiv.className = 'message error';
//         messageDiv.textContent = `Error en la conexión. \nPor favor revisa tu conexión e intenta de nuevo.`;
//         messageDiv.style.display = 'block';
//     } finally {
//         // Reset button state
//         submitBtn.disabled = false;
//         submitText.textContent = 'Enviar';
//     }
// });