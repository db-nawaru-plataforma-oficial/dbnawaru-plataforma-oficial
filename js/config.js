// Configuración Maestra
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO2026';

// Inicialización ultra-segura
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.supabase = supabase; // Exportar a todo el sitio
} catch (e) {
    console.error("Error inicializando Supabase:", e);
}

// Variables globales para el login
window.NAWARU_USER = ADMIN_USERNAME;
window.NAWARU_PASS = ADMIN_PASSWORD;
