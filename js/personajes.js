let currentItem = null;
let currentImages = [];

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
        
        content.innerHTML = data.map(personaje => `
            <div class="content-card">
                ${personaje.imagenes && personaje.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${personaje.imagenes.slice(0, 4).map((img, idx) => `
                            <div class="content-card-image">
                                <img src="${img}" alt="${personaje.nombre}">
                                ${personaje.imagenes.length > 4 && idx === 3 ? 
                                    `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold;">+${personaje.imagenes.length - 4}</div>` 
                                : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${personaje.nombre}</h3>
                    ${personaje.alias ? `<div class="content-card-field"><strong>Alias:</strong> ${personaje.alias}</div>` : ''}
                    ${personaje.personalidad ? `<div class="content-card-field"><strong>Personalidad:</strong> ${personaje.personalidad}</div>` : ''}
                    ${personaje.poder ? `<div class="content-card-field"><strong>Poder:</strong> ${personaje.poder}</div>` : ''}
                    ${personaje.habilidades ? `<div class="content-card-field"><strong>Habilidades:</strong> ${personaje.habilidades}</div>` : ''}
                    ${personaje.caracteristicas ? `<div class="content-card-field"><strong>Características:</strong> ${personaje.caracteristicas}</div>` : ''}
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${personaje.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${personaje.id})">🗑️ Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        content.innerHTML = '<p class="loading">Error al cargar los datos</p>';
    }
}

document.getElementById('addBtn')?.addEventListener('click', () => {
    currentItem = null;
    currentImages = [];
    document.getElementById('modalTitle').textContent = 'Agregar Personaje';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
});

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

document.getElementById('imagenes')?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('imagePreview');
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="image-preview-remove" onclick="this.parentElement.remove()">×</button>
            `;
            preview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
});

document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const alias = document.getElementById('alias').value;
    const personalidad = document.getElementById('personalidad').value;
    const poder = document.getElementById('poder').value;
    const habilidades = document.getElementById('habilidades').value;
    const caracteristicas = document.getElementById('caracteristicas').value;
    const imagenesFiles = Array.from(document.getElementById('imagenes').files);
    
    let imagenesUrls = currentItem?.imagenes || [];
    
    if (imagenesFiles.length > 0) {
        for (const file of imagenesFiles) {
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(fileName, file);
            
            if (uploadError) {
                alert('Error al subir imagen');
                console.error(uploadError);
                continue;
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from('imagenes')
                .getPublicUrl(fileName);
            
            imagenesUrls.push(publicUrl);
        }
    }
    
    const itemData = {
        nombre,
        alias,
        personalidad,
        poder,
        habilidades,
        caracteristicas,
        imagenes: imagenesUrls
    };
    
    try {
        if (currentItem) {
            const { error } = await supabase
                .from('personajes')
                .update(itemData)
                .eq('id', currentItem.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('personajes')
                .insert([itemData]);
            
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadPersonajes();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
});

async function editItem(id) {
    const { data, error } = await supabase
        .from('personajes')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    currentItem = data;
    document.getElementById('modalTitle').textContent = 'Editar Personaje';
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('alias').value = data.alias || '';
    document.getElementById('personalidad').value = data.personalidad || '';
    document.getElementById('poder').value = data.poder || '';
    document.getElementById('habilidades').value = data.habilidades || '';
    document.getElementById('caracteristicas').value = data.caracteristicas || '';
    
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (data.imagenes && data.imagenes.length > 0) {
        data.imagenes.forEach(img => {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `
                <img src="${img}" alt="Preview">
            `;
            preview.appendChild(div);
        });
    }
    
    document.getElementById('modal').classList.add('active');
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este personaje?')) return;
    
    const { error } = await supabase
        .from('personajes')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
        return;
    }
    
    loadPersonajes();
}

loadPersonajes();
