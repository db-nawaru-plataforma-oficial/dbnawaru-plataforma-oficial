// Credenciales de Supabase
const SUPABASE_URL = 'https://shnwanhkuphlcevxnlvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GqwY_VwSleM0MwNoshDQsQ_Qdl0lOu2'; // Tu clave Anon Public

// Credenciales de administrador únicas
const ADMIN_USERNAME = 'Nawaru';
const ADMIN_PASSWORD = 'JAO2026';

// Inicialización global forzada
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Nawaru Config: Conexión con Supabase establecida.");
