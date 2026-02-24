// CONFIGURACIÓN DE SUPABASE
// Reemplaza con tus credenciales reales

const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// Inicializar Supabase (solo si existe el SDK)
let supabase = null;
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
