// ====================================
// AUTENTICACIÓN - CORREGIDO
// ====================================

function isAdmin() {
    return localStorage.getItem('nawaru_admin') === 'true';
}

// Manejo del formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');
        
        console.log('Intento de login:', username); // Para debug
        
        // Credenciales exactas
        if (username === 'Nawaru' && password === 'JAO#2026') {
            localStorage.setItem('nawaru_admin', 'true');
            alert('✅ Login exitoso');
            window.location.href = 'index.html';
        } else {
            errorMsg.textContent = '❌ Usuario o contraseña incorrectos';
            errorMsg.style.display = 'block';
            
            // Mostrar ayuda
            setTimeout(() => {
                errorMsg.innerHTML = `
                    ❌ Usuario o contraseña incorrectos<br>
                    <small style="color: #999;">Usuario: Nawaru | Contraseña: JAO#2026</small>
                `;
            }, 1000);
            
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
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

// Debug: Mostrar estado actual
console.log('Estado admin:', isAdmin());
