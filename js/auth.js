/**
 * NAWARU - Sistema de Autenticación
 * Las credenciales ADMIN_USERNAME y ADMIN_PASSWORD se toman de js/config.js
 */

// Verificar si el usuario tiene una sesión activa de administrador
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Lógica del Formulario de Login (Solo para admin.html)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        // Comparamos con las variables globales definidas en config.js
        if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            // Redirigir al panel principal tras éxito
            window.location.href = 'index.html';
        } else {
            if (errorMsg) {
                errorMsg.textContent = 'Credenciales de Nawaru incorrectas';
                errorMsg.style.display = 'block';
                // Efecto visual de error
                errorMsg.style.animation = 'shake 0.5s';
                setTimeout(() => errorMsg.style.animation = '', 500);
            }
        }
    });
}

// Control de UI basado en permisos (Se ejecuta en todas las páginas)
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const loginIcon = document.getElementById('loginIcon');
    const addBtn = document.getElementById('addBtn');

    if (isAdmin()) {
        // MODO ADMIN: Mostrar herramientas de edición
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginIcon) loginIcon.style.display = 'none';
        if (addBtn) addBtn.style.display = 'block';
        
        // Mostrar botones de edición/borrado que puedan existir
        document.querySelectorAll('.content-card-actions').forEach(el => {
            el.style.display = 'flex';
        });
    } else {
        // MODO VISITANTE: Ocultar herramientas
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginIcon) loginIcon.style.display = 'block';
        if (addBtn) addBtn.style.display = 'none';
    }

    // Lógica del botón Cerrar Sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión de administrador?')) {
                localStorage.removeItem('nawaru_admin');
                window.location.href = 'index.html';
            }
        });
    }
});
