document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "Login.html";
    } else {
        const user = JSON.parse(currentUser);

        const nameElement = document.getElementById('profile-name');
        if (nameElement) {
            nameElement.textContent = user.name || "Azamat";
        }

        const surnameElement = document.getElementById('profile-surname');
        if (surnameElement) {
            surnameElement.textContent = user.surname || "Sailaubek";
        }

        const emailElement = document.getElementById('profile-email');
        if (emailElement) {
            emailElement.textContent = user.email;
        }

        const passwordElement = document.getElementById('profile-password');
        if (passwordElement) {
            passwordElement.textContent = user.password || "Aza061005";
        }

        const avatarElement = document.getElementById('profile-avatar');
        if (avatarElement) {
            avatarElement.src = user.avatar || "./Assets/empty_avatar.png";
        }
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem("currentUser");
            window.location.href = "Login.html";
        });
    }
});