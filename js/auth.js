function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userField = document.getElementById('username').value;
            const passField = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            // Usamos las variables que inyectamos en window
            if (userField === window.NAWARU_USER && passField === window.NAWARU_PASS) {
                localStorage.setItem('nawaru_admin', 'true');
                window.location.href = 'index.html';
            } else {
                if (errorMsg) {
                    errorMsg.textContent = 'Credenciales Incorrectas';
                    errorMsg.style.display = 'block';
                    errorMsg.style.color = '#ff4d4d';
                }
            }
        });
    }

    // Lógica para mostrar/ocultar botones de admin
    const logoutBtn = document.getElementById('logoutBtn');
    if (isAdmin()) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        document.querySelectorAll('#addBtn').forEach(b => b.style.display = 'block');
    }
});
