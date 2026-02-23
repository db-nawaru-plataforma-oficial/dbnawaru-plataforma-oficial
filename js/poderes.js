let currentItem = null;

async function loadPoderes() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    try {
        const { data, error } = await supabase
            .from('poderes_elementales')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        loading.style.display = 'none';
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay poderes elementales registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(poder => `
            <div class="content-card">
                ${poder.imagenes && poder.imagenes.length > 0 ? `
                    <div class="content-card-images">
                        ${poder.imagenes.slice(0, 4).map((img, idx) => `
                            <div class="content-card-image">
                                <img src="${img}" alt="${poder.nombre}">
                                ${poder.imagenes.length > 4 && idx === 3 ? 
                                    `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold;">+${poder.imagenes.length - 4}</div>` 
                                : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${poder.nombre}</h3>
                    ${poder.descripcion ? `<p class="content-card-desc">${poder.descripcion}</p>` : ''}
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${poder.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${poder.id})">🗑️ Eliminar</button>
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
    document.getElementById('modalTitle').textContent = 'Agregar Poder Elemental';
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
    const descripcion = document.getElementById('descripcion').value;
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
        descripcion,
        imagenes: imagenesUrls
    };
    
    try {
        if (currentItem) {
            const { error } = await supabase
                .from('poderes_elementales')
                .update(itemData)
                .eq('id', currentItem.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('poderes_elementales')
                .insert([itemData]);
            
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadPoderes();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
});

async function editItem(id) {
    const { data, error } = await supabase
        .from('poderes_elementales')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    currentItem = data;
    document.getElementById('modalTitle').textContent = 'Editar Poder Elemental';
    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('descripcion').value = data.descripcion || '';
    
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
      if (data.imagenes && data.imagenes.length > 0) {
        data.imagenes.forEach(img => {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `<img src="${img}" alt="Preview">`;
            preview.appendChild(div);
        });
    }
    
    document.getElementById('modal').classList.add('active');
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este poder elemental?')) return;
    
    const { error } = await supabase
        .from('poderes_elementales')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
        return;
    }
    
    loadPoderes();
}

loadPoderes();
