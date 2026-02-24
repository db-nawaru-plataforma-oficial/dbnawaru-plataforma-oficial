// CONFIGURACIÓN DE SUPABASE - CORREGIDA
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// Inicializar Supabase de forma global
let supabase = null;

try {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ Conexión con Supabase inicializada");
    } else {
        console.error("❌ El SDK de Supabase no se ha cargado. Revisa la etiqueta <script> en el HTML.");
    }
} catch (error) {
    console.error("❌ Error al configurar Supabase:", error);
}

// Inicializar Supabase (solo si existe el SDK)
let supabase = null;
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
