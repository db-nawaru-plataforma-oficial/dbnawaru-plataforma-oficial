let currentItem = null;

// Cargar Personajes
async function loadPersonajes() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    try {
        const { data, error } = await supabase
            .from('personajes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        loading.style.display = 'none';
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay personajes registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(pj => `
            <div class="content-card">
                ${pj.imagenes && pj.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${pj.imagenes.map(img => `
                            <div class="content-card-image">
                                <img src="${img}" alt="${pj.nombre}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${pj.nombre}</h3>
                    <p><strong>Alias:</strong> ${pj.alias || 'Ninguno'}</p>
                    <p><strong>Poder:</strong> ${pj.poder || 'Desconocido'}</p>
                    <p class="content-card-desc">${pj.personalidad || ''}</p>
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${pj.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${pj.id})">🗑️ Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

// GUARDAR (INSERT O UPDATE) con subida de imágenes
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnGuardar = e.target.querySelector('button[type="submit"]');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    const files = document.getElementById('imagenes').files;
    let urls = currentItem ? (currentItem.imagenes || []) : [];

    try {
        // 1. Subir archivos al Storage (Bucket: 'imagenes')
        for (const file of files) {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const { data, error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            if (data) {
                const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName);
                urls.push(publicUrl);
            }
        }

        const itemData = {
            nombre: document.getElementById('nombre').value,
            alias: document.getElementById('alias').value,
            personalidad: document.getElementById('personalidad').value,
            poder: document.getElementById('poder').value,
            habilidades: document.getElementById('habilidades').value,
            caracteristicas: document.getElementById('caracteristicas').value,
            imagenes: urls
        };

        if (currentItem) {
            const { error } = await supabase.from('personajes').update(itemData).eq('id', currentItem.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('personajes').insert([itemData]);
            if (error) throw error;
        }

        location.reload();
    } catch (error) {
        alert('Error: ' + error.message);
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar';
    }
});

// Función para abrir modal de edición
async function editItem(id) {
    const { data, error } = await supabase.from('personajes').select('*').eq('id', id).single();
    if (error) return;
    
    currentItem = data;
    document.getElementById('modalTitle').textContent = 'Editar Personaje';
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('alias').value = data.alias || '';
    document.getElementById('personalidad').value = data.personalidad || '';
    document.getElementById('poder').value = data.poder || '';
    document.getElementById('habilidades').value = data.habilidades || '';
    document.getElementById('caracteristicas').value = data.caracteristicas || '';
    
    document.getElementById('modal').classList.add('active');
}

async function deleteItem(id) {
    if (!confirm('¿Borrar personaje?')) return;
    await supabase.from('personajes').delete().eq('id', id);
    loadPersonajes();
}

document.getElementById('addBtn')?.addEventListener('click', () => {
    currentItem = null;
    document.getElementById('itemForm').reset();
    document.getElementById('modalTitle').textContent = 'Agregar Personaje';
    document.getElementById('modal').classList.add('active');
});

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

loadPersonajes();
