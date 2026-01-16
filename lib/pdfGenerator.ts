import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportConfig {
    title: string;
    subtitle?: string;
    data: any[];
    columns: { header: string; dataKey: string }[];
    fileName: string;
    type: 'sales' | 'inventory' | 'orders' | 'users';
}

export class PDFReportGenerator {
    private doc: jsPDF;
    private pageWidth: number;
    private pageHeight: number;
    private margin: number = 20;

    constructor() {
        this.doc = new jsPDF();
        this.pageWidth = this.doc.internal.pageSize.getWidth();
        this.pageHeight = this.doc.internal.pageSize.getHeight();
    }

    // Add Mikitech logo (text-based)
    private addLogo(y: number = 15): number {
        this.doc.setFontSize(24);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('MIKI', this.margin, y);

        this.doc.setFont('helvetica', 'normal');
        this.doc.text('tech.', this.margin + 25, y);

        return y + 10;
    }

    // Add Mikitech Logo (Left) and Company Info (Center)
    private addHeader(title: string, subtitle?: string): number {
        const logoSize = 25;

        // Draw Logo (Placeholder for Rocket/Brand)
        this.doc.setFillColor(20, 20, 20);
        this.doc.circle(this.margin + 12, 25, 12, 'F');
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('MK', this.margin + 8, 28);

        // Company Info (Centered)
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFontSize(14);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('MIKITECH S.A. DE C.V.', this.pageWidth / 2, 20, { align: 'center' });

        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text('RFC: MIK800101XYZ', this.pageWidth / 2, 25, { align: 'center' });
        this.doc.text('Av. Tecnológica 123, Silicon Valley, CA', this.pageWidth / 2, 29, { align: 'center' });
        this.doc.text('Tel: 55 1234 5678', this.pageWidth / 2, 33, { align: 'center' });

        // Horizontal Line
        this.doc.setDrawColor(200, 200, 200);
        this.doc.setLineWidth(0.5);
        this.doc.line(this.margin + 40, 38, this.pageWidth - this.margin, 38);

        let currentY = 50;

        // Client & Folio Info
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('CLIENTE:', this.margin, currentY);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(subtitle || 'Público en general', this.margin + 20, currentY);

        this.doc.setFont('helvetica', 'bold');
        const dateLabel = `FECHA: ${new Date().toLocaleDateString('es-ES')}`;
        const folioLabel = `FOLIO: ${Math.floor(Math.random() * 1000) + 100}`; // Simulation

        this.doc.text(folioLabel, this.pageWidth - this.margin - 40, currentY - 5);
        this.doc.text(dateLabel, this.pageWidth - this.margin - 40, currentY);

        currentY += 15;
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(title, this.margin, currentY);

        return currentY + 5;
    }

    // Add footer with page numbers
    private addFooter(pageNumber: number, totalPages: number) {
        const footerY = this.pageHeight - 15;

        this.doc.setFontSize(8);
        this.doc.setTextColor(150, 150, 150);

        // Page number
        this.doc.text(
            `Página ${pageNumber} de ${totalPages}`,
            this.pageWidth / 2,
            footerY,
            { align: 'center' }
        );

        // Company info
        this.doc.text('Mikitech - Ecosistemas Tecnológicos', this.margin, footerY);
        this.doc.text('www.mikitech.com', this.pageWidth - this.margin, footerY, { align: 'right' });
    }

    // Generate sales report
    generateSalesReport(config: ReportConfig) {
        let currentY = this.addHeader(config.title, config.subtitle);

        // Add summary if it's sales report
        if (config.type === 'sales' && config.data.length > 0) {
            const total = config.data.reduce((sum, item) => sum + (item.total || 0), 0);
            const avgOrder = total / config.data.length;

            this.doc.setFillColor(245, 245, 245);
            this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 25, 'F');

            this.doc.setFontSize(10);
            this.doc.setFont('helvetica', 'bold');
            this.doc.text('Resumen Ejecutivo', this.margin + 5, currentY + 7);

            this.doc.setFont('helvetica', 'normal');
            this.doc.setFontSize(9);
            this.doc.text(`Total de Ventas: $${total.toFixed(2)}`, this.margin + 5, currentY + 14);
            this.doc.text(`Órdenes: ${config.data.length}`, this.margin + 5, currentY + 20);
            this.doc.text(`Promedio por Orden: $${avgOrder.toFixed(2)}`, this.margin + 70, currentY + 14);

            currentY += 30;
        }

        // Add table
        (this.doc as any).autoTable({
            startY: currentY,
            head: [config.columns.map(col => col.header)],
            body: config.data.map(row =>
                config.columns.map(col => {
                    const value = row[col.dataKey];
                    if (typeof value === 'number' && col.dataKey.includes('price') || col.dataKey.includes('total')) {
                        return `$${value.toFixed(2)}`;
                    }
                    return value || '-';
                })
            ),
            theme: 'plain',
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                fontSize: 9,
                lineColor: [220, 220, 220],
                lineWidth: 0.1,
                halign: 'left' // Align headers left
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [0, 0, 0],
                lineColor: [220, 220, 220],
                lineWidth: 0.1,
                cellPadding: 4 // Add padding for "air"
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255]
            },
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'right'
            },
            margin: { left: this.margin, right: this.margin },
            didDrawPage: (data: any) => {
                this.addFooter(data.pageNumber, data.pageCount);
            }
        });

        // Save the PDF
        this.doc.save(config.fileName);
    }

    // Generate inventory report
    generateInventoryReport(config: ReportConfig) {
        let currentY = this.addHeader(config.title, config.subtitle);

        // Add inventory summary
        if (config.data.length > 0) {
            const totalItems = config.data.reduce((sum, item) => sum + (item.stock || 0), 0);
            const lowStock = config.data.filter(item => item.stock < 10).length;
            const outOfStock = config.data.filter(item => item.stock === 0).length;

            this.doc.setFillColor(245, 245, 245);
            this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 25, 'F');

            this.doc.setFontSize(10);
            this.doc.setFont('helvetica', 'bold');
            this.doc.text('Estado del Inventario', this.margin + 5, currentY + 7);

            this.doc.setFont('helvetica', 'normal');
            this.doc.setFontSize(9);
            this.doc.text(`Total Items: ${totalItems}`, this.margin + 5, currentY + 14);
            this.doc.text(`Productos: ${config.data.length}`, this.margin + 5, currentY + 20);

            // Low stock warning
            if (lowStock > 0) {
                this.doc.setTextColor(255, 59, 48);
                this.doc.text(`⚠ Stock Bajo: ${lowStock}`, this.margin + 70, currentY + 14);
            }
            if (outOfStock > 0) {
                this.doc.setTextColor(255, 0, 0);
                this.doc.text(`✖ Agotados: ${outOfStock}`, this.margin + 70, currentY + 20);
            }
            this.doc.setTextColor(0, 0, 0);

            currentY += 30;
        }

        (this.doc as any).autoTable({
            startY: currentY,
            head: [config.columns.map(col => col.header)],
            body: config.data.map(row =>
                config.columns.map(col => {
                    const value = row[col.dataKey];
                    if (col.dataKey === 'stock') {
                        return value < 10 ? `⚠ ${value}` : value;
                    }
                    if (typeof value === 'number' && (col.dataKey.includes('price') || col.dataKey.includes('total'))) {
                        return `$${value.toFixed(2)}`;
                    }
                    return value || '-';
                })
            ),
            theme: 'plain',
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                fontSize: 9,
                lineColor: [220, 220, 220],
                lineWidth: 0.1
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [0, 0, 0],
                lineColor: [220, 220, 220],
                lineWidth: 0.1
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255]
            },

            margin: { left: this.margin, right: this.margin },
            didDrawPage: (data: any) => {
                this.addFooter(data.pageNumber, data.pageCount);
            }
        });

        this.doc.save(config.fileName);
    }

    // Generic report generator
    generate(config: ReportConfig) {
        switch (config.type) {
            case 'sales':
                this.generateSalesReport(config);
                break;
            case 'inventory':
                this.generateInventoryReport(config);
                break;
            default:
                this.generateSalesReport(config);
        }
    }
}

// Helper function to export
export const generatePDFReport = (config: ReportConfig) => {
    const generator = new PDFReportGenerator();
    generator.generate(config);
};
