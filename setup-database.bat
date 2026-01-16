@echo off
echo ========================================
echo Mikitech - MySQL Database Setup
echo ========================================
echo.
echo Este script creara la base de datos y poblara con datos de prueba
echo.
echo Presiona cualquier tecla para continuar...
pause > nul

echo.
echo Conectando a MySQL...
echo.

mysql -u root -proot < database\schema.sql
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo crear el esquema de la base de datos
    echo Verifica que MySQL este corriendo y las credenciales sean correctas
    pause
    exit /b 1
)

echo.
echo ✓ Esquema creado exitosamente
echo.

mysql -u root -proot < database\seed.sql
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudieron insertar los datos
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ Base de datos configurada exitosamente!
echo ========================================
echo.
echo Datos creados:
echo - 1 Admin
echo - 10 Proveedores
echo - 20 Usuarios
echo - 16 Productos
echo - 5 Kits
echo - 8 Ordenes
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
