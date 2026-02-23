// Importante: Asegúrate de que Supabase esté inicializado en config.js
document.addEventListener('DOMContentLoaded', async () => {
    // Referencias a elementos del DOM
    const contentList = document.getElementById('content');
    const loadingDiv = document.getElementById('loading');
    const addBtn = document.getElementById('addBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const itemForm = document.getElementById('itemForm');

    // 1. FUNCIÓN PARA CARGAR REINOS
    async function loadReinos() {
        try {
            // Mostrar carga
            loadingDiv.style.display = 'block';
            contentList.innerHTML = '';

            // Consulta a Supabase (Asegúrate que la tabla se llame 'reinos')
            const { data: reinos, error } = await supabase
                .from('reinos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Ocultar indicador de carga
            loadingDiv.style.display = 'none';

            if (reinos && reinos.length > 0) {
                reinos.forEach(reino => {
                    renderCard(reino);
                });
            } else {
                contentList.innerHTML = '<p class="loading">No hay reinos descubiertos aún.</p>';
            }

        } catch (error) {
            console.error('Error al cargar reinos:', error);
            loadingDiv.innerHTML = `<p style="color: #ef4444;">Error: ${error.message}</p>`;
        }
    }

    // 2. FUNCIÓN PARA DIBUJAR LAS TARJETAS (Render)
    function renderCard(reino) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="content-card-image">
                <img src="${reino.imagen_url || 'https://via.placeholder.com/400'}" alt="${reino.nombre}">
            </div>
            <div class="content-card-body">
                <h3 class="content-card-title">${reino.nombre}</h3>
                <p class="content-card-desc">${reino.descripcion}</p>
            </div>
        `;
        contentList.appendChild(card);
    }

    // 3. CONTROL DEL MODAL
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.classList.add('active'); // Usa la clase .active de tu CSS
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 4. INICIO
    loadRei
      nos();
});
