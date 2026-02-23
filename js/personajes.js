// Reemplaza el bloque de guardado en personajes.js
document.getElementById('itemForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Bloqueamos el botón para evitar que se quede pegada la página por clics repetidos
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando (No cierre la página)...';

    const imagenesFiles = Array.from(document.getElementById('imagenes').files);
    let imagenesUrls = currentItem?.imagenes || [];

    try {
        // 2. USAR FOR...OF (Esto sí espera a que cada imagen suba)
        for (const file of imagenesFiles) {
            const fileName = `pj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${file.name}`;
            
            const { data, error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('imagenes')
                .getPublicUrl(fileName);

            imagenesUrls.push(publicUrl);
        }

        const itemData = {
            nombre: document.getElementById('nombre').value,
            alias: document.getElementById('alias').value,
            personalidad: document.getElementById('personalidad').value,
            poder: document.getElementById('poder').value,
            habilidades: document.getElementById('habilidades').value,
            caracteristicas: document.getElementById('caracteristicas').value,
            imagenes: imagenesUrls
        };

        // 3. Guardar en base de datos
        let res;
        if (currentItem) {
            res = await supabase.from('personajes').update(itemData).eq('id', currentItem.id);
        } else {
            res = await supabase.from('personajes').insert([itemData]);
        }

        if (res.error) throw res.error;

        // 4. Éxito: cerrar y limpiar
        alert('¡Guardado con éxito!');
        location.reload(); // Esto refresca la página y limpia el estado

    } catch (error) {
        console.error('Error detallado:', error);
        alert('Error al guardar: ' + error.message);
    } finally {
        // 5. Siempre rehabilitar el botón si algo falla
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    }
});
