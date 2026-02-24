function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        // Limpiamos cualquier error previo al cargar
        localStorage.removeItem('nawaru_admin');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtenemos los valores y quitamos espacios vacíos
            const userIn = document.getElementById('username').value.trim();
            const passIn = document.getElementById('password').value.trim();
            const errorMsg = document.getElementById('errorMsg');

            // COMPARACIÓN DE FUERZA BRUTA (Hardcoded)
            // Si el usuario es 'Nawaru' y la clave 'JAO2026'
            if (userIn === "Nawaru" && passIn === "JAO2026") {
                console.log("Acceso de Emergencia: OK");
                localStorage.setItem('nawaru_admin', 'true');
                window.location.href = 'index.html';
            } 
            else {
                if (errorMsg) {
                    errorMsg.textContent = 'Error: Revisa que Nawaru y JAO2026 estén bien escritos.';
                    errorMsg.style.display = 'block';
                    errorMsg.style.background = '#441111';
                    errorMsg.style.color = '#ff9999';
                }
            }
        });
    }

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        });
    }
});
