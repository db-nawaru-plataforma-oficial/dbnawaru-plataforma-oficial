// 1. Definir credenciales si no vienen de config.js (Cámbialas por las tuyas)
const ADMIN_USERNAME = "admin"; 
const ADMIN_PASSWORD = "123"; 

// Verificar si el usuario está logueado
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Lógica de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            // Redirigir al inicio
            window.location.href = 'index.html';
        } else {
            if (errorMsg) {
                errorMsg.textContent = 'Usuario o contraseña incorrectos';
                errorMsg.style.display = 'block';
            }
        }
    });
}

// Lógica de Logout y Vista de Admin
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const loginIcon = document.getElementById('loginIcon');
    const addBtn = document.getElementById('addBtn');

    if (isAdmin()) {
        // Si es admin, mostrar botón cerrar sesión y ocultar login
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
