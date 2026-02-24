// ====================================
// AUTENTICACIÓN
// ====================================

function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Manejo del formulario de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('nawaru_admin', 'true');
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = '❌ Usuario o contraseña incorrectos';
            errorMsg.style.display = 'block';
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 3000);
        }
    });
}

// Manejo del botón de logout
const logoutBtn = document.getElementById('logoutBtn');
const loginIcon = document.getElementById('loginIcon');

if (logoutBtn && loginIcon) {
    if (isAdmin()) {
        logoutBtn.style.display = 'block';
        loginIcon.style.display = 'none';
    }
    
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            localStorage.removeItem('nawaru_admin');
            window.location.href = 'index.html';
        }
    });
}

// Mostrar botón de agregar si es admin
const addBtn = document.getElementById('addBtn');
if (addBtn && isAdmin()) {
    addBtn.style.display = 'block';
}
