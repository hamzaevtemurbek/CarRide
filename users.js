const ADMIN_EMAIL = "hamzaevtemurbek@gmail.com";

function register() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regConfirm').value;

    if (!name || !email || !pass) return alert("Please fill all fields");
    if (pass !== confirm) return alert("Passwords do not match!");

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return alert("Email already registered!");

    users.push({
        name: name,
        email: email,
        pass: pass,
        isAdmin: email === ADMIN_EMAIL
    });

    localStorage.setItem('users', JSON.stringify(users));
    alert("Account created successfully!");
    window.location.href = "login.html";
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert("Welcome back, " + user.name + "!");
        window.location.href = "finalproject.html";
    } else {
        alert("Wrong email or password");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    alert("Logged out");
    window.location.href = "login.html";
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}
