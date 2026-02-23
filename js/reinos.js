let currentItem = null;

// Cargar reinos
async function loadReinos() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    try {
        const { data, error } = await supabase
            .from('reinos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        loading.style.display = 'none';
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay reinos registrados</p>';
            return;
        }
        
        content.innerHTML = data.map(reino => `
            <div class="content-card">
                ${reino.imagen ? `
                    <div class="content-card-images">
                        <div class="content-card-image">
                            <img src="${reino.imagen}" alt="${reino.nombre}">
                        </div>
                    </div>
                ` : ''}
                <div class="content-card-body">
                    <h3 class="content-card-title">${reino.nombre}</h3>
                    ${reino.descripcion ? `<p class="content-card-desc">${reino.descripcion}</p>` : ''}
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${reino.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${reino.id})">🗑️ Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        content.innerHTML = '<p class="loading">Error al cargar los datos</p>';
    }
}

// Abrir modal
document.getElementById('addBtn')?.addEventListener('click', () => {
    currentItem = null;
    document.getElementById('modalTitle').textContent = 'Agregar Reino';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
});

// Cerrar modal
document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

// Preview de imagen
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

// Guardar item
document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagenFile = document.getElementById('imagen').files[0];
    
    let imagenUrl = currentItem?.imagen || '';
    
    // Si hay nueva imagen, subirla
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
            // Actualizar
            const { error } = await supabase
                .from('reinos')
                .update(itemData)
                .eq('id', currentItem.id);
            
            if (error) throw error;
        } else {
            // Crear
            const { error } = await supabase
                .from('reinos')
                .insert([itemData]);
            
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadReinos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar');
    }
});

// Editar
async function editItem(id) {
    const { data, error } = await supabase
        .from('reinos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    currentItem = data;
    document.getElementById('modalTitle').textContent = 'Editar Reino';
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

// Eliminar
async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este reino?')) return;
    
    const { error } = await supabase
        .from('reinos')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
        return;
    }
    
    loadReinos();
}

// Cargar al iniciar
loadReinos();
