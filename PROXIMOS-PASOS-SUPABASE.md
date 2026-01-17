# 🎯 Próximos Pasos - Integración Completa con Supabase

## ✅ Completado

1. ✅ **Configuración de Supabase**
   - Variables de entorno configuradas
   - Cliente de Supabase creado (`lib/supabase.ts`)
   - Tipos TypeScript definidos

2. ✅ **Migración de Datos**
   - 31 usuarios migrados
   - 9 categorías migradas
   - 12 productos migrados
   - 3 kits migrados
   - 5 órdenes migradas

---

## 🔄 Pendiente

### 1. Configurar Storage en Supabase (Imágenes)

**Pasos manuales en Supabase Dashboard:**

1. Ve a: https://supabase.com/dashboard/project/gveitgpbsltdytmyeupg/storage/buckets
2. Haz clic en **"Create a new bucket"**
3. Configuración:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Activado
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`
4. Haz clic en **"Create bucket"**

**Políticas de acceso (ejecutar en SQL Editor):**

```sql
-- Permitir lectura pública de imágenes
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Permitir subida de imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Permitir actualización de imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Permitir eliminación de imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

---

### 2. Actualizar Componentes para Usar Supabase

#### A. Actualizar Shop.tsx (Catálogo de Productos)

**Antes (MySQL):**
```typescript
useEffect(() => {
  fetch('http://localhost:3001/api/products')
    .then(res => res.json())
    .then(data => setProducts(data));
}, []);
```

**Después (Supabase con Tiempo Real):**
```typescript
import { db, subscribeToTable } from '../lib/supabase';

useEffect(() => {
  // Cargar productos iniciales
  const loadProducts = async () => {
    const { data, error } = await db.products.getAll();
    if (data) setProducts(data);
  };
  
  loadProducts();
  
  // Suscribirse a cambios en tiempo real
  const unsubscribe = subscribeToTable('products', (payload) => {
    if (payload.eventType === 'INSERT') {
      setProducts(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setProducts(prev => prev.map(p => 
        p.id === payload.new.id ? payload.new : p
      ));
    } else if (payload.eventType === 'DELETE') {
      setProducts(prev => prev.filter(p => p.id !== payload.old.id));
    }
  });
  
  return () => unsubscribe();
}, []);
```

#### B. Actualizar AdminPage.tsx (Panel de Administración)

**Para gestión de productos:**
```typescript
import { db } from '../lib/supabase';

// Obtener productos
const { data: products } = await db.products.getAll();

// Crear producto
const { data: newProduct, error } = await db.products.create({
  name: 'Nuevo Producto',
  slug: 'nuevo-producto',
  price: 99.99,
  stock: 10,
  active: true,
  provider_id: currentUser.id,
});

// Actualizar producto
const { data, error } = await db.products.update(productId, {
  price: 89.99,
  stock: 5,
});

// Eliminar producto
const { error } = await db.products.delete(productId);
```

#### C. Actualizar Autenticación

**Reemplazar el sistema actual con Supabase Auth:**

```typescript
import { auth } from '../lib/supabase';

// Login
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await auth.signIn(email, password);
  
  if (error) {
    console.error('Error al iniciar sesión:', error);
    return;
  }
  
  // Usuario autenticado
  console.log('Usuario:', data.user);
};

// Register
const handleRegister = async (email: string, password: string, metadata: any) => {
  const { data, error } = await auth.signUp(email, password, metadata);
  
  if (error) {
    console.error('Error al registrar:', error);
    return;
  }
  
  console.log('Usuario registrado:', data.user);
};

// Logout
const handleLogout = async () => {
  const { error } = await auth.signOut();
  if (!error) {
    // Redirigir a login
  }
};

// Verificar sesión
useEffect(() => {
  const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('Usuario autenticado:', session?.user);
    } else if (event === 'SIGNED_OUT') {
      console.log('Usuario cerró sesión');
    }
  });
  
  return () => subscription.unsubscribe();
}, []);
```

---

### 3. Implementar Tiempo Real en Componentes Clave

#### Productos en tiempo real:
```typescript
// En Shop.tsx o cualquier componente que muestre productos
useEffect(() => {
  const unsubscribe = subscribeToTable('products', (payload) => {
    console.log('Cambio en productos:', payload);
    // Actualizar UI automáticamente
  });
  
  return () => unsubscribe();
}, []);
```

#### Órdenes en tiempo real:
```typescript
// En AdminPage.tsx para ver órdenes en tiempo real
useEffect(() => {
  const unsubscribe = subscribeToTable('orders', (payload) => {
    if (payload.eventType === 'INSERT') {
      // Nueva orden recibida
      showNotification('¡Nueva orden recibida!');
    }
  });
  
  return () => unsubscribe();
}, []);
```

---

### 4. Migrar Upload de Imágenes

**Actualizar componente de upload:**

```typescript
import { storage } from '../lib/supabase';

const handleImageUpload = async (file: File, productId: string) => {
  const { data, error } = await storage.uploadProductImage(file, productId);
  
  if (error) {
    console.error('Error al subir imagen:', error);
    return;
  }
  
  // Actualizar producto con la nueva URL
  await db.products.update(productId, {
    image_url: data.url
  });
  
  console.log('Imagen subida:', data.url);
};
```

---

### 5. Eliminar Dependencias de MySQL

Una vez que todo esté funcionando con Supabase:

1. **Detener el servidor MySQL:**
   ```bash
   # Detener npm run server
   ```

2. **Eliminar archivos obsoletos:**
   - `server.cjs` (backend Express)
   - Configuración de MySQL en `.env.local`

3. **Actualizar package.json:**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

---

## 📊 Ventajas que Obtendrás

### Antes (MySQL + Express):
- ❌ Servidor backend separado
- ❌ Sin tiempo real
- ❌ Autenticación manual
- ❌ Sin almacenamiento de archivos
- ❌ Escalabilidad limitada

### Después (Supabase):
- ✅ **Sin servidor backend** - Todo directo desde el frontend
- ✅ **Tiempo real** - Actualizaciones instantáneas
- ✅ **Autenticación robusta** - Sistema completo de usuarios
- ✅ **Storage integrado** - Almacenamiento de imágenes
- ✅ **Escalabilidad infinita** - Crece con tu negocio
- ✅ **API REST automática** - Generada por Supabase
- ✅ **PostgreSQL** - Base de datos profesional

---

## 🎯 Orden Recomendado de Implementación

1. ✅ **Configurar Storage** (5 minutos)
2. 🔄 **Actualizar Shop.tsx** - Productos con tiempo real (15 minutos)
3. 🔄 **Actualizar AdminPage.tsx** - CRUD de productos (20 minutos)
4. 🔄 **Migrar Autenticación** - Login/Register con Supabase Auth (30 minutos)
5. 🔄 **Implementar Upload de Imágenes** (15 minutos)
6. 🔄 **Probar todo el flujo** (20 minutos)
7. 🔄 **Eliminar MySQL y backend** (10 minutos)

**Tiempo total estimado: ~2 horas**

---

## 🆘 Recursos Útiles

- **Dashboard de Supabase**: https://supabase.com/dashboard/project/gveitgpbsltdytmyeupg
- **Documentación**: https://supabase.com/docs
- **SQL Editor**: https://supabase.com/dashboard/project/gveitgpbsltdytmyeupg/sql
- **Table Editor**: https://supabase.com/dashboard/project/gveitgpbsltdytmyeupg/editor
- **Storage**: https://supabase.com/dashboard/project/gveitgpbsltdytmyeupg/storage/buckets

---

## ✨ ¿Listo para continuar?

Dime qué quieres hacer primero:

1. **Configurar Storage** - Para subir imágenes de productos
2. **Actualizar Shop.tsx** - Para usar Supabase en el catálogo
3. **Migrar Autenticación** - Para usar Supabase Auth
4. **Ver los datos en Supabase** - Verificar la migración en el dashboard

¡Tu base de datos ya está en la nube y lista para usar! 🚀
