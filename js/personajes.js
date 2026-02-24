// Variable global para edición
let currentItem = null;

// CARGAR PERSONAJES
async function loadPersonajes() {
    const content = document.getElementById('content');
    const loading = document.getElementById('loading');

    try {
        const { data, error } = await supabase.from('personajes').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        if (loading) loading.style.display = 'none';
        content.innerHTML = data.map(pj => `
            <div class="content-card">
                <div class="content-card-body">
                    <h3 class="content-card-title">${pj.nombre}</h3>
                    <p><strong>Alias:</strong> ${pj.alias || 'N/A'}</p>
                    <p>${pj.personalidad || ''}</p>
                </div>
                ${localStorage.getItem('nawaru_admin') === 'true' ? `
                    <div class="content-card-actions">
                        <button onclick="deleteItem(${pj.id})" style="background:red; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer;">Eliminar</button>
                    </div>` : ''}
            </div>
        `).join('');
    } catch (err) { console.error("Error cargando:", err); }
}

// GUARDAR INFORMACIÓN (Aquí estaba el fallo)
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
        const files = document.getElementById('imagenes').files;
        let urls = [];

        // 1. Subir imágenes si hay seleccionadas
        for (const file of files) {
            const fileName = `${Date.now()}_${file.name}`;
            const { data, error: upError } = await supabase.storage.from('imagenes').upload(fileName, file);
            if (upError) throw upError;
            
            const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName);
            urls.push(publicUrl);
        }

        // 2. Preparar datos
        const pjData = {
            nombre: document.getElementById('nombre').value,
            alias: document.getElementById('alias').value,
            personalidad: document.getElementById('personalidad').value,
            poder: document.getElementById('poder').value,
            habilidades: document.getElementById('habilidades').value,
            caracteristicas: document.getElementById('caracteristicas').value,
            imagenes: urls
        };

        // 3. Insertar en la tabla
        const { error } = await supabase.from('personajes').insert([pjData]);
        if (error) throw error;

        location.reload();
    } catch (err) {
        alert("Error al guardar: " + err.message);
        btn.disabled = false;
        btn.textContent = 'Guardar';
    }
});

async function deleteItem(id) {
    if(confirm("¿Eliminar?")) {
        await supabase.from('personajes').delete().eq('id', id);
        loadPersonajes();
    }
}

document.addEventListener('DOMContentLoaded', loadPersonajes);
