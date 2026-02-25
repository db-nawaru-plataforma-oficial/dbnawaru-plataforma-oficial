let currentItem = null;

async function loadAnimales() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
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
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay animales espirituales registrados</p>';
            return;
        }
        
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
                ${isAdmin() ? `
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

document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        document.getElementById('modal').classList.remove('active');
    }
});

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
        
        const itemData = {
            nombre,
            descripcion,
            imagenes: imagenesUrls
        };
        
        if (currentItem) {
            const { error } = await supabase
                .from('animales_espirituales')
                .update(itemData)
                .eq('id', currentItem.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('animales_espirituales')
                .insert([itemData]);
            
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadAnimales();
        
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
            .from('animales_espirituales')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        currentItem = data;
        document.getElementById('modalTitle').textContent = 'Editar Animal Espiritual';
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
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al cargar el animal espiritual');
    }
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar este animal espiritual?')) return;
    
    try {
        const { error } = await supabase
            .from('animales_espirituales')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadAnimales();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar');
    }
}

loadAnimales();
