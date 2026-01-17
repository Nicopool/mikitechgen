interface ReportData {
    title: string;
    subtitle?: string;
    type: 'sales' | 'inventory' | 'users' | 'orders' | 'vendors';
    data: any[];
    summary?: {
        label: string;
        value: string | number;
        color?: string;
    }[];
}

export class HTMLReportGenerator {
    private generateStyles(): string {
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    padding: 40px;
                    color: #1a1a1a;
                }
                
                .report-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .report-header {
                    background: linear-gradient(135deg, #000000 0%, #434343 100%);
                    color: white;
                    padding: 60px;
                    position: relative;
                    overflow: hidden;
                }
                
                .report-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 400px;
                    height: 400px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 50%;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 30px;
                }
                
                .logo-icon {
                    width: 50px;
                    height: 50px;
                    background: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 20px;
                    color: black;
                }
                
                .logo-text {
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: -1px;
                }
                
                .report-title {
                    font-size: 48px;
                    font-weight: 900;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: -2px;
                }
                
                .report-subtitle {
                    font-size: 18px;
                    opacity: 0.8;
                    font-weight: 600;
                }
                
                .report-meta {
                    display: flex;
                    gap: 40px;
                    margin-top: 30px;
                    padding-top: 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                
                .meta-label {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    opacity: 0.6;
                    font-weight: 700;
                }
                
                .meta-value {
                    font-size: 16px;
                    font-weight: 700;
                }
                
                .summary-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 24px;
                    padding: 40px 60px;
                    background: #f8f9fa;
                }
                
                .summary-card {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s ease;
                }
                
                .summary-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
                    border-color: #000;
                }
                
                .summary-label {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #6c757d;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                
                .summary-value {
                    font-size: 36px;
                    font-weight: 900;
                    color: #000;
                }
                
                .data-section {
                    padding: 60px;
                }
                
                .section-title {
                    font-size: 24px;
                    font-weight: 900;
                    text-transform: uppercase;
                    margin-bottom: 30px;
                    letter-spacing: -1px;
                }
                
                .data-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    border: 2px solid #e9ecef;
                    border-radius: 16px;
                    overflow: hidden;
                }
                
                .data-table thead {
                    background: #f8f9fa;
                }
                
                .data-table th {
                    padding: 20px 24px;
                    text-align: left;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 900;
                    color: #6c757d;
                    border-bottom: 2px solid #e9ecef;
                }
                
                .data-table td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f3f5;
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .data-table tbody tr:hover {
                    background: #f8f9fa;
                }
                
                .data-table tbody tr:last-child td {
                    border-bottom: none;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .status-active {
                    background: #d4edda;
                    color: #155724;
                }
                
                .status-inactive {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .status-pending {
                    background: #fff3cd;
                    color: #856404;
                }
                
                .report-footer {
                    background: #f8f9fa;
                    padding: 40px 60px;
                    text-align: center;
                    border-top: 2px solid #e9ecef;
                }
                
                .footer-text {
                    font-size: 13px;
                    color: #6c757d;
                    font-weight: 600;
                }
                
                .footer-logo {
                    font-size: 20px;
                    font-weight: 900;
                    margin-top: 20px;
                    color: #000;
                }
                
                .print-button {
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    background: #000;
                    color: white;
                    padding: 18px 32px;
                    border-radius: 50px;
                    font-weight: 900;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                }
                
                .print-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
                }
                
                @media print {
                    body {
                        background: white;
                        padding: 0;
                    }
                    
                    .print-button {
                        display: none;
                    }
                    
                    .report-container {
                        box-shadow: none;
                        border-radius: 0;
                    }
                }
                
                .chart-container {
                    margin: 40px 0;
                    padding: 30px;
                    background: #f8f9fa;
                    border-radius: 16px;
                }
                
                .price {
                    font-weight: 900;
                    color: #000;
                }
                
                .low-stock {
                    color: #dc3545;
                    font-weight: 900;
                }
                
                .role-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                }
                
                .role-admin {
                    background: #e7d4ff;
                    color: #6f42c1;
                }
                
                .role-vendor {
                    background: #cfe2ff;
                    color: #0d6efd;
                }
                
                .role-user {
                    background: #e9ecef;
                    color: #495057;
                }
            </style>
        `;
    }

    private generateHeader(title: string, subtitle?: string): string {
        const now = new Date();
        const date = now.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const time = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const folio = `MK-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;

        return `
            <div class="report-header">
                <div class="logo">
                    <div class="logo-icon">MK</div>
                    <div class="logo-text">MIKITECH</div>
                </div>
                <h1 class="report-title">${title}</h1>
                ${subtitle ? `<p class="report-subtitle">${subtitle}</p>` : ''}
                <div class="report-meta">
                    <div class="meta-item">
                        <span class="meta-label">Fecha de Generación</span>
                        <span class="meta-value">${date}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Hora</span>
                        <span class="meta-value">${time}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Folio</span>
                        <span class="meta-value">${folio}</span>
                    </div>
                </div>
            </div>
        `;
    }

    private generateSummary(summary?: { label: string; value: string | number; color?: string }[]): string {
        if (!summary || summary.length === 0) return '';

        return `
            <div class="summary-section">
                ${summary.map(item => `
                    <div class="summary-card">
                        <div class="summary-label">${item.label}</div>
                        <div class="summary-value" style="${item.color ? `color: ${item.color}` : ''}">${item.value}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    private generateSalesTable(data: any[]): string {
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID Orden</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(order => `
                        <tr>
                            <td><strong>#${order.id?.slice(0, 8) || 'N/A'}</strong></td>
                            <td>${order.userName || order.userEmail || 'Cliente'}</td>
                            <td>${new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                            <td><span class="status-badge status-${order.status?.toLowerCase() || 'pending'}">${order.status || 'PENDING'}</span></td>
                            <td style="text-align: right;" class="price">$${(order.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    private generateInventoryTable(data: any[]): string {
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th style="text-align: right;">Precio</th>
                        <th style="text-align: right;">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(product => `
                        <tr>
                            <td><strong>${product.sku || 'N/A'}</strong></td>
                            <td>${product.name}</td>
                            <td>${product.category || 'Sin categoría'}</td>
                            <td style="text-align: right;" class="price">$${(product.price || 0).toFixed(2)}</td>
                            <td style="text-align: right;" class="${product.stock < 10 ? 'low-stock' : ''}">
                                ${product.stock || 0} ${product.stock < 10 ? '⚠️' : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    private generateUsersTable(data: any[]): string {
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(user => `
                        <tr>
                            <td><strong>${user.id?.slice(0, 8) || 'N/A'}</strong></td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><span class="role-badge role-${user.role?.toLowerCase() || 'user'}">${user.role || 'USER'}</span></td>
                            <td><span class="status-badge status-${user.status?.toLowerCase() || 'active'}">${user.status || 'ACTIVE'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    private generateFooter(): string {
        return `
            <div class="report-footer">
                <p class="footer-text">Este documento fue generado automáticamente por el sistema Mikitech</p>
                <p class="footer-text">Ecosistemas Tecnológicos y Activos Digitales</p>
                <div class="footer-logo">MIKITECH</div>
            </div>
        `;
    }

    public generate(config: ReportData): void {
        let tableHTML = '';
        let summary = config.summary || [];

        // Generate summary based on type if not provided
        if (summary.length === 0) {
            switch (config.type) {
                case 'sales':
                    const totalSales = config.data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
                    const avgOrder = config.data.length > 0 ? totalSales / config.data.length : 0;
                    summary = [
                        { label: 'Total de Ventas', value: `$${totalSales.toFixed(2)}` },
                        { label: 'Órdenes Procesadas', value: config.data.length },
                        { label: 'Ticket Promedio', value: `$${avgOrder.toFixed(2)}` }
                    ];
                    tableHTML = this.generateSalesTable(config.data);
                    break;
                case 'inventory':
                    const totalProducts = config.data.length;
                    const lowStock = config.data.filter(p => p.stock < 10).length;
                    const totalValue = config.data.reduce((sum, p) => sum + (p.price * p.stock), 0);
                    summary = [
                        { label: 'Total Productos', value: totalProducts },
                        { label: 'Stock Bajo', value: lowStock, color: lowStock > 0 ? '#dc3545' : '#28a745' },
                        { label: 'Valor Total', value: `$${totalValue.toFixed(2)}` }
                    ];
                    tableHTML = this.generateInventoryTable(config.data);
                    break;
                case 'users':
                    const totalUsers = config.data.length;
                    const activeUsers = config.data.filter(u => u.status === 'ACTIVE').length;
                    const vendors = config.data.filter(u => u.role === 'VENDOR').length;
                    summary = [
                        { label: 'Total Usuarios', value: totalUsers },
                        { label: 'Usuarios Activos', value: activeUsers },
                        { label: 'Proveedores', value: vendors }
                    ];
                    tableHTML = this.generateUsersTable(config.data);
                    break;
                default:
                    tableHTML = this.generateSalesTable(config.data);
            }
        }

        const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${config.title} - Mikitech</title>
                ${this.generateStyles()}
            </head>
            <body>
                <div class="report-container">
                    ${this.generateHeader(config.title, config.subtitle)}
                    ${this.generateSummary(summary)}
                    <div class="data-section">
                        <h2 class="section-title">Datos Detallados</h2>
                        ${tableHTML}
                    </div>
                    ${this.generateFooter()}
                </div>
                <button class="print-button" onclick="window.print()">
                    📄 Imprimir / Guardar PDF
                </button>
            </body>
            </html>
        `;

        // Open in new window
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
        } else {
            alert('Por favor, permite las ventanas emergentes para ver el reporte');
        }
    }
}

// Export helper function
export const generateHTMLReport = (config: ReportData) => {
    const generator = new HTMLReportGenerator();
    generator.generate(config);
};
