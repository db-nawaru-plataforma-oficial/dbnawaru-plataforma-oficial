document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Bloquear el botón para evitar múltiples envíos
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subiendo información...';

    const files = Array.from(document.getElementById('imagenes').files);
    let imagenesUrls = currentItem?.imagenes || []; // Mantener imágenes si estamos editando

    try {
        // PROCESO DE SUBIDA DE IMÁGENES
        for (const file of files) {
            // Crear un nombre único para evitar errores de duplicado
            const fileExt = file.name.split('.').pop();
            const fileName = `pj_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Error al subir imagen:', uploadError.message);
                continue; // Si una falla, intenta con la siguiente
            }

            // Obtener la URL pública de la imagen recién subida
            const { data: { publicUrl } } = supabase.storage
                .from('imagenes')
                .getPublicUrl(fileName);

            imagenesUrls.push(publicUrl);
        }

        // PREPARAR DATOS PARA LA TABLA
        const itemData = {
            nombre: document.getElementById('nombre').value,
            alias: document.getElementById('alias').value,
            personalidad: document.getElementById('personalidad').value,
            poder: document.getElementById('poder').value,
            habilidades: document.getElementById('habilidades').value,
            caracteristicas: document.getElementById('caracteristicas').value,
            imagenes: imagenesUrls // IMPORTANTE: Debe ser un array de textos en Supabase
        };

        let result;
        if (currentItem) {
            // Actualizar existente
            result = await supabase.from('personajes').update(itemData).eq('id', currentItem.id);
        } else {
            // Insertar nuevo
            result = await supabase.from('personajes').insert([itemData]);
        }

        if (result.error) throw result.error;

        alert('¡Personaje guardado con éxito!');
        document.getElementById('modal').classList.remove('active');
        loadPersonajes(); // Recargar la lista

    } catch (error) {
        console.error('Error crítico:', error);
        alert('No se pudo guardar: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    }
});
