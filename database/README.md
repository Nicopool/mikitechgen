# Configuración de Base de Datos MySQL - Mikitech

## Requisitos Previos
- MySQL 8.0 o superior instalado
- Acceso a MySQL con privilegios de creación de bases de datos

## Paso 1: Configurar MySQL

### Opción A: MySQL Local (Recomendado para desarrollo)

1. **Instalar MySQL** (si no lo tienes):
   - Windows: Descarga MySQL Installer desde https://dev.mysql.com/downloads/installer/
   - Durante la instalación, anota la contraseña del usuario `root`

2. **Verificar que MySQL esté corriendo**:
   ```bash
   # En PowerShell o CMD
   mysql --version
   ```

### Opción B: Usar XAMPP (Más fácil)

1. Descarga XAMPP desde https://www.apachefriends.org/
2. Instala y abre el Panel de Control de XAMPP
3. Inicia el servicio "MySQL"
4. Click en "Admin" junto a MySQL para abrir phpMyAdmin

## Paso 2: Crear la Base de Datos

### Método 1: Usando phpMyAdmin (XAMPP)

1. Abre phpMyAdmin (http://localhost/phpmyadmin)
2. Click en "SQL" en el menú superior
3. Copia y pega el contenido de `database/schema.sql`
4. Click en "Continuar"
5. Repite con `database/seed.sql`

### Método 2: Usando MySQL Command Line

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar los scripts
source C:/Users/turca/Desktop/kitappgeminigoogle/database/schema.sql
source C:/Users/turca/Desktop/kitappgeminigoogle/database/seed.sql

# Verificar que se creó correctamente
USE mikitech;
SHOW TABLES;
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM products;
```

## Paso 3: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Actualiza las credenciales de MySQL:

```env
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=root
VITE_DB_PASSWORD=tu_contraseña_aqui
VITE_DB_NAME=mikitech
```

**Nota:** Si usas XAMPP, la contraseña por defecto suele estar vacía:
```env
VITE_DB_PASSWORD=
```

## Paso 4: Instalar Dependencias de MySQL

```bash
npm install mysql2
```

## Paso 5: Verificar la Conexión

Después de configurar todo, reinicia el servidor de desarrollo:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar
npm run dev
```

## Datos de Prueba Incluidos

El script `seed.sql` incluye:

### Usuarios (30 total)
- **1 Admin**: admin@mikitech.com
- **10 Proveedores**: proveedor1@mikitech.com hasta proveedor10@mikitech.com
- **20 Clientes**: juan.perez@email.com, maria.gonzalez@email.com, etc.

### Productos
- 16 productos distribuidos entre los 10 proveedores
- Categorías: Procesadores, Tarjetas Gráficas, RAM, Almacenamiento, Placas Madre, Fuentes

### Kits
- 5 kits predefinidos con productos relacionados
- Precios con descuento incluidos

### Órdenes
- 8 órdenes de ejemplo con diferentes estados
- Relacionadas con usuarios y productos reales

## Credenciales de Acceso Demo

Para probar la aplicación, usa estas credenciales:

**Admin:**
- Email: admin@mikitech.com
- Password: admin123

**Proveedor:**
- Email: proveedor1@mikitech.com
- Password: proveedor123

**Cliente:**
- Email: juan.perez@email.com
- Password: cliente123

## Solución de Problemas

### Error: "Access denied for user"
- Verifica que la contraseña en `.env.local` sea correcta
- Asegúrate de que el usuario tenga permisos

### Error: "Can't connect to MySQL server"
- Verifica que MySQL esté corriendo
- En XAMPP, asegúrate de que el servicio MySQL esté iniciado
- Verifica el puerto (por defecto 3306)

### Error: "Database doesn't exist"
- Ejecuta primero `schema.sql` para crear la base de datos
- Luego ejecuta `seed.sql` para poblarla

## Estructura de la Base de Datos

```
mikitech/
├── profiles (usuarios, proveedores, admin)
├── categories (categorías de productos)
├── products (productos individuales)
├── kits (paquetes de productos)
├── kit_products (relación productos-kits)
├── orders (órdenes de compra)
└── order_items (items de cada orden)
```

## Próximos Pasos

1. Configurar la conexión MySQL en la aplicación
2. Crear API endpoints para CRUD operations
3. Implementar autenticación con MySQL
4. Generar reportes PDF con datos reales

¿Necesitas ayuda? Revisa la consola del navegador para ver mensajes de error detallados.
