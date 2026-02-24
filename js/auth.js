// Función para verificar si el usuario es administrador
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Lógica de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();
        const errorMsg = document.getElementById('errorMsg');
        
        // Comparamos con las constantes de config.js
        if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            window.location.href = 'index.html';
        } else {
            if (errorMsg) {
                errorMsg.textContent = 'Usuario o contraseña incorrectos';
                errorMsg.style.display = 'block';
            }
        }
    });
}

// Lógica de Logout y Control de Interfaz
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
