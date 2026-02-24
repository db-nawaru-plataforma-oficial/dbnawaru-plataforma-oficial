let currentItem = null;

// Función de seguridad para verificar Supabase
function getSupabase() {
    if (typeof supabase === 'undefined' || !supabase) {
        console.error("Error: Supabase no está inicializado. Revisa config.js");
        return null;
    }
    return supabase;
}

// Cargar Personajes
async function loadPersonajes() {
    const client = getSupabase();
    if (!client) return;

    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    try {
        const { data, error } = await client
            .from('personajes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        loading.style.display = 'none';
        
        content.innerHTML = data.length === 0 
            ? '<p class="loading">No hay personajes registrados</p>'
            : data.map(pj => `
                <div class="content-card">
                    ${pj.imagenes && pj.imagenes.length > 0 ? `
                        <div class="content-card-images">
                            ${pj.imagenes.map(img => `
                                <div class="content-card-image"><img src="${img}"></div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="content-card-body">
                        <h3 class="content-card-title">${pj.nombre}</h3>
                        <p><strong>Alias:</strong> ${pj.alias || 'N/A'}</p>
                        <p class="content-card-desc">${pj.personalidad || ''}</p>
                    </div>
                    ${isAdmin() ? `
                        <div class="content-card-actions">
                            <button onclick="editItem(${pj.id})">✏️</button>
                            <button onclick="deleteItem(${pj.id})">🗑️</button>
                        </div>
                    ` : ''}
                </div>
            `).join('');
    } catch (error) {
        console.error('Error al cargar:', error);
    }
}

// Guardar Información
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const client = getSupabase();
    if (!client) {
        alert("Error crítico: No se pudo conectar con la base de datos.");
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Procesando...';

    try {
        const fileInput = document.getElementById('imagenes');
        const files = fileInput.files;
        let urls = currentItem ? (currentItem.imagenes || []) : [];

        // Subir imágenes al Storage
        for (const file of files) {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const { data, error: uploadError } = await client.storage
                .from('imagenes')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            if (data) {
                const { data: { publicUrl } } = client.storage.from('imagenes').getPublicUrl(fileName);
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

        const { error } = currentItem 
            ? await client.from('personajes').update(itemData).eq('id', currentItem.id)
            : await client.from('personajes').insert([itemData]);

        if (error) throw error;
        location.reload();

    } catch (error) {
        alert("Error: " + error.message);
        btn.disabled = false;
        btn.textContent = 'Guardar';
    }
});

// Funciones de Modal
function editItem(id) { /* Lógica de edición igual a la anterior */ }
async function deleteItem(id) {
    if (confirm('¿Eliminar?')) {
        await getSupabase().from('personajes').delete().eq('id', id);
        loadPersonajes();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadPersonajes);
