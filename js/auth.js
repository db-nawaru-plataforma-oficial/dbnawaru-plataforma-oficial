// Verificar si el usuario está logueado
function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = 'Usuario o contraseña incorrectos';
            errorMsg.style.display = 'block';
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    if (isAdmin()) {
        logoutBtn.style.display = 'block';
        document.getElementById('loginIcon').style.display = 'none';
    }
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('nawaru_admin');
        window.location.href = 'index.html';
    });
}

// Mostrar/ocultar botones de admin
const addBtn = document.getElementById('addBtn');
if (addBtn && isAdmin()) {
    addBtn.style.display = 'block';
}
📄
