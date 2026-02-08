// App State
const AppState = {
    currentUser: null,
    currentSection: 'reinos',
    data: {
        reinos: [],
        personajes: [],
        razas: [],
        animales: [],
        mapa: [],
        poderes: [],
        diccionario: [],
        galeria: []
    },
    users: {
        '@nawaru': { password: 'dbnawaru#2026', role: 'admin', name: 'Administrador' },
        'fannawaru': { password: 'nawarus', role: 'guest', name: 'Invitado' }
    }
};

// Database Manager (using Supabase or localStorage as fallback)
const DatabaseManager = {
    useSupabase: typeof window.supabaseClient !== 'undefined',

    async loadData() {
        if (this.useSupabase) {
            return await this.loadFromSupabase();
        } else {
            return this.loadFromLocalStorage();
        }
    },

    async saveData(section, data) {
        if (this.useSupabase) {
            return await this.saveToSupabase(section, data);
        } else {
            return this.saveToLocalStorage(section, data);
        }
    },

    async deleteData(section, id) {
        if (this.useSupabase) {
            return await this.deleteFromSupabase(section, id);
        } else {
            return this.deleteFromLocalStorage(section, id);
        }
    },

    // Supabase methods
    async loadFromSupabase() {
        try {
            const sections = Object.keys(AppState.data);
            
            for (const section of sections) {
                const { data, error } = await window.supabaseClient
                    .from(section)
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                AppState.data[section] = data || [];
            }
            
            return true;
        } catch (error) {
            console.error('Error loading from Supabase:', error);
            return this.loadFromLocalStorage();
        }
    },

    async saveToSupabase(section, itemData) {
        try {
            const { data, error } = await window.supabaseClient
                .from(section)
                .insert([itemData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error saving to Supabase:', error);
            return null;
        }
    },

    async deleteFromSupabase(section, id) {
        try {
            const { error } = await window.supabaseClient
                .from(section)
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting from Supabase:', error);
            return false;
        }
    },

    // LocalStorage methods
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('nawaruData');
            if (saved) {
                AppState.data = JSON.parse(saved);
            }
            return true;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return false;
        }
    },

    saveToLocalStorage(section, itemData) {
        try {
            AppState.data[section].push(itemData);
            localStorage.setItem('nawaruData', JSON.stringify(AppState.data));
            return itemData;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return null;
        }
    },

    deleteFromLocalStorage(section, id) {
        try {
            AppState.data[section] = AppState.data[section].filter(item => item.id !== id);
            localStorage.setItem('nawaruData', JSON.stringify(AppState.data));
            return true;
        } catch (error) {
            console.error('Error deleting from localStorage:', error);
            return false;
        }
    }
};

// Auth Manager
const AuthManager = {
    login(username, password) {
        const user = AppState.users[username];
        
        if (user && user.password === password) {
            AppState.currentUser = {
                username: username,
                role: user.role,
                name: user.name
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
            return true;
        }
        
        return false;
    },

    logout() {
        AppState.currentUser = null;
        sessionStorage.removeItem('currentUser');
    },

    checkSession() {
        const saved = sessionStorage.getItem('currentUser');
        if (saved) {
            AppState.currentUser = JSON.parse(saved);
            return true;
        }
        return false;
    },

    isAdmin() {
        return AppState.currentUser && AppState.currentUser.role === 'admin';
    }
};

// UI Manager
const UIManager = {
    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    },

    showApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        document.getElementById('welcomeMsg').textContent = `Bienvenido, ${AppState.currentUser.name}`;
        
        this.updateAdminControls();
        this.updateAllSections();
    },

    showError(message) {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 3000);
    },

    updateAdminControls() {
        const adminControls = document.querySelectorAll('.admin-controls');
        const isAdmin = AuthManager.isAdmin();
        
        adminControls.forEach(control => {
            control.style.display = isAdmin ? 'block' : 'none';
        });
    },

    showSection(section) {
        AppState.currentSection = section;
        
        // Update tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.section === section) {
                tab.classList.add('active');
            }
        });
        
        // Update sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        document.getElementById(section).classList.add('active');
        ContentManager.renderSection(section);
    },

    updateAllSections() {
        Object.keys(AppState.data).forEach(section => {
            ContentManager.renderSection(section);
        });
    },

    clearForm(section) {
        const nombreInput = document.getElementById(`${section}-nombre`);
        const descInput = document.getElementById(`${section}-desc`);
        const imagenInput = document.getElementById(`${section}-imagen`);
        
        if (nombreInput) nombreInput.value = '';
        if (descInput) descInput.value = '';
        if (imagenInput) imagenInput.value = '';
    }
};

// Content Manager
const ContentManager = {
    carouselSections: ['razas', 'animales', 'mapa', 'galeria'],

    async addContent(section) {
        const nombre = document.getElementById(`${section}-nombre`).value.trim();
        const desc = document.getElementById(`${section}-desc`).value.trim();
        const imagenInput = document.getElementById(`${section}-imagen`);
        const imagen = imagenInput ? imagenInput.value.trim() : '';
        
        if (!nombre || !desc) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        const item = {
            id: Date.now(),
            nombre: nombre,
            descripcion: desc,
            imagen: imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen',
            created_at: new Date().toISOString()
        };
        
        const saved = await DatabaseManager.saveData(section, item);
        
        if (saved) {
            // Update local state if using Supabase
            if (DatabaseManager.useSupabase) {
                AppState.data[section].unshift(saved);
            }
            
            UIManager.clearForm(section);
            this.renderSection(section);
        } else {
            alert('Error al guardar el contenido');
        }
    },

    async deleteItem(section, id) {
        if (!confirm('¿Estás seguro de eliminar este elemento?')) {
            return;
        }
        
        const deleted = await DatabaseManager.deleteData(section, id);
        
        if (deleted) {
            AppState.data[section] = AppState.data[section].filter(item => item.id !== id);
            this.renderSection(section);
        } else {
            alert('Error al eliminar el contenido');
        }
    },

    renderSection(section) {
        if (this.carouselSections.includes(section)) {
            this.renderCarousel(section);
        } else {
            this.renderCards(section);
        }
    },

    renderCards(section) {
        const container = document.getElementById(`${section}-content`);
        const items = AppState.data[section];
        
        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No hay contenido disponible</p></div>';
            return;
        }
        
        const isAdmin = AuthManager.isAdmin();
        
        container.innerHTML = items.map(item => `
            <div class="card">
                <h4>${this.escapeHtml(item.nombre)}</h4>
                <p>${this.escapeHtml(item.descripcion)}</p>
                ${isAdmin ? 
                    `<button class="delete-btn" onclick="ContentManager.deleteItem('${section}', ${item.id})">Eliminar</button>` 
                    : ''}
            </div>
        `).join('');
    },

    renderCarousel(section) {
        const container = document.getElementById(`${section}-carousel-items`);
        const items = AppState.data[section];
        
        if (items.length === 0) {
            container.innerHTML = '<div class="carousel-item"><div class="empty-state"><p>No hay contenido disponible</p></div></div>';
            return;
        }
        
        const isAdmin = AuthManager.isAdmin();
        
        container.innerHTML = items.map(item => `
            <div class="carousel-item">
                <img src="${this.escapeHtml(item.imagen)}" 
                     alt="${this.escapeHtml(item.nombre)}" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=Error+al+cargar'">
                <div class="caption">
                    <h4>${this.escapeHtml(item.nombre)}</h4>
                    <p>${this.escapeHtml(item.descripcion)}</p>
                    ${isAdmin ? 
                        `<button class="delete-btn" onclick="ContentManager.deleteItem('${section}', ${item.id})">Eliminar</button>` 
                        : ''}
                </div>
            </div>
        `).join('');
    },

    scrollCarousel(section, direction) {
        const carousel = document.getElementById(`${section}-carousel-items`);
        const itemWidth = carousel.querySelector('.carousel-item')?.offsetWidth || 0;
        carousel.scrollBy({ left: itemWidth * direction, behavior: 'smooth' });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Event Listeners
function initializeEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (AuthManager.login(username, password)) {
            await DatabaseManager.loadData();
            UIManager.showApp();
        } else {
            UIManager.showError('Usuario o contraseña incorrectos');
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        AuthManager.logout();
        UIManager.showLogin();
    });

    // Navigation tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            UIManager.showSection(tab.dataset.section);
        });
    });

    // Add buttons
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            await ContentManager.addContent(btn.dataset.section);
        });
    });

    // Carousel navigation
    document.querySelectorAll('.carousel-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            ContentManager.scrollCarousel(btn.dataset.section, -1);
        });
    });

    document.querySelectorAll('.carousel-next').forEach(btn => {
        btn.addEventListener('click', () => {
            ContentManager.scrollCarousel(btn.dataset.section, 1);
        });
    });
}

// Initialize app
async function initializeApp() {
    initializeEventListeners();
    
    // Check if user has active session
    if (AuthManager.checkSession()) {
        await DatabaseManager.loadData();
        UIManager.showApp();
    } else {
        UIManager.showLogin();
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Make ContentManager available globally for onclick handlers
window.ContentManager = ContentManager;
