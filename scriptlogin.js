document.addEventListener("DOMContentLoaded", function(){

    // Login page part
        document.getElementById("loginButton").addEventListener('click', () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            //const loginMessage = document.getElementById('loginMessage').value.trim();
    
            if (username === 'admin' && password === 'Grace') {
                localStorage.setItem('loggedIn', 'true');
                window.location.href = 'dashboard.html'; // Go to dashboard
            } else {
                alert('Invalid username or password.');
            }
        });

});