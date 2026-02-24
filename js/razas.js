let currentItem = null;

async function loadRazas() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    if (!supabase) {
        content.innerHTML = '<p class="loading">⚠️ Error: Supabase no configurado</p>';
        loading.style.display = 'none';
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('razas')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        loading.style.display = 'none';
        
        if (data.length === 0) {
            content.innerHTML = '<p class="loading">No hay razas registradas</p>';
            return;
        }
        
        content.innerHTML = data.map(raza => `
            <div class="content-card">
                <div class="content-card-body">
                    <h3 class="content-card-title">${raza.nombre}</h3>
                    ${raza.descripcion ? `<p class="content-card-desc">${raza.descripcion}</p>` : ''}
                </div>
                ${isAdmin() ? `
                    <div class="content-card-actions">
                        <button class="btn-edit" onclick="editItem(${raza.id})">✏️ Editar</button>
                        <button class="btn-delete" onclick="deleteItem(${raza.id})">🗑️ Eliminar</button>
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
    document.getElementById('modalTitle').textContent = 'Agregar Raza';
    document.getElementById('itemForm').reset();
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

document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Guardando...';
    
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    
    const itemData = { nombre, descripcion };
    
    try {
        if (currentItem) {
            const { error } = await supabase
                .from('razas')
                .update(itemData)
                .eq('id', currentItem.id);
            
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('razas')
                .insert([itemData]);
            
            if (error) throw error;
        }
        
        document.getElementById('modal').classList.remove('active');
        loadRazas();
        
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
            .from('razas')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        currentItem = data;
        document.getElementById('modalTitle').textContent = 'Editar Raza';
        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('descripcion').value = data.descripcion || '';
        
        document.getElementById('modal').classList.add('active');
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al cargar la raza');
    }
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar esta raza?')) return;
    
    try {
        const { error } = await supabase
            .from('razas')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        loadRazas();
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al eliminar');
    }
}

loadRazas();
