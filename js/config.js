// Configuración Maestra
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// Credenciales ÚNICAS
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO2026';

// Inicialización de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabase;
