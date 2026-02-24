// Configuración Global Nawaru
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO2026';

// Creamos el cliente de forma que sea accesible para todos los archivos
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Guardamos en el objeto 'window' para máxima compatibilidad
window.supabase = supabase;
window.ADMIN_USERNAME = ADMIN_USERNAME;
window.ADMIN_PASSWORD = ADMIN_PASSWORD;

console.log("✅ Configuración de Nawaru cargada");
