// Configuración Global de Supabase
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2';

// Credenciales de administrador
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO2026';

// Inicialización que garantiza que 'supabase' sea accesible en todos los archivos
if (typeof supabase === 'undefined') {
    window.supabase = { 
        createClient: (url, key) => supabase.createClient(url, key) 
    };
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabaseClient;

console.log("Conexión con Supabase configurada globalmente.");
