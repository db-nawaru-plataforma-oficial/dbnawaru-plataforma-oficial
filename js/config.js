// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2'; // La que empieza con sb_publishable

let supabase = null;

try {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ Conexión con Supabase inicializada");
    } else {
        console.error("❌ Error: No se detectó la librería de Supabase.");
    }
} catch (error) {
    console.error("❌ Error al configurar Supabase:", error);
}
