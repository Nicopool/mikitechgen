# Mikitech - MySQL Setup Script
# This script will find MySQL and setup the database automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mikitech - MySQL Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Common MySQL installation paths
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

$mysqlPath = $null

# Find MySQL
Write-Host "Buscando MySQL..." -ForegroundColor Yellow
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlPath = $path
        Write-Host "✓ MySQL encontrado en: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlPath) {
    Write-Host ""
    Write-Host "ERROR: No se encontró MySQL instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala una de estas opciones:" -ForegroundColor Yellow
    Write-Host "1. MySQL Server: https://dev.mysql.com/downloads/installer/" -ForegroundColor White
    Write-Host "2. XAMPP (recomendado): https://www.apachefriends.org/" -ForegroundColor White
    Write-Host ""
    Write-Host "Presiona cualquier tecla para salir..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""
Write-Host "Configurando base de datos..." -ForegroundColor Yellow
Write-Host ""

# Get credentials
$user = "root"
$password = "root"

# Create database
Write-Host "1. Creando base de datos 'mikitech'..." -ForegroundColor Cyan
& $mysqlPath -u $user -p$password -e "CREATE DATABASE IF NOT EXISTS mikitech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: No se pudo conectar a MySQL" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  - MySQL esté corriendo" -ForegroundColor White
    Write-Host "  - Usuario: root" -ForegroundColor White
    Write-Host "  - Contraseña: root" -ForegroundColor White
    Write-Host ""
    Write-Host "Si usas XAMPP, inicia el servicio MySQL desde el panel de control" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Presiona cualquier tecla para salir..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✓ Base de datos creada" -ForegroundColor Green

# Run schema
Write-Host "2. Creando tablas..." -ForegroundColor Cyan
& $mysqlPath -u $user -p$password mikitech < "database\schema.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudieron crear las tablas" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Tablas creadas" -ForegroundColor Green

# Run seed
Write-Host "3. Insertando datos de prueba..." -ForegroundColor Cyan
& $mysqlPath -u $user -p$password mikitech < "database\seed.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudieron insertar los datos" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Datos insertados" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Base de datos configurada exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Datos creados:" -ForegroundColor Cyan
Write-Host "  - 1 Admin" -ForegroundColor White
Write-Host "  - 10 Proveedores" -ForegroundColor White
Write-Host "  - 20 Usuarios" -ForegroundColor White
Write-Host "  - 16 Productos" -ForegroundColor White
Write-Host "  - 5 Kits" -ForegroundColor White
Write-Host "  - 8 Órdenes" -ForegroundColor White
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "Ejecuta: npm run server" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
