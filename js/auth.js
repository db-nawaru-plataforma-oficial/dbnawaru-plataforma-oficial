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
        
        // Usamos las variables que vienen de config.js
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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

// Lógica de Vista de Admin (Activa los botones)
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const loginIcon = document.getElementById('loginIcon');
    const addBtn = document.getElementById('addBtn');

    if (isAdmin()) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginIcon) loginIcon.style.display = 'none';
        if (addBtn) addBtn.style.display = 'block';
        
        // Esto asegura que los botones de editar/borrar en las tarjetas se vean
        const style = document.createElement('style');
        style.innerHTML = '.content-card-actions { display: flex !important; }';
        document.head.appendChild(style);
    }
});
