// Get inputs from form
const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', function(event) {
    event.preventDefault()
    // Get user's credentials from form fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('pw').value;
    // Store in usable object
    const loginData = {
        email: email,
        password: password
    };
    console.log(loginData)
    // Send POST request to server
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData) // Needs a string to be sent
    })
    .then(response => {
        if (!response.ok) {
            // Handle API error
          throw new Error('Network response was not ok');Z
        }
        return response.json();
      })
      .then(data => {
        // Successful login
        console.log('Login successful:', data);
        let token = data.token
        //mettre dans le local/session storage
        localStorage.setItem('token', token)
        // Redirect
        window.location.href = 'index.html';
      })
      .catch(error => {
        // Handle error
        console.error('There was a problem with the login request:', error);
        let loginErrorDiv = document.getElementById('login-error');
        let loginError = document.createElement('p');
        loginError.innerHTML = "L'email ou le mot de passe est erroné."
        loginErrorDiv.appendChild(loginError)
      });
})
