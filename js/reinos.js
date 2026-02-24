let currentItem = null;

// ====================================
// CARGAR REINOS
// ====================================
async function loadReinos() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    if (!supabase) {
        content.innerHTML = '<p class="loading">⚠️ Error: Supabase no configurado</p>';
        loading.style.display = 'none';
        return;
    }
    
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
                        <div class="content-card-image full">
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
        loading.style.display = 'none';
        content.innerHTML = '<p class="loading">❌ Error al cargar los datos</p>';
    }
}

// ====================================
// ABRIR MODAL
// ====================================
document.getElementById('addBtn')?.addEventListener('click', () => {
    currentItem = null;
    document.getElementById('modalTitle').textContent = 'Agregar Reino';
    document.getElementById('itemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
});

// ====================================
// CERRAR MODAL
// ====================================
document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
});

document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        document.getElementById('modal').classList.remove('active');
    }
});

// ====================================
// PREVIEW DE IMAGEN
// ====================================
document.getElementById('imagen')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `
                <div class="image-preview-item">
                    <img src="${e.target.result}" alt="Preview">
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
});

// ====================================
// GUARDAR ITEM
// ====================================
document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Guardando...';
    
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const imagenFile = document.getElementById('imagen').files[0];
    
    let imagenUrl = currentItem?.imagen || '';
    
    try {
        // Subir imagen si hay una nueva
        if (imagenFile) {
            const fileName = `reinos/${Date.now()}_${imagenFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(fileName, imagenFile);
            
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
                .from('imagenes')
                .getPublicUrl(fileName);
            
            imagenUrl = publicUrl;
        }
        
        const itemData = { nombre, descripcion, imagen: imagenUrl };
        
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
        alert('❌ Error al guardar: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Guardar';
    }
});

// ====================================
// EDITAR
// ====================================
async function editItem(id) {
    try {
        const { data, error } = await supabase
            .from('reinos')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        currentItem = data;
        document.getElementById('modalTitle').textContent = 'Editar Reino';
        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('descripcion').value = data.descripcion || '';
        
        const preview = document.getElementById('imagePreview');
        if (data.imagen) {
            preview.innerHTML = `
                <div class="image-preview-item">
                    <img src="${data.imagen}" alt="Preview">
                </div>
            `;
        }
        
        document.getElementById('modal').classList.add('active');
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al cargar el reino');
    }
}

// ====================================
// ELIMINAR
// ====================================
async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este reino?')) return;
    
    try {
        const { error } = await supabase
            .from('reinos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadReinos();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar');
    }
}

// ====================================
// CARGAR AL INICIAR
// ====================================
loadReinos();
