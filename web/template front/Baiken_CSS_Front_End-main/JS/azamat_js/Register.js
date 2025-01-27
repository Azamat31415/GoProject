document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault();

    const name = document.getElementById('name');
    const surname = document.getElementById('surname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const avatarInput = document.getElementById('avatar-upload');

    const nameError = document.getElementById('name-error');
    const surnameError = document.getElementById('surname-error');
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

    function validateEmail(emailField, errorMessage) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            emailField.classList.add('error');
            errorMessage.style.display = "block";
            errorMessage.textContent = "Please enter a valid email (must contain @)";
            return false;
        } else {
            emailField.classList.remove('error');
            errorMessage.style.display = "none";
            return true;
        }
    }

    function validatePassword(passwordField, errorMessage) {
        const passwordValue = passwordField.value.trim();
        if (passwordValue.length < 8) {
            passwordField.classList.add('error');
            errorMessage.style.display = "block";
            errorMessage.textContent = "Password must be at least 8 characters long";
            return false;
        }
        
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordPattern.test(passwordValue)) {
            passwordField.classList.add('error');
            errorMessage.style.display = "block";
            errorMessage.textContent = "Password must contain at least one uppercase letter and one number";
            return false;
        } else {
            passwordField.classList.remove('error');
            errorMessage.style.display = "none";
            return true;
        }
    }

    const isNameValid = validateField(name, nameError);
    const isSurnameValid = validateField(surname, surnameError);
    const isEmailValid = validateEmail(email, emailError);
    const isPasswordValid = validatePassword(password, passwordError);

    if (isNameValid && isSurnameValid && isEmailValid && isPasswordValid) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        const userExists = registeredUsers.some(user => user.email === email.value.trim());
        if (userExists) {
            showAlert("User already exists. Please use a different email.");
            return;
        }

        let avatarData = "./Assets/empty_avatar.png";
        if (avatarInput.files && avatarInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarData = e.target.result;
                
                saveUser();
            };
            reader.readAsDataURL(avatarInput.files[0]);
        } else {
            saveUser();
        }

        function saveUser() {
            const newUser = {
                name: name.value.trim(),
                surname: surname.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                avatar: avatarData
            };

            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            showAlert("Registration successful!", () => {
                window.location.href = "Profile.html";
            });
        }
    }
});

document.getElementById('avatar-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function showAlert(message, callback) {
    const alertBox = document.getElementById('registerAlert');
    alertBox.querySelector('p').textContent = message;
    alertBox.style.display = 'flex';

    alertBox.querySelector('button').onclick = () => {
        alertBox.style.display = 'none';
        if (callback) callback();
    };
}