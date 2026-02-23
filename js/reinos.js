document.addEventListener('DOMContentLoaded', async () => {
    const contentList = document.getElementById('content');
    const loadingDiv = document.getElementById('loading');
    const modal = document.getElementById('modal');
    const addBtn = document.getElementById('addBtn');
    const closeModal = document.getElementById('closeModal');

    // Función para mostrar/ocultar carga
    function toggleLoading(show) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }

    // Control del Modal (Abrir/Cerrar)
    if (addBtn) {
        addBtn.addEventListener('click', () => modal.classList.add('active'));
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => modal.classList.remove('active'));
    }

    // Carga de datos desde Supabase
    async function cargarReinos() {
        try {
            toggleLoading(true);
            const { data, error } = await supabase.from('reinos').select('*');
            
            if (error) throw error;

            contentList.innerHTML = '';
            data.forEach(reino => {
                const card = document.createElement('div');
                card.className = 'content-card';
                card.innerHTML = `
                    <div class="content-card-body">
                        <h3 class="content-card-title">${reino.nombre}</h3>
                        <p class="content-card-desc">${reino.descripcion}</p>
                    </div>
                `;
                contentList.appendChild(card);
            });
        } catch (err) {
            console.error("Error:", err);
            loadingDiv.innerText = "Error al cargar los reinos.";
        } finally {
            toggleLoading(false);
        }
    }

    cargarReinos()
        ;
});
