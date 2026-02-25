// Función para verificar y MOSTRAR el botón
async function verificarAdminYMostrarBoton() {
    const addBtn = document.getElementById('addBtn');
    if (!addBtn) return;

    // 1. Obtener la sesión actual
    const { data: { session } } = await supabase.auth.getSession();

    // 2. Verificar si es admin (usando la función de tu auth.js)
    if (session && typeof isAdmin === 'function' && isAdmin()) {
        console.log("🔓 Acceso admin detectado. Mostrando botón.");
        addBtn.style.setProperty('display', 'block', 'important'); // Forzamos la visibilidad
    } else {
        console.log("🔒 Acceso público. Botón oculto.");
        addBtn.style.setProperty('display', 'none', 'important');
    }
}

// Escuchar cambios de sesión (Login/Logout)
supabase.auth.onAuthStateChange(() => {
    verificarAdminYMostrarBoton();
    loadAnimales();
});

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    verificarAdminYMostrarBoton();
    loadAnimales();
});
