// Verificar si es admin
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
const loginIcon = document.getElementById('loginIcon');

if (logoutBtn && loginIcon) {
    if (isAdmin()) {
        logoutBtn.style.display = 'block';
        loginIcon.style.display = 'none';
    }
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('nawaru_admin');
        window.location.href = 'index.html';
    });
}

// Mostrar botón agregar si es admin
const addBtn = document.getElementById('addBtn');
if (addBtn && isAdmin()) {
    addBtn.style.display = 'block';
}
