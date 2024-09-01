import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

// Função para receber os dados para gerar o relatório
function externalDataPDF(data: any) {
  const _pdfPageOrientation = 'p' // 'l' = LANDSCAPE | 'p' = PORTRAIT
  const _pdfPageformat = 'a4'; // FORMATO A4
  let nomeArquivo = `Recibo#${data.Código_Recibo}`;

  let novoCabecalho = [
    `Recibo #${data.Código_Recibo}`,
    `Emissão: ${data.Emissão}`,
    `Razão Social: ${data.Razão_Social}`,
    `Valor Total: ${data.ValorTotal}`,
  ]

  const headers = [
    { content: 'Descrição' },
    { content: 'Competência' },
    { content: 'Valor' },
  ]

  data.CorpoRecibo.map((cr: any) => {
    delete cr.Código_Recibo;
    delete cr.CodDaDescrição;
  });

  let dataPDF = {
    config: {
      pdfName: nomeArquivo,
      pdfPageOrientation: _pdfPageOrientation,
      pdfPageformat: _pdfPageformat
    },
    header: novoCabecalho,
    table: {
      headers: {
        content: headers,
        // style: headStyle,
      },
      data: {
        content: data.CorpoRecibo,
        // style: bodyStyle,
      }
    }
  }
  return dataPDF;
}

// Função para criar o relatório com texto dinâmico e tabela agrupada
function configPDF(dataPDF: any) {
  let _yPosHeader = 10;

  // Cria uma instância do jsPDF
  const doc = new jsPDF({
    orientation: dataPDF.config.pdfPageOrientation,
    format: dataPDF.config.pdfPageformat,
  });

  // Função para adicionar textos com margens
  const addTexts = (textArrayHeader: any) => {
    const lineHeight = 0.8; // Altura da linha

    textArrayHeader.forEach((item: any, index: number) => {
      const leftMargin = 20;
      const rightMargin = 20;
      const maxWidth = doc.internal.pageSize.width - leftMargin - rightMargin;
      doc.setFontSize(12);
      let textLine = doc.splitTextToSize(item, maxWidth);

      // Adiciona as linhas de texto ao documento
      if (index != 0) {
        textLine.forEach((property: any) => {
          if (_yPosHeader + doc.getFontSize() * lineHeight > doc.internal.pageSize.height - 20) {
            doc.addPage(); // Adiciona uma nova página se o texto ultrapassar a margem inferior
            _yPosHeader = 10; // Reinicia a posição vertical
          }
          doc.text(property, leftMargin, _yPosHeader);
          _yPosHeader += doc.getFontSize() * lineHeight;
        });
      } else {
        textLine.forEach((property: any) => {
          if (_yPosHeader + doc.getFontSize() * lineHeight > doc.internal.pageSize.height - 20) {
            doc.addPage();
            _yPosHeader = 10;
          }
          doc.text(property, doc.internal.pageSize.width * 4 / 5, _yPosHeader);
          _yPosHeader += doc.getFontSize() * lineHeight;
        });

      }
    });
  };

  // Função para adicionar o cabeçalho
  const addHeader = () => {

    // Adiciona os textos com margens
    addTexts(dataPDF.header);
  };

  // Estrutura dos cabeçalhos conforme a estrutura fornecida
  const transformHeaderStructure = (headers: any[]) => {
    let row1: any = [];
    let row2: any = [];
    let hasChildren = false;
    let rowSpan = headers.some(header => header.children && header.children.length > 0) ? 2 : 1;

    headers.forEach(header => {
      if (header.children && header.children.length > 0) {
        hasChildren = true;
        row1.push({ content: header.content, colSpan: header.children.length });
        header.children.forEach((child: any) => {
          row2.push({ content: child.content });
        });
      } else {
        row1.push({ content: header.content, rowSpan: rowSpan });
      }
    });

    return hasChildren ? [row1, row2] : [row1];
  }

  // Função para criar a tabela agrupada
  const addGroupedTable = (table: any, startY: any) => {
    const transformedHeaders = transformHeaderStructure(table.headers.content);

    // Gerando a tabela
    autoTable(doc, {
      head: transformedHeaders,
      body: [table.data],
      startY: startY + 5,
      theme: 'striped',
      styles: {
        cellWidth: 'wrap'
      },
      margin: {
        top: 5,
        horizontal: 10
      },
      headStyles: {
        fillColor: [75, 85, 99],
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: 'center',
        valign: 'middle',
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [192, 192, 192] //Silver
      },
      bodyStyles: {
        fontSize: 11,
        halign: 'right',
        valign: 'middle',
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [192, 192, 192] //Silver
      }
    });
  };

  // Adiciona o cabeçalho
  addHeader();

  // Adiciona a tabela abaixo dos textos dinâmicos
  addGroupedTable(dataPDF.table, _yPosHeader); // Adiciona um pequeno espaço entre o texto e a tabela

  // Salva o PDF
  doc.save(`${dataPDF.config.pdfName}.pdf`);
};

export function generatePDF(dataPdf: any) {
  configPDF(externalDataPDF(dataPdf[0]));
}
