// CONFIGURACIÓN DE SUPABASE
// Reemplaza con tus credenciales reales

const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY_AQUI';

// Inicializar Supabase (solo si existe el SDK)
let supabase = null;
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
