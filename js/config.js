// REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES DE SUPABASE
const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI';
const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY_AQUI';

// Credenciales de admin (puedes cambiarlas)
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO#2026';

// Inicializar Supabase
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
