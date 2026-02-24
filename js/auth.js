/**
 * NAWARU - Sistema de Autenticación y Control de Interfaz
 */

// 1. Verificar si el usuario es administrador (Mira en el almacenamiento del navegador)
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// 2. Control de Interfaz (Mostrar/Ocultar botones)
function updateUI() {
    const logoutBtn = document.getElementById('logoutBtn');
    const loginIcon = document.getElementById('loginIcon');
    const addBtn = document.getElementById('addBtn');

    if (isAdmin()) {
        // MODO ADMIN: Mostrar todo
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (addBtn) addBtn.style.display = 'block';
        if (loginIcon) loginIcon.style.display = 'none';
        
        // Mostrar botones de editar/borrar en las tarjetas si existen
        document.querySelectorAll('.content-card-actions').forEach(el => {
            el.style.display = 'flex';
        });
        console.log("Panel de administración activo: Botones mostrados.");
    } else {
        // MODO VISITANTE: Ocultar herramientas
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (addBtn) addBtn.style.display = 'none';
        if (loginIcon) loginIcon.style.display = 'block';
    }
}

// 3. Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // Lógica del botón Cerrar Sesión
    const logoutBtn = document.getElementById('logoutBtn');
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

// Exponer updateUI globalmente por si otros scripts lo necesitan
window.updateUI = updateUI;
