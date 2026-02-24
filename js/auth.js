// Verificar si el usuario es administrador
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Lógica de Login (admin.html)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        // Usamos las constantes definidas en config.js
        if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            window.location.href = 'index.html';
        } else {
            if (errorMsg) {
                errorMsg.textContent = 'Credenciales de Nawaru incorrectas';
                errorMsg.style.display = 'block';
            }
        }
    });
}

// Control de interfaz al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const addBtn = document.getElementById('addBtn');
    const loginIcon = document.getElementById('loginIcon');

    if (isAdmin()) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (addBtn) addBtn.style.display = 'block';
        if (loginIcon) loginIcon.style.display = 'none';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        });
    }
});
