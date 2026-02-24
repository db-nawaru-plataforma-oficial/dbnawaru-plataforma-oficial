// Credenciales de Supabase
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// Credenciales de admin
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123';

// Inicializar Supabase con verificación
let supabase = null;
if (typeof supabase !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.warn("La librería de Supabase no se ha cargado aún.");
}
