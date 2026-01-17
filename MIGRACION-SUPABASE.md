# 🚀 Guía de Migración a Supabase - Mikitech E-commerce

## ¿Por qué migrar a Supabase?

### Problemas con MySQL local:
- ❌ No funciona en tiempo real
- ❌ Requiere servidor siempre activo
- ❌ No escala automáticamente
- ❌ Sin autenticación integrada
- ❌ Sin almacenamiento de archivos
- ❌ Difícil de mantener

### Ventajas de Supabase:
- ✅ **Tiempo Real**: Actualizaciones instantáneas en todos los clientes
- ✅ **Escalable**: Crece con tu negocio automáticamente
- ✅ **Autenticación**: Sistema completo de usuarios integrado
- ✅ **Storage**: Almacenamiento de imágenes y archivos
- ✅ **API REST**: Generada automáticamente
- ✅ **PostgreSQL**: Base de datos profesional
- ✅ **Gratis**: Plan gratuito generoso para empezar

---

## 📋 Pasos para Migrar

### 1. Crear Proyecto en Supabase

1. Ve a: https://supabase.com/dashboard
2. Haz clic en **"New Project"**
3. Completa:
   - **Name**: Mikitech
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Selecciona el más cercano a tus usuarios
   - **Pricing Plan**: Free (para empezar)
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras se crea

### 2. Obtener Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** (⚙️) > **API**
2. Copia estos valores:

   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (¡SECRETO!)
   ```

### 3. Configurar Variables de Entorno ✅ COMPLETADO

1. ~~Abre el archivo `.env.local` en tu proyecto~~
2. ~~Reemplaza estos valores:~~

   ```env
   VITE_SUPABASE_URL=https://gveitgpbsltdytmyeupg.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_gmuhd8yzCiC3CWbOtMdr7A_X-1Y8o5v
   VITE_SUPABASE_SERVICE_KEY=sb_secret_MBkdT8wQAlMjWISBoF24BQ_2eZOrjbh
   ```

3. ~~Guarda el archivo~~

**✅ Variables configuradas correctamente**

### 4. Crear Estructura de Base de Datos

1. En Supabase Dashboard, ve a **SQL Editor**
2. Haz clic en **"New Query"**
3. Abre el archivo `database/supabase-migration.sql` de tu proyecto
4. Copia TODO el contenido
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **"Run"** (▶️)
7. Deberías ver: "Success. No rows returned"

### 5. Migrar los Datos ✅ COMPLETADO

~~Ahora vamos a copiar todos tus datos de MySQL a Supabase:~~

```bash
npm run migrate:supabase
```

~~Este script:~~
- ✅ ~~Conecta a tu MySQL local~~
- ✅ ~~Lee todos los datos (usuarios, productos, categorías, kits, órdenes)~~
- ✅ ~~Los copia a Supabase~~
- ✅ ~~Muestra un resumen al final~~

**✅ Migración completada exitosamente:**
- 31 usuarios migrados
- 9 categorías migradas
- 12 productos migrados
- 3 kits migrados
- 5 órdenes migradas

### 6. Configurar Storage (Almacenamiento de Imágenes)

1. En Supabase Dashboard, ve a **Storage**
2. Haz clic en **"Create a new bucket"**
3. Nombre: `product-images`
4. **Public bucket**: ✅ Activado
5. Haz clic en **"Create bucket"**

### 7. Configurar Políticas de Seguridad (RLS)

Las políticas ya están en el script SQL, pero verifica:

1. Ve a **Authentication** > **Policies**
2. Deberías ver políticas para:
   - `products` (lectura pública, escritura para proveedores)
   - `orders` (usuarios ven solo sus órdenes)
   - `categories` (lectura pública)

---

## 🧪 Probar la Migración

### Verificar Datos

1. En Supabase Dashboard, ve a **Table Editor**
2. Revisa cada tabla:
   - `users`: Deberías ver todos tus usuarios
   - `products`: Todos tus productos
   - `categories`: Todas las categorías
   - `kits`: Todos los kits
   - `orders`: Todas las órdenes

### Probar Tiempo Real

1. Abre dos ventanas de tu aplicación
2. En una, crea un producto
3. En la otra, deberías verlo aparecer **instantáneamente** ✨

---

## 🔄 Actualizar el Código

Ya he creado el archivo `lib/supabase.ts` con todas las funciones necesarias.

### Ejemplo de uso:

```typescript
import { db, subscribeToTable } from './lib/supabase';

// Obtener productos
const { data: products } = await db.products.getAll();

// Crear producto
const { data: newProduct } = await db.products.create({
  name: 'Nuevo Producto',
  price: 99.99,
  stock: 10,
  // ... más campos
});

// Suscribirse a cambios en tiempo real
const unsubscribe = subscribeToTable('products', (payload) => {
  console.log('¡Producto actualizado!', payload);
  // Actualizar UI automáticamente
});
```

---

## 📊 Comparación: Antes vs Después

### ANTES (MySQL):
```javascript
// Hacer petición al backend
fetch('http://localhost:3001/api/products')
  .then(res => res.json())
  .then(products => {
    // Actualizar UI manualmente
    setProducts(products);
  });

// Necesitas recargar para ver cambios
```

### DESPUÉS (Supabase):
```javascript
// Obtener datos directamente
const { data } = await db.products.getAll();
setProducts(data);

// Actualizaciones en tiempo real automáticas
subscribeToTable('products', (payload) => {
  // UI se actualiza sola cuando alguien más hace cambios
  if (payload.eventType === 'INSERT') {
    setProducts(prev => [...prev, payload.new]);
  }
});
```

---

## 🎯 Próximos Pasos

Una vez migrado:

1. ✅ Actualizar componentes para usar `lib/supabase.ts`
2. ✅ Implementar autenticación real con Supabase Auth
3. ✅ Configurar upload de imágenes a Supabase Storage
4. ✅ Añadir suscripciones en tiempo real en componentes clave
5. ✅ Eliminar dependencia de MySQL y `server.cjs`

---

## ❓ Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente las keys de Supabase
- Asegúrate de que `.env.local` esté en la raíz del proyecto

### Error: "relation does not exist"
- Ejecuta el script SQL (`supabase-migration.sql`) en Supabase
- Verifica que todas las tablas se crearon correctamente

### Los datos no se migran
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env.local`
- Asegúrate de tener `VITE_SUPABASE_SERVICE_KEY` configurado

---

## 🆘 Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs en la consola
2. Verifica las credenciales en `.env.local`
3. Asegúrate de que el proyecto de Supabase esté activo
4. Revisa que todas las tablas se crearon en Supabase

---

## 🎉 ¡Listo!

Una vez completada la migración, tendrás:
- ✅ Base de datos en la nube profesional
- ✅ Actualizaciones en tiempo real
- ✅ Sistema de autenticación robusto
- ✅ Almacenamiento de archivos
- ✅ API REST automática
- ✅ Escalabilidad infinita

**¡Tu e-commerce estará listo para crecer! 🚀**
