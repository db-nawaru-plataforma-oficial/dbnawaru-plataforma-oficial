// Verificar si el usuario está logueado
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Lógica de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        // Validación contra las constantes de config.js
        if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            // Redirigir al panel principal
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = 'Usuario o contraseña incorrectos';
            errorMsg.style.display = 'block';
        }
    });
}

// Lógica de Logout y Visibilidad
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const loginIcon = document.getElementById('loginIcon');
    const addBtn = document.getElementById('addBtn');

    if (isAdmin()) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginIcon) loginIcon.style.display = 'none';
        if (addBtn) addBtn.style.display = 'block';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        });
    }
});
