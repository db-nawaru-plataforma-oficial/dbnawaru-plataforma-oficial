let currentItem = null;

// 1. Función para controlar la visibilidad del botón de agregar y acciones
async function actualizarInterfazAdmin() {
    const addBtn = document.getElementById('addBtn');
    
    // Obtenemos la sesión actual de Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    // Verificamos si hay sesión y si la función isAdmin() existe y es true
    const esAdmin = session && typeof isAdmin === 'function' && isAdmin();

    if (addBtn) {
        if (esAdmin) {
            addBtn.style.setProperty('display', 'block', 'important');
            console.log("✅ Admin detectado: Mostrando botón agregar");
        } else {
            addBtn.style.display = 'none';
            console.log("ℹ️ Usuario no admin: Ocultando botón agregar");
        }
    }
    return esAdmin;
}

async function loadAnimales() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    // Verificamos admin antes de cargar contenido
    const esAdmin = await actualizarInterfazAdmin();
    
    if (!supabase) {
        content.innerHTML = '<p class="loading">⚠️ Error: Supabase no conectado</p>';
        loading.style.display = 'none';
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('animales_espirituales')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        loading.style.display = 'none';
        
        if (!data || data.length === 0) {
            content.innerHTML = '<p class="loading">No hay animales registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(animal => `
            <div class="content-card">
                ${animal.imagenes && animal.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${animal.imagenes.slice(0, 4).map((img, idx) => `
                            <div class="content-card-image">
                                <img src="${img}" alt="${animal.nombre}">
                                ${animal.imagenes.length > 4 && idx === 3 ? 
                                    `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold;">+${animal.imagenes.length - 4}</div>` 
                                : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${animal.nombre}</h3>
                    ${animal.descripcion ? `<p class="content-card-desc">${animal.descripcion}</p>` : ''}
                </div>
                ${esAdmin ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${animal.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${animal.id})">🗑️ Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        content.innerHTML = '<p class="loading">❌ Error al cargar datos</p>';
    }
}

// Escuchar cambios de sesión en tiempo real (Login/Logout)
supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Cambio de sesión detectado:", event);
    await actualizarInterfazAdmin();
    loadAnimales();
});

// Eventos de formulario (Se mantienen igual)
document.getElementById('addBtn')?.addEventListener('click', () => {
    currentItem = null;
    document.getElementById('modalTitle').textContent = 'Agregar Animal Espiritual';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
});

// ... (Resto de funciones: editItem, deleteItem, etc.)

// Carga inicial
loadAnimales();
