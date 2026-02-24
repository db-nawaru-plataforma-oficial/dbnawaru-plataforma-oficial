let currentItem = null;

async function loadMapas() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    if (!supabase) {
        content.innerHTML = '<p class="loading">⚠️ Error: Supabase no configurado</p>';
        loading.style.display = 'none';
        return;
    }
    
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
                        <div class="content-card-image full">
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
        loading.style.display = 'none';
        content.innerHTML = '<p class="loading">❌ Error al cargar los datos</p>';
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

document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        document.getElementById('modal').classList.remove('active');
    }
});

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
        if (imagenFile) {
            const fileName = `mapas/${Date.now()}_${imagenFile.name}`;
            const { error: uploadError } = await supabase.storage
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
        alert('❌ Error al guardar: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Guardar';
    }
});

async function editItem(id) {
    try {
        const { data, error } = await supabase
            .from('mapas')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        currentItem = data;
        document.getElementById('modalTitle').textContent = 'Editar Mapa';
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
        alert('❌ Error al cargar el mapa');
    }
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este mapa?')) return;
    
    try {
        const { error } = await supabase
            .from('mapas')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadMapas();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar');
    }
}

loadMapas();
