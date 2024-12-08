document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les données des champs email et password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Appeler la fonction de connexion
    await loginUser(email, password);
});

async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:5678/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();

            // Stocker le token dans le localStorage
            localStorage.setItem('authToken', data.token);

            // Rediriger vers la page d'accueil
            window.location.href = 'index.html';
        } else {
            // Afficher un message d'erreur en cas d'identifiants incorrects
            displayErrorMessage('Identifiants incorrects. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        displayErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
}

function displayErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
}

