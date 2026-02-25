let currentItem = null;

// Función para verificar si el usuario es Admin (Compatible con GitHub Pages)
async function checkAdminStatus() {
    const addBtn = document.getElementById('addBtn');
    
    // Obtenemos la sesión de forma asíncrona
    const { data: { session } } = await supabase.auth.getSession();
    
    // Verificamos si existe la función isAdmin en auth.js y si hay sesión
    const esAdmin = session && typeof isAdmin === 'function' && isAdmin();

    if (addBtn) {
        if (esAdmin) {
            addBtn.style.setProperty('display', 'block', 'important');
        } else {
            addBtn.style.setProperty('display', 'none', 'important');
        }
    }
    return esAdmin;
}

async function loadAnimales() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    // Esperamos a verificar el admin antes de dibujar las tarjetas
    const esAdmin = await checkAdminStatus();
    
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
            content.innerHTML = '<p class="loading">No hay animales registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(animal => `
            <div class="content-card">
                ${animal.imagenes && animal.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${animal.imagenes.slice(0, 4).map((img, idx) => `
                            <div class="content-card-image">
                                <img src="${img}" alt="${animal.nombre}" loading="lazy">
                                ${animal.imagenes.length > 4 && idx === 3 ? 
                                    `<div class="more-photos-overlay">+${animal.imagenes.length - 4}</div>` 
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
        if(loading) loading.style.display = 'none';
        content.innerHTML = '<p class="loading">❌ Error al cargar los datos</p>';
    }
}

// Escuchar cambios de autenticación en tiempo real
supabase.auth.onAuthStateChange(() => {
    checkAdminStatus();
    loadAnimales();
});

// EVENTOS DE INTERFAZ
document.getElementById('addBtn')?.addEventListener('click', () => {
    currentItem = null;
    document.getElementById('modalTitle').textContent = 'Agregar Animal Espiritual';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
});

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

// Manejo de imágenes (Preview)
document.getElementById('imagenes')?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
});

// GUARDAR DATOS
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
        // Subida de imágenes a Storage
        if (imagenesFiles.length > 0) {
            for (const file of imagenesFiles) {
                const fileName = `animales/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                const { error: uploadError } = await supabase.storage
                    .from('imagenes')
                    .upload(fileName, file);
                
                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage
                    .from('imagenes')
                    .getPublicUrl(fileName);
                
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
        loadAnimales();
        
    } catch (error) {
        alert('❌ Error: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Guardar';
    }
});

// Funciones globales para botones dinámicos
window.editItem = async (id) => {
    try {
        const { data, error } = await supabase.from('animales_espirituales').select('*').eq('id', id).single();
        if (error) throw error;
        
        currentItem = data;
        document.getElementById('modalTitle').textContent = 'Editar Animal';
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('descripcion').value = data.descripcion;
        document.getElementById('modal').classList.add('active');
    } catch (e) { alert("Error al cargar datos"); }
};

window.deleteItem = async (id) => {
    if (confirm('¿Eliminar este registro?')) {
        await supabase.from('animales_espirituales').delete().eq('id', id);
