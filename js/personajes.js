let currentItem = null;

// Cargar Personajes desde la base de datos
async function loadPersonajes() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    try {
        const { data, error } = await window.supabase
            .from('personajes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (loading) loading.style.display = 'none';
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay personajes registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(pj => `
            <div class="content-card">
                ${pj.imagenes && pj.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${pj.imagenes.map(img => `
                            <div class="content-card-image"><img src="${img}"></div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${pj.nombre}</h3>
                    <p><strong>Alias:</strong> ${pj.alias || 'N/A'}</p>
                    <p class="content-card-desc">${pj.personalidad || ''}</p>
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button onclick="editItem(${pj.id})">✏️</button>
                        <button onclick="deleteItem(${pj.id})">🗑️</button>
                    </div>` : ''}
            </div>
        `).join('');
    } catch (err) {
        console.error('Error cargando personajes:', err);
    }
}

// Guardar (Insertar o Editar)
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
        const fileInput = document.getElementById('imagenes');
        const files = fileInput.files;
        let urls = currentItem ? (currentItem.imagenes || []) : [];

        // Subir imágenes nuevas si existen
        for (const file of files) {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const { data, error: upError } = await window.supabase.storage
                .from('imagenes') // DEBES TENER UN BUCKET PÚBLICO LLAMADO 'imagenes'
                .upload(fileName, file);

            if (upError) throw upError;

            const { data: { publicUrl } } = window.supabase.storage.from('imagenes').getPublicUrl(fileName);
            urls.push(publicUrl);
        }

        const payload = {
            nombre: document.getElementById('nombre').value,
            alias: document.getElementById('alias').value,
            personalidad: document.getElementById('personalidad').value,
            poder: document.getElementById('poder').value,
            habilidades: document.getElementById('habilidades').value,
            caracteristicas: document.getElementById('caracteristicas').value,
            imagenes: urls
        };

        if (currentItem) {
            const { error } = await window.supabase.from('personajes').update(payload).eq('id', currentItem.id);
            if (error) throw error;
        } else {
            const { error } = await window.supabase.from('personajes').insert([payload]);
            if (error) throw error;
        }

        location.reload();
    } catch (err) {
        alert("Error: " + err.message);
        btn.disabled = false;
        btn.textContent = 'Guardar';
    }
});

// Editar
async function editItem(id) {
    const { data, error } = await window.supabase.from('personajes').select('*').eq('id', id).single();
    if (error) return;
    currentItem = data;
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('alias').value = data.alias || '';
    document.getElementById('personalidad').value = data.personalidad || '';
    document.getElementById('modal').classList.add('active');
}

// Eliminar
async function deleteItem(id) {
    if (!confirm('¿Eliminar personaje?')) return;
    await window.supabase.from('personajes').delete().eq('id', id);
    loadPersonajes();
}

// Iniciar proceso
document.addEventListener('DOMContentLoaded', loadPersonajes);
