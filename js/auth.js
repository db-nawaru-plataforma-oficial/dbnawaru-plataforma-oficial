// Función para verificar si es admin
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Lógica de Login mejorada
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            // Usamos window. para asegurar que leemos de config.js
            if (user === window.ADMIN_USERNAME && pass === window.ADMIN_PASSWORD) {
                localStorage.setItem('nawaru_admin', 'true');
                window.location.href = 'index.html';
            } else {
                if (errorMsg) {
                    errorMsg.textContent = 'Usuario o contraseña de Nawaru incorrectos';
                    errorMsg.style.display = 'block';
                    errorMsg.style.color = '#ff4d4d';
                }
            }
        });
    }

    // Botón cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        });
    }
});
