// Variable global para el ítem a editar
window.currentItem = null;

// Función para verificar admin sin detener el resto del código
async function checkAdminSafely() {
    try {
        const addBtn = document.getElementById('addBtn');
        if (!supabase) return false;

        const { data: { session } } = await supabase.auth.getSession();
        const esAdmin = !!(session && typeof isAdmin === 'function' && isAdmin());

        if (addBtn) {
            addBtn.style.setProperty('display', esAdmin ? 'block' : 'none', 'important');
        }
        return esAdmin;
    } catch (e) {
        console.warn("Error verificando sesión, continuando como usuario público.");
        return false;
    }
}

async function loadAnimales() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    if (!content) return; // Seguridad si el DOM no está listo

    try {
        // 1. Intentar verificar admin (sin morir si falla)
        const esAdmin = await checkAdminSafely();

        if (!supabase) {
            content.innerHTML = '<p class="loading">⚠️ Error de conexión con la base de datos.</p>';
            if (loading) loading.style.display = 'none';
            return;
        }

        // 2. Traer datos de la tabla
        const { data, error } = await supabase
            .from('animales_espirituales')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (loading) loading.style.display = 'none';

        if (!data || data.length === 0) {
            content.innerHTML = '<p class="loading">No hay animales registrados aún.</p>';
            return;
        }

        // 3. Dibujar las tarjetas
        content.innerHTML = data.map(animal => `
            <div class="content-card">
                ${animal.imagenes && animal.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${animal.imagenes.slice(0, 4).map((img, idx) => `
                            <div class="content-card-image">
                                <img src="${img}" alt="${animal.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Error+Imagen'">
                                ${animal.imagenes.length > 4 && idx === 3 ? 
                                    `<div class="overlay">+${animal.imagenes.length - 4}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${animal.nombre}</h3>
                    <p class="content-card-desc">${animal.descripcion || ''}</p>
                </div>
                ${esAdmin ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="window.editItem(${animal.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="window.deleteItem(${animal.id})">🗑️ Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `).join('');

    } catch (error) {
        console.error('Error cargando animales:', error);
        if (loading) loading.style.display = 'none';
        content.innerHTML = `<p class="loading">❌ Error al cargar datos. Verifica la consola (F12).</p>`;
    }
}

// Hacer las funciones de edición disponibles globalmente para los botones HTML
window.editItem = async (id) => {
    const { data } = await supabase.from('animales_espirituales').select('*').eq('id', id).single();
    if (data) {
        window.currentItem = data;
        document.getElementById('modalTitle').innerText = "Editar Animal";
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('descripcion').value = data.descripcion;
        document.getElementById('modal').classList.add('active');
    }
};

window.deleteItem = async (id) => {
    if (confirm("¿Seguro que quieres borrarlo?")) {
        await supabase.from('animales_espirituales').delete().eq('id', id);
        loadAnimales();
    }
};

// Escuchar cambios de sesión
if (supabase) {
    supabase.auth.onAuthStateChange(() => {
        loadAnimales();
    });
}

// EJECUCIÓN AL CARGAR
document.addEventListener('DOMContentLoaded', () => {
    loadAnimales();
});
