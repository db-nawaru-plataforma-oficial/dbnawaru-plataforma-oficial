// ====================================
// CONFIGURACIÓN DE SUPABASE
// ====================================
// REEMPLAZA estos valores con tus credenciales de Supabase

const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// Credenciales de administrador (puedes cambiarlas)
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO';

// Inicializar cliente de Supabase
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Verificar si Supabase está configurado
if (!supabase) {
    console.error('⚠️ Supabase no está configurado correctamente. Verifica que hayas incluido el SDK.');
}
