let currentItem = null;

// NUEVA FUNCIÓN: Controla la visibilidad de elementos según la sesión
async function checkAuth() {
    const addBtn = document.getElementById('addBtn');
    
    // Verificamos si existe una sesión activa en Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si hay sesión y la función isAdmin (de auth.js) devuelve true
    if (session && typeof isAdmin === 'function' && isAdmin()) {
        if (addBtn) addBtn.style.display = 'block';
    } else {
        if (addBtn) addBtn.style.display = 'none';
    }
}

async function loadAnimales() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    // Ejecutamos la verificación de botones al cargar la lista
    await checkAuth();
    
    if (!supabase) {
        content.innerHTML = '<p class="loading">⚠️ Error: Supabase no configurado</p>';
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
            content.innerHTML = '<p class="loading">No hay animales espirituales registrados</p>';
            return;
        }
        
        // Obtenemos el estado de admin una sola vez para el mapeo
        const isUserAdmin = typeof isAdmin === 'function' && isAdmin();
        
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
                ${isUserAdmin ? `
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
        content.innerHTML = '<p class="loading">❌ Error al cargar los datos</p>';
    }
}

// ... (Resto de eventos: addBtn, closeModal, modal click, imagenes change se mantienen igual)

// Modificación en el evento de guardado para recargar con verificación
document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Guardando...';
    
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const imagenesFiles = Array.from(document.getElementById('imagenes').files);
    let imagenesUrls = currentItem?.imagenes || [];
    
    try {
        if (imagenesFiles.length > 0) {
            for (const file of imagenesFiles) {
                const fileName = `animales/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
                const { error: uploadError } = await supabase.storage.from('imagenes').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName);
                imagenesUrls.push(publicUrl);
            }
        }
        
        const itemData = { nombre, descripcion, imagenes: imagenesUrls };
        
        if (currentItem) {
            const { error } = await supabase.from('animales_espirituales').update(itemData).eq('id', currentItem.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('animales_espirituales').insert([itemData]);
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadAnimales(); // Recarga la lista y verifica auth
        
    } catch (error) {
        alert('❌ Error al guardar: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Guardar';
    }
});

// Escuchar cambios de autenticación en tiempo real
supabase.auth.onAuthStateChange(() => {
    checkAuth();
    loadAnimales();
});

// Inicio
loadAnimales();
