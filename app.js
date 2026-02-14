// Funciones de renderizado para cada tipo
const Renderers = {
    personajes: (item) => `
        <div class="post-card">
            <img src="${item.imagen_url}" class="post-img" alt="${item.nombre}">
            <div class="post-body">
                <h2 class="post-title">${item.nombre} <small>(${item.alias})</small></h2>
                <p><span class="field-label">Personalidad:</span> ${item.personalidad}</p>
                <p><span class="field-label">Poder:</span> ${item.poder}</p>
                <p><span class="field-label">Habilidades:</span> ${item.habilidades}</p>
                <p><span class="field-label">Características:</span> ${item.caracteristicas}</p>
            </div>
        </div>
    `,
    reinos: (item) => `
        <div class="post-card">
            <img src="${item.imagen_url}" class="post-img">
            <div class="post-body">
                <h2 class="post-title">${item.nombre}</h2>
                <p>${item.descripcion}</p>
            </div>
        </div>
    `
};

// Lógica de visualización para Admin
function checkPermissions(user) {
    const adminPanel = document.getElementById('admin-panel');
    if (user.role === 'admin') {
        adminPanel.style.display = 'block';
    } else {
        adminPanel.style.display = 'none';
    }
}
