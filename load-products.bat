@echo off
echo ========================================
echo Cargando Productos de Ejemplo
echo ========================================
echo.

REM Ajusta esta ruta si tu MySQL está en otra ubicación
set MYSQL_PATH=C:\xampp\mysql\bin
set MYSQL_USER=root
set MYSQL_PASS=root
set MYSQL_DB=kitech

echo Conectando a la base de datos %MYSQL_DB%...
echo.

"%MYSQL_PATH%\mysql.exe" -u %MYSQL_USER% -p%MYSQL_PASS% %MYSQL_DB% < database\seed-products-mysql.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Productos cargados exitosamente
    echo ========================================
    echo.
    echo Se han insertado más de 40 productos
    echo en diferentes categorías:
    echo - Procesadores
    echo - Tarjetas Gráficas
    echo - Memorias RAM
    echo - Almacenamiento
    echo - Placas Madre
    echo - Fuentes de Poder
    echo - Periféricos
    echo - Monitores
    echo - Audio
    echo - Networking
    echo - Refrigeración
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ Error al cargar productos
    echo ========================================
    echo.
    echo Por favor verifica:
    echo 1. Que MySQL esté ejecutándose
    echo 2. Que las credenciales sean correctas
    echo 3. Que la base de datos 'kitech' exista
    echo.
)

pause
