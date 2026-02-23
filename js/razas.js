let currentItem = null;

async function loadRazas() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
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
        content.innerHTML = '<p class="loading">Error al cargar los datos</p>';
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

document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    
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
        alert('Error al guardar');
    }
});

async function editItem(id) {
    const { data, error } = await supabase
        .from('razas')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    currentItem = data;
    document.getElementById('modalTitle').textContent = 'Editar Raza';
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('descripcion').value = data.descripcion || '';
    
    document.getElementById('modal').classList.add('active');
}

async function deleteItem(id) {
    if (!confirm('¿Estás seguro de eliminar esta raza?')) return;
    
    const { error } = await supabase
        .from('razas')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error:', error);
        alert('Error al eliminar');
        return;
    }
    
    loadRazas();
}

loadRazas();
