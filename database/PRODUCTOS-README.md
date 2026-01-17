# Carga de Productos de Ejemplo para Mikitech

## 📦 Productos Incluidos

Este seed incluye **más de 40 productos reales de tecnología gaming** distribuidos en las siguientes categorías:

### Procesadores (4 productos)
- AMD Ryzen 9 7950X - $699.99
- Intel Core i9-14900K - $589.99
- AMD Ryzen 7 7800X3D - $449.99
- Intel Core i5-14600K - $319.99

### Tarjetas Gráficas (4 productos)
- NVIDIA RTX 4090 - $1599.99
- AMD Radeon RX 7900 XTX - $999.99
- NVIDIA RTX 4070 Ti - $799.99
- AMD Radeon RX 7800 XT - $549.99

### Memorias RAM (4 productos)
- Corsair Vengeance RGB 32GB - $159.99
- G.Skill Trident Z5 64GB - $299.99
- Kingston Fury Beast 16GB - $79.99
- Corsair Dominator Platinum RGB 32GB - $239.99

### Almacenamiento (4 productos)
- Samsung 990 PRO 2TB - $249.99
- WD Black SN850X 4TB - $449.99
- Crucial P5 Plus 1TB - $129.99
- Kingston KC3000 2TB - $199.99

### Placas Madre (4 productos)
- ASUS ROG Strix X670E - $449.99
- MSI MPG Z790 Carbon - $389.99
- Gigabyte B650 AORUS Elite - $219.99
- ASRock Z790 Taichi - $429.99

### Fuentes de Poder (4 productos)
- Corsair RM1000x - $189.99
- EVGA SuperNOVA 850W - $149.99
- Seasonic Focus GX-750 - $119.99
- be quiet! Straight Power 11 850W - $169.99

### Periféricos (6 productos)
**Mouses:**
- Logitech G Pro X Superlight - $159.99
- Razer DeathAdder V3 Pro - $149.99
- SteelSeries Aerox 3 Wireless - $99.99

**Teclados:**
- Corsair K70 RGB TKL - $169.99
- Ducky One 3 SF - $139.99
- Keychron Q1 Pro - $199.99

### Monitores (4 productos)
- ASUS ROG Swift PG27AQDM - $899.99
- LG 27GR95QE-B - $999.99
- Samsung Odyssey G7 - $649.99
- Dell S2722DGM - $299.99

### Audio (3 productos)
- SteelSeries Arctis Nova Pro Wireless - $349.99
- HyperX Cloud Alpha Wireless - $199.99
- Logitech G Pro X Wireless - $229.99

### Networking (2 productos)
- ASUS RT-AX86U Pro - $249.99
- TP-Link Archer AX73 - $149.99

### Refrigeración (3 productos)
- NZXT Kraken Z73 RGB - $299.99
- Corsair iCUE H150i Elite - $189.99
- Arctic Liquid Freezer II 280 - $119.99

## 🚀 Cómo Cargar los Productos

### Opción 1: Usando el Script Batch (Windows - Recomendado)

1. **Asegúrate de que MySQL esté ejecutándose**
2. **Ejecuta el script:**
   ```
   load-products.bat
   ```
3. El script cargará automáticamente todos los productos

### Opción 2: Manualmente desde MySQL Workbench

1. Abre **MySQL Workbench**
2. Conéctate a la base de datos `kitech`
3. Abre el archivo `database/seed-products-mysql.sql`
4. Ejecuta todo el script (Ctrl + Shift + Enter)

### Opción 3: Desde la línea de comandos

```bash
# Navega a la carpeta del proyecto
cd c:\Users\turca\Desktop\kitappgeminigoogle

# Ejecuta el comando SQL (ajusta la ruta de mysql.exe si es necesario)
C:\xampp\mysql\bin\mysql.exe -u root -proot kitech < database\seed-products-mysql.sql
```

## ✅ Verificación

Después de cargar los productos, puedes verificar la carga ejecutando estas consultas en MySQL:

```sql
-- Ver total de productos
SELECT COUNT(*) as total_productos FROM products;

-- Ver total de categorías
SELECT COUNT(*) as total_categorias FROM categories;

-- Ver productos por categoría
SELECT c.name as categoria, COUNT(pc.product_id) as total_productos
FROM categories c
LEFT JOIN product_categories pc ON c.id = pc.category_id
GROUP BY c.id, c.name
ORDER BY total_productos DESC;

-- Ver los primeros 10 productos
SELECT p.name, p.sku, p.price, p.stock, c.name as categoria
FROM products p
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
LIMIT 10;
```

## 📝 Notas Importantes

1. **Proveedor Asignado**: Todos los productos se asignarán al primer proveedor que esté registrado en la base de datos
2. **SKU Únicos**: Cada producto tiene un SKU único siguiendo el formato `TIPO-MARCA-MODELO`
3. **Imágenes**: Se usan imágenes de Unsplash para demostración
4. **Stock**: Todos los productos tienen stock inicial entre 8 y 45 unidades
5. **Categorías**: Las categorías se crean automáticamente si no existen

## 🔧 CRUD Disponible

Con estos productos cargados, podrás probar todo el CRUD desde el dashboard del proveedor:

- ✅ **Create**: Añadir nuevos productos
- ✅ **Read**: Ver lista de productos
- ✅ **Update**: Editar productos existentes
- ✅ **Delete**: Eliminar productos
- ✅ **Toggle Status**: Activar/Desactivar productos
- ✅ **Create Kits**: Usar estos productos para crear kits

## 🎯 Próximos Pasos

Una vez cargados los productos:

1. **Inicia sesión como proveedor**
2. Ve a la sección **"Productos"**
3. Verás todos los productos cargados
4. Prueba las funcionalidades de:
   - Añadir nuevo producto
   - Editar productos existentes
   - Cambiar estado (Activo/Inactivo)
   - Eliminar productos
5. Ve a **"Kits"** y crea kits usando estos productos

---

**¡Listo!** Ahora tienes una base de datos completa con productos reales para probar todo el sistema. 🚀
