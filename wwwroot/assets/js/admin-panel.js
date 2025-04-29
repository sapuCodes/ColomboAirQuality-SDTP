document.addEventListener('DOMContentLoaded', () => {
    let isAdminsListVisible = false;
    let isUsersListVisible = false;
    let isContactsListVisible = false;

    const logoutBtn = document.getElementById('logoutBtn');
    const manageAdminsBtn = document.getElementById('manageAdminsBtn');
    const viewUsersBtn = document.getElementById('viewUsersBtn');
    const addDataBtn = document.getElementById('addDataBtn');
    const manageDataBtn = document.getElementById('manageDataBtn');
    const viewContactsBtn = document.getElementById('viewContactsBtn');

    const adminsListContainer = document.getElementById('adminsListContainer');
    const usersListContainer = document.getElementById('usersListContainer');
    const contactsListContainer = document.getElementById('contactsListContainer');

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'adminlogin.html';
    });

    manageAdminsBtn.addEventListener('click', async () => {
        isAdminsListVisible = !isAdminsListVisible;
        adminsListContainer.style.display = isAdminsListVisible ? 'block' : 'none';
        if (isAdminsListVisible) await loadAdmins();
    });

    viewUsersBtn.addEventListener('click', async () => {
        isUsersListVisible = !isUsersListVisible;
        usersListContainer.style.display = isUsersListVisible ? 'block' : 'none';
        if (isUsersListVisible) await loadUsers();
    });

    viewContactsBtn.addEventListener('click', async () => {
        isContactsListVisible = !isContactsListVisible;
        contactsListContainer.style.display = isContactsListVisible ? 'block' : 'none';
        if (isContactsListVisible) await loadContacts();
    });

    addDataBtn.addEventListener('click', () => {
        window.location.href = 'addSensor.html';
    });

    manageDataBtn.addEventListener('click', () => {
        window.location.href = 'editSensor.html';
    });

    async function loadAdmins() {
        try {
            const res = await fetch('https://localhost:7073/api/admin/all');
            if (!res.ok) throw new Error('Could not load admins');

            const admins = await res.json();
            adminsList.innerHTML = '';

            admins.forEach(admin => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${admin.id}</td>
                    <td>${admin.username}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-admin" data-id="${admin.id}">Delete</button>
                    </td>
                `;
                adminsList.appendChild(row);
            });

            document.querySelectorAll('.delete-admin').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this admin?')) {
                        await deleteAdmin(id);
                        await loadAdmins();
                    }
                });
            });
        } catch (err) {
            console.error('Admin load failed:', err);
            adminsList.innerHTML = '<tr><td colspan="3">Error loading admins</td></tr>';
        }
    }

    async function loadUsers() {
        try {
            const res = await fetch('https://localhost:7073/api/user/all');
            if (!res.ok) throw new Error('Could not fetch users');

            const users = await res.json();
            usersList.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td><a href="mailto:${user.email}" class="email-link">${user.email}</a></td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Delete</button>
                    </td>
                `;
                usersList.appendChild(row);
            });

            document.querySelectorAll('.delete-user').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this user?')) {
                        await deleteUser(id);
                        await loadUsers();
                    }
                });
            });
        } catch (err) {
            console.error('User load error:', err);
            usersList.innerHTML = '<tr><td colspan="4">Unable to retrieve users</td></tr>';
        }
    }

    async function loadContacts() {
        try {
            const res = await fetch('https://localhost:7073/api/contact/all');
            if (!res.ok) throw new Error('Could not load contacts');

            const contacts = await res.json();
            contactsList.innerHTML = '';

            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td><a href="tel:${contact.phone}" class="phone-link">${contact.phone}</a></td>
                    <td><a href="mailto:${contact.email}" class="email-link">${contact.email}</a></td>
                    <td>${contact.message}</td>
                    <td>${new Date(contact.submittedAt).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-contact" data-id="${contact.id}">Delete</button>
                    </td>
                `;
                contactsList.appendChild(row);
            });

            document.querySelectorAll('.delete-contact').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('Delete this inquiry?')) {
                        await deleteContact(id);
                        await loadContacts();
                    }
                });
            });
        } catch (err) {
            console.error('Contact load failed:', err);
            contactsList.innerHTML = '<tr><td colspan="7">Error loading contact list</td></tr>';
        }
    }

    async function deleteAdmin(adminId) {
        try {
            const res = await fetch(`https://localhost:7073/api/admin/delete/${adminId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Admin deletion failed');

            const result = await res.json();
            alert(result.message);
        } catch (err) {
            console.error('Delete admin error:', err);
            alert('Unable to delete admin');
        }
    }

    async function deleteUser(userId) {
        try {
            const res = await fetch(`https://localhost:7073/api/user/delete/${userId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('User deletion failed');

            const result = await res.json();
            alert(result.message);
        } catch (err) {
            console.error('Delete user error:', err);
            alert('Unable to delete user');
        }
    }

    async function deleteContact(contactId) {
        try {
            const res = await fetch(`https://localhost:7073/api/contact/delete/${contactId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Contact deletion failed');

            const result = await res.json();
            alert(result.message);
        } catch (err) {
            console.error('Delete contact error:', err);
            alert('Unable to delete contact');
        }
    }
});
