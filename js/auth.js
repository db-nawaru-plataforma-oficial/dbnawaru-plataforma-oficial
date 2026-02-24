// 1. Función para verificar si hay sesión de admin
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// 2. Función para MOSTRAR los elementos de administrador
function mostrarElementosAdmin() {
    const logueado = isAdmin();
    
    // Buscar los botones por sus IDs comunes
    const btnAdd = document.getElementById('addBtn');
    const btnLogout = document.getElementById('logoutBtn');
    const loginIcon = document.getElementById('loginIcon');

    if (logueado) {
        if (btnAdd) btnAdd.style.display = 'block';
        if (btnLogout) btnLogout.style.display = 'block';
        if (loginIcon) loginIcon.style.display = 'none';
        
        // Mostrar también los botones de editar/borrar dentro de las tarjetas
        document.querySelectorAll('.content-card-actions').forEach(div => {
            div.style.display = 'flex';
        });
    }
}

// 3. Ejecutar automáticamente al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    mostrarElementosAdmin();

    // Configurar el botón de Cerrar Sesión si existe
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        });
    }
});
