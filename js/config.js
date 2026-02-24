// Configuración de Emergencia Nawaru
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// DATOS EXACTOS - Cuidado con espacios o mayúsculas
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO2026';

// Inicialización
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabase;

// Inyectar en Window para que auth.js lo vea pase lo que pase
window.NAWARU_USER = ADMIN_USERNAME;
window.NAWARU_PASS = ADMIN_PASSWORD;

console.log("SISTEMA LISTO. Usuario esperado:", window.NAWARU_USER);
