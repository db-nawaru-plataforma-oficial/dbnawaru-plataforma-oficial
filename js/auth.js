function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    if (loginForm) {
        // Limpiar localStorage por si acaso hay basura de sesiones viejas
        localStorage.removeItem('nawaru_admin');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Trim() elimina espacios accidentales al principio o final
            const userField = document.getElementById('username').value.trim();
            const passField = document.getElementById('password').value.trim();

            console.log("Intentando entrar con:", userField);

            if (userField === window.NAWARU_USER && passField === window.NAWARU_PASS) {
                console.log("✅ Acceso concedido");
                localStorage.setItem('nawaru_admin', 'true');
                window.location.href = 'index.html';
            } else {
                console.error("❌ Acceso denegado");
                if (errorMsg) {
                    errorMsg.textContent = 'Usuario o contraseña incorrectos. Revisa las mayúsculas.';
                    errorMsg.style.display = 'block';
                    errorMsg.style.background = 'rgba(255, 0, 0, 0.2)';
                    errorMsg.style.color = '#ff6b6b';
                }
            }
        });
    }

    // Botón Salir
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        });
    }
});
