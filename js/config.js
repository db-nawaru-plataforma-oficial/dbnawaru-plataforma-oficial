// ====================================
// CONFIGURACIÓN DE SUPABASE
// ====================================
// REEMPLAZA estos valores con tus credenciales de Supabase

const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI';
const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY_AQUI';

// Credenciales de administrador (puedes cambiarlas)
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO#2026';

// Inicializar cliente de Supabase
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Verificar si Supabase está configurado
if (!supabase) {
    console.error('⚠️ Supabase no está configurado correctamente. Verifica que hayas incluido el SDK.');
}
