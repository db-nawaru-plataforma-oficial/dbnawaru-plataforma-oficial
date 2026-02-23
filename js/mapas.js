let currentItem = null;

async function loadMapas() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    try {
        const { data, error } = await supabase
            .from('mapas')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        loading.style.display = 'none';
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay mapas registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(mapa => `
            <div class="content-card">
                ${mapa.imagen ? `
                    <div class="content-card-images">
                        <div class="content-card-image">
                            <img src="${mapa.imagen}" alt="${mapa.nombre}">
                        </div>
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${mapa.nombre}</h3>
                    ${mapa.descripcion ? `<p class="content-card-desc">${mapa.descripcion}</p>` : ''}
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${mapa.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${mapa.id})">🗑️ Eliminar</button>
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
    document.getElementById('modalTitle').textContent = 'Agregar Mapa';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
});

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

document.getElementById('imagen')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('imagePreview').innerHTML = `
                <div class="image-preview-item">
                    <img src="${e.target.result}" alt="Preview">
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
});
document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];
    
    let imagenUrl = currentItem?.imagen || '';
    
    if (imagenFile) {
        const fileName = `${Date.now()}_${imagenFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('imagenes')
            .upload(fileName, imagenFile);
        
        if (uploadError) {
            alert('Error al subir la imagen');
            return;
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('imagenes')
            .getPublicUrl(fileName);
        
        imagenUrl = publicUrl;
    }
    
    const itemData = { nombre, descripcion, imagen: imagenUrl };
    
    try {
        if (currentItem) {
            const { error } = await supabase
                .from('mapas')
                .update(itemData)
                .eq('id', currentItem.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('mapas')
                .insert([itemData]);
            
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadMapas();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
});

async function editItem(id) {
    const { data, error } = await supabase
        .from('mapas')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    currentItem = data;
    document.getElementById('modalTitle').textContent = 'Editar Mapa';
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('descripcion').value = data.descripcion || '';
    
    if (data.imagen) {
        document.getElementById('imagePreview').innerHTML = `
            <div class="image-preview-item">
                <img src="${data.imagen}" alt="Preview">
            </div>
        `;
    }
    
    document.getElementById('modal').classList.add('active');
}
async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este mapa?')) return;
    
    const { error } = await supabase
        .from('mapas')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
        return;
    }
    
    loadMapas();
}

loadMapas();
