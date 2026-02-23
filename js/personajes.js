// Función para abrir el modal (Asegúrate de que esta función exista)
function openModal() {
    currentItem = null; // Reset para que sea "Nuevo" y no "Editar"
    const form = document.getElementById('itemForm');
    if (form) form.reset(); // Limpia los campos
    
    document.getElementById('modalTitle').textContent = 'Agregar Personaje';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('modal').classList.add('active');
}

// ASIGNACIÓN DEL BOTÓN (Adecuada para GitHub Pages)
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', openModal);
    } else {
        console.error("No se encontró el botón con ID 'addBtn'");
    }
});
