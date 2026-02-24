// CONFIGURACIÓN DE SUPABASE - VERSIÓN FINAL
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2'; // <--- PEGA TU LLAVE AQUÍ

let supabase = null;

function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ Cliente Supabase creado");
        
        // Verificación manual de Storage
        if (supabase.storage) {
            console.log("✅ Módulo de Storage detectado");
        } else {
            console.error("❌ El cliente no cargó el módulo de Storage");
        }
    } else {
        console.error("❌ La librería CDN de Supabase no se cargó");
    }
}

// Ejecutar inicialización
initSupabase();
