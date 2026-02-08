// Supabase Configuration
// IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase

const SUPABASE_CONFIG = {
    url: 'TU_SUPABASE_URL', // Ejemplo: https://xyzcompany.supabase.co
    anonKey: 'TU_SUPABASE_ANON_KEY' // Tu clave anónima de Supabase
};

// Inicializar cliente de Supabase
let supabaseClient = null;

// Función para inicializar Supabase
function initializeSupabase() {
    // Verificar si las credenciales están configuradas
    if (SUPABASE_CONFIG.url === 'TU_SUPABASE_URL' || 
        SUPABASE_CONFIG.anonKey === 'TU_SUPABASE_ANON_KEY') {
        console.warn('Supabase no configurado. Usando localStorage como alternativa.');
        console.info('Para usar Supabase:');
        console.info('1. Crea un proyecto en https://supabase.com');
        console.info('2. Reemplaza las credenciales en supabase-config.js');
        console.info('3. Crea las siguientes tablas en Supabase:');
        console.info('   - reinos, personajes, razas, animales, mapa, poderes, diccionario, galeria');
        console.info('4. Cada tabla debe tener las columnas: id (int8), nombre (text), descripcion (text), imagen (text), created_at (timestamptz)');
        return;
    }

    // Cargar librería de Supabase desde CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        // Inicializar cliente
        supabaseClient = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        
        window.supabaseClient = supabaseClient;
        console.log('Supabase inicializado correctamente');
    };
    script.onerror = () => {
        console.error('Error al cargar Supabase. Usando localStorage como alternativa.');
    };
    document.head.appendChild(script);
}

// Inicializar al cargar la página
initializeSupabase();

/* 
=============================================================================
INSTRUCCIONES PARA CONFIGURAR SUPABASE
=============================================================================

1. CREAR PROYECTO EN SUPABASE:
   - Ve a https://supabase.com
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. OBTENER CREDENCIALES:
   - En tu proyecto, ve a Settings > API
   - Copia la "Project URL" y reemplaza 'TU_SUPABASE_URL'
   - Copia la "anon public" key y reemplaza 'TU_SUPABASE_ANON_KEY'

3. CREAR TABLAS EN SUPABASE:
   Ve a Table Editor y crea las siguientes tablas con esta estructura:

   Tabla: reinos
   ├── id (int8, primary key, auto-increment)
   ├── nombre (text, not null)
   ├── descripcion (text, not null)
   ├── imagen (text, nullable)
   └── created_at (timestamptz, default: now())

   Repite la misma estructura para estas tablas:
   - personajes
   - razas
   - animales
   - mapa
   - poderes
   - diccionario
   - galeria

4. CONFIGURAR POLÍTICAS DE SEGURIDAD (RLS):
   
   Para cada tabla, ejecuta estos comandos SQL en SQL Editor:

   -- Habilitar RLS
   ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;

   -- Permitir lectura a todos
   CREATE POLICY "Enable read access for all users" ON nombre_tabla
   FOR SELECT USING (true);

   -- Permitir inserción a todos (puedes restringir esto más adelante)
   CREATE POLICY "Enable insert for all users" ON nombre_tabla
   FOR INSERT WITH CHECK (true);

   -- Permitir eliminación a todos (puedes restringir esto más adelante)
   CREATE POLICY "Enable delete for all users" ON nombre_tabla
   FOR DELETE USING (true);

   Reemplaza "nombre_tabla" con: reinos, personajes, razas, animales, mapa, 
   poderes, diccionario, galeria

5. VERIFICAR CONEXIÓN:
   - Abre la consola del navegador (F12)
   - Deberías ver "Supabase inicializado correctamente"
   - Si ves un error, verifica tus credenciales

=============================================================================
ALTERNATIVA: USAR SIN SUPABASE
=============================================================================

Si no quieres usar Supabase, la aplicación funcionará automáticamente con
localStorage (almacenamiento local del navegador). Los datos se guardarán
solo en el dispositivo del usuario.

Para producción, se recomienda usar Supabase para:
- Sincronización entre dispositivos
- Respaldo automático de datos
- Escalabilidad
- Seguridad mejorada

=============================================================================
*/
