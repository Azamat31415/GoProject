let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
let selectedUser = null;

document.addEventListener('DOMContentLoaded', function() {
    const userTableBody = document.getElementById('user-table-body');

    function populateUserTable() {
        userTableBody.innerHTML = '';

        registeredUsers.forEach(user => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn btn-warning edit-user" data-email="${user.email}">Edit</button>
                    <button class="btn btn-danger delete-user" data-email="${user.email}">Delete</button>
                </td>
            `;

            userTableBody.appendChild(row); 
        });
    }

    userTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-user')) {
            const email = event.target.getAttribute('data-email');
            deleteUser(email);
        } else if (event.target.classList.contains('edit-user')) {
            const email = event.target.getAttribute('data-email');
            openEditUserAlert(email);
        }
    });

    function deleteUser(email) {
        const userIndex = registeredUsers.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            registeredUsers.splice(userIndex, 1);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            populateUserTable();
            alert("User deleted successfully!");
        } else {
            alert("User not found!");
        }
    }

    function openEditUserAlert(email) {
        selectedUser = registeredUsers.find(user => user.email === email);
    
        if (selectedUser) {
            document.getElementById('editName').value = selectedUser.name;
            document.getElementById('editSurname').value = selectedUser.surname;
            document.getElementById('editEmail').value = selectedUser.email;
            document.getElementById('editUserAlert').style.display = 'flex';
        }
    }

    window.saveUserChanges = function() {
        if (selectedUser) {
            selectedUser.name = document.getElementById('editName').value.trim();
            selectedUser.surname = document.getElementById('editSurname').value.trim();
            selectedUser.email = document.getElementById('editEmail').value.trim();
    
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            populateUserTable();
            closeAlert('editUserAlert');
        }
    };

    populateUserTable();
});

function closeAlert(alertId) {
    document.getElementById(alertId).style.display = 'none';
}
