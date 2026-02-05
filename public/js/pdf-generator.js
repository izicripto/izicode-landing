/**
 * PDF Generator para Izicode Edu
 * Gera relatórios profissionais de projetos e progresso de alunos
 * Requer: jsPDF e html2canvas
 */

class IzicodePDFGenerator {
    constructor() {
        this.readyPromise = this.loadLibraries();
    }

    // Carregar bibliotecas necessárias
    async loadLibraries() {
        if (typeof jsPDF === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        if (typeof html2canvas === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Gerar PDF de projeto criado pela IA
     * @param {Object} project - Dados do projeto
     * @param {Object} options - Opções de customização
     */
    async generateProjectPDF(project, options = {}) {
        await this.readyPromise;
        const {
            schoolName = 'Escola',
            schoolLogo = null,
            teacherName = 'Professor(a)',
            includeQRCode = true
        } = options;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configurações
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Cores Izicode
        const brandColor = [2, 132, 199]; // #0284c7
        const darkColor = [15, 23, 42]; // #0f172a
        const lightColor = [148, 163, 184]; // #94a3b8

        // Header com logo
        if (schoolLogo) {
            doc.addImage(schoolLogo, 'PNG', margin, yPosition, 30, 30);
        }

        // Logo Izicode (direita)
        doc.setFillColor(...brandColor);
        doc.circle(pageWidth - margin - 10, yPosition + 10, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('IZI', pageWidth - margin - 15, yPosition + 13);

        yPosition += 40;

        // Título do documento
        doc.setTextColor(...darkColor);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('PLANO DE AULA', margin, yPosition);

        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor(...lightColor);
        doc.setFont('helvetica', 'normal');
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);

        yPosition += 15;

        // Linha separadora
        doc.setDrawColor(...brandColor);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);

        yPosition += 15;

        // Informações da escola
        doc.setFontSize(10);
        doc.setTextColor(...darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text('ESCOLA:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(schoolName, margin + 25, yPosition);

        yPosition += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSOR(A):', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(teacherName, margin + 35, yPosition);

        yPosition += 15;

        // Título do projeto
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...brandColor);
        const title = doc.splitTextToSize(project.title || 'Projeto sem título', pageWidth - 2 * margin);
        doc.text(title, margin, yPosition);
        yPosition += title.length * 8 + 10;

        // Metadados do projeto
        if (project.grade) {
            doc.setFontSize(10);
            doc.setTextColor(...darkColor);
            doc.setFont('helvetica', 'bold');
            doc.text('ANO/SÉRIE:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(project.grade, margin + 30, yPosition);
            yPosition += 7;
        }

        if (project.duration) {
            doc.setFont('helvetica', 'bold');
            doc.text('DURAÇÃO:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(project.duration, margin + 30, yPosition);
            yPosition += 7;
        }

        if (project.difficulty) {
            doc.setFont('helvetica', 'bold');
            doc.text('DIFICULDADE:', margin, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(project.difficulty, margin + 35, yPosition);
            yPosition += 10;
        }

        // Descrição/Objetivos
        if (project.description || project.objectives) {
            yPosition = this.checkPageBreak(doc, yPosition, 30);

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text('OBJETIVOS', margin, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setTextColor(...darkColor);
            doc.setFont('helvetica', 'normal');
            const description = doc.splitTextToSize(
                project.description || project.objectives || '',
                pageWidth - 2 * margin
            );
            doc.text(description, margin, yPosition);
            yPosition += description.length * 5 + 10;
        }

        // Materiais necessários
        if (project.materials && project.materials.length > 0) {
            yPosition = this.checkPageBreak(doc, yPosition, 30);

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text('MATERIAIS NECESSÁRIOS', margin, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setTextColor(...darkColor);
            doc.setFont('helvetica', 'normal');

            project.materials.forEach((material, index) => {
                yPosition = this.checkPageBreak(doc, yPosition, 10);
                doc.text(`• ${material}`, margin + 5, yPosition);
                yPosition += 6;
            });
            yPosition += 5;
        }

        // Passo a passo
        if (project.steps && project.steps.length > 0) {
            yPosition = this.checkPageBreak(doc, yPosition, 30);

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text('PASSO A PASSO', margin, yPosition);
            yPosition += 8;

            doc.setFontSize(10);
            doc.setTextColor(...darkColor);

            project.steps.forEach((step, index) => {
                yPosition = this.checkPageBreak(doc, yPosition, 15);

                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}.`, margin, yPosition);
                doc.setFont('helvetica', 'normal');

                const stepText = doc.splitTextToSize(step, pageWidth - 2 * margin - 10);
                doc.text(stepText, margin + 8, yPosition);
                yPosition += stepText.length * 5 + 5;
            });
        }

        // Competências BNCC
        if (project.bnccCompetencies && project.bnccCompetencies.length > 0) {
            yPosition = this.checkPageBreak(doc, yPosition, 30);

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text('COMPETÊNCIAS BNCC', margin, yPosition);
            yPosition += 8;

            doc.setFontSize(9);
            doc.setTextColor(...darkColor);
            doc.setFont('helvetica', 'italic');

            project.bnccCompetencies.forEach((competency) => {
                yPosition = this.checkPageBreak(doc, yPosition, 10);
                const compText = doc.splitTextToSize(`✓ ${competency}`, pageWidth - 2 * margin - 5);
                doc.text(compText, margin + 5, yPosition);
                yPosition += compText.length * 4 + 3;
            });
        }

        // Footer
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(...lightColor);
        doc.setFont('helvetica', 'italic');
        doc.text('Gerado por Izicode Edu - Plataforma de Robótica Educacional', margin, footerY);
        doc.text('izicode.com.br', pageWidth - margin - 30, footerY);

        // Salvar PDF
        const fileName = `${project.title || 'projeto'}_${new Date().getTime()}.pdf`;
        doc.save(fileName);

        return fileName;
    }

    /**
     * Gerar relatório de progresso do aluno
     */
    async generateStudentProgressPDF(studentData, options = {}) {
        await this.readyPromise;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = margin;

        const brandColor = [2, 132, 199];
        const darkColor = [15, 23, 42];

        // Título
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...brandColor);
        doc.text('RELATÓRIO DE PROGRESSO', margin, yPosition);
        yPosition += 15;

        // Dados do aluno
        doc.setFontSize(12);
        doc.setTextColor(...darkColor);
        doc.setFont('helvetica', 'bold');
        doc.text('Aluno:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(studentData.name || 'Não informado', margin + 20, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'bold');
        doc.text('Nível:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${studentData.level || 1}`, margin + 20, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'bold');
        doc.text('XP Total:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${studentData.xp || 0} pontos`, margin + 25, yPosition);
        yPosition += 15;

        // Projetos completados
        if (studentData.projects && studentData.projects.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...brandColor);
            doc.text('PROJETOS COMPLETADOS', margin, yPosition);
            yPosition += 10;

            doc.setFontSize(10);
            doc.setTextColor(...darkColor);
            doc.setFont('helvetica', 'normal');

            studentData.projects.forEach((project, index) => {
                yPosition = this.checkPageBreak(doc, yPosition, 10);
                doc.text(`${index + 1}. ${project.title}`, margin + 5, yPosition);
                yPosition += 6;
            });
        }

        // Salvar
        const fileName = `relatorio_${studentData.name || 'aluno'}_${new Date().getTime()}.pdf`;
        doc.save(fileName);

        return fileName;
    }

    /**
     * Verificar se precisa de quebra de página
     */
    checkPageBreak(doc, currentY, requiredSpace) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;

        if (currentY + requiredSpace > pageHeight - margin) {
            doc.addPage();
            return margin;
        }

        return currentY;
    }

    /**
     * Converter elemento HTML para PDF com Suporte a Múltiplas Páginas
     */
    async htmlToPDF(elementId, filename = 'documento.pdf') {
        await this.readyPromise;

        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Elemento não encontrado:', elementId);
            return;
        }

        // Wait for images to load if any
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG slightly smaller
        const { jsPDF } = window.jspdf;

        const pdfWidth = 210; // A4 width mm
        const pdfHeight = 297; // A4 height mm

        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add extra pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight; // This calculation ensures continuity

            pdf.addPage();
            // Important: jsPDF addImage position is relative to top of page.
            // If we have 1000mm image. Page 1 takes 0-297.
            // Page 2 should show 297-594.
            // So we place the image at -297.

            // The formula: position = -pageHeight * pageIndex
            const pageIndex = pdf.getNumberOfPages() - 1;
            position = -pdfHeight * pageIndex;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(filename);
    }
}

// Exportar para uso global
window.IzicodePDFGenerator = IzicodePDFGenerator;

// Criar instância global
window.pdfGenerator = new IzicodePDFGenerator();
