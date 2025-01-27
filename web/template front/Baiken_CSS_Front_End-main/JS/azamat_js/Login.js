window.onload = function() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        window.location.href = "Profile.html";
    }
};

document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    function validateField(field, errorMessage) {
        if (field.value.trim() === "") {
            field.classList.add('error');
            errorMessage.style.display = "block";
            errorMessage.textContent = "This field is required";
            return false;
        } else {
            field.classList.remove('error');
            errorMessage.style.display = "none";
            return true;
        }
    }

    const isEmailValid = validateField(email, emailError);
    const isPasswordValid = validateField(password, passwordError);

    if (isEmailValid && isPasswordValid) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        if (email.value.trim() === '230147@astanait.edu.kz' && password.value.trim() === 'Aza061005') {
            showCustomAlert("Login successful!", () => {
                localStorage.setItem("currentUser", JSON.stringify({ 
                    name: 'Azamat', 
                    surname: 'Sailaubek', 
                    email: email.value.trim(), 
                    password: password.value.trim(), 
                    role: 'admin' 
                }));
                window.location.href = 'AdminPanel.html';
            });
        } else {
            const user = registeredUsers.find(user => user.email === email.value.trim() && user.password === password.value.trim());

            if (user) {
                showCustomAlert("Login successful!", () => {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    window.location.href = 'Profile.html';
                });
            } else {
                showCustomAlert("Invalid email or password. Please try again.");
            }
        }
    }
});

function showCustomAlert(message, callback) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    alertMessage.textContent = message;
    alertBox.style.display = 'flex';

    alertBox.querySelector("button").onclick = function() {
        closeCustomAlert();
        if (callback) callback();
    };
}

function closeCustomAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}
