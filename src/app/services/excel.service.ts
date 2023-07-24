import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

import * as fs from 'file-saver';
// import { Workbook } from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  private obtenerNombreColumna(numCol: number): string {
    const columnas: string[] = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'AA',
      'AB',
      'AC',
      'AD',
      'AE',
      'AF',
      'AG',
      'AH',
      'AI',
      'AJ',
      'AK',
      'AL',
      'AM',
      'AN',
      'AO',
      'AP',
      'AQ',
      'AR',
      'AS',
      'AT',
      'AU',
      'AV',
      'AW',
      'AX',
      'AY',
      'AZ',
      'BA',
      'BB',
      'BC',
      'BD',
      'BE',
      'BF',
      'BG',
      'BH',
      'BI',
      'BJ',
      'BK',
      'BL',
      'BM',
      'BN',
      'BO',
      'BP',
      'BQ',
      'BR',
      'BS',
      'BT',
      'BU',
      'BV',
      'BW',
      'BX',
      'BY',
      'BZ',
    ];
    return columnas[numCol - 1];
  }

  async exportToExcelGenerico(
    title: string,
    sheet: string,
    header: any[],
    data: any[][],
    columnsSize: number[],
    fileName: string,
    flagNumeroVacio?: boolean,
    columnsGroup?: any[],
  ) {
    // const excelJS = window["ExcelJS"];
    // if (excelJS) {
    //   console.log('ExcelJS no cargado!!!');
    // } else {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(sheet, { views: [{ showGridLines: false, zoomScale: 80 }] });
      const initialCol = 2;
      let initialRow = 1;

      worksheet.mergeCells(
        this.obtenerNombreColumna(initialCol).toString() +
          initialRow.toString() +
          ':' +
          this.obtenerNombreColumna(initialCol + header.length - 1).toString() +
          initialRow,
      );
      worksheet.getCell(this.obtenerNombreColumna(initialCol).toString() + initialRow).value = title;
      worksheet.getCell(this.obtenerNombreColumna(initialCol).toString() + initialRow).font = {
        name: 'Calibri',
        family: 4,
        size: 24,
        bold: true,
        color: { argb: 'FF191970' },
      };
      worksheet.getCell(this.obtenerNombreColumna(initialCol).toString() + initialRow).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      initialRow = initialRow + 2;
      let c = initialCol;

      if (columnsGroup !== undefined && columnsGroup.length > 0) {
        for (const hg of columnsGroup) {
          worksheet.mergeCells(
            this.obtenerNombreColumna(c).toString() +
              initialRow.toString() +
              ':' +
              this.obtenerNombreColumna(c + hg.colspan - 1).toString() +
              initialRow,
          );
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).value = hg.label;
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: true,
            color: { argb: 'FFFFFFFF' },
          };
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '92BC37' },
          };
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          };
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          };
          c = c + hg.colspan;
        }
        worksheet.getRow(initialRow).height = 25;
        initialRow++;
      }
      c = initialCol;
      for (const h of header) {
        worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).value = h.label;
        worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).font = {
          name: 'Calibri',
          family: 4,
          size: 11,
          bold: true,
          color: { argb: 'FFFFFFFF' },
        };
        worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '005075' },
        };
        worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        };
        c++;
      }

      initialRow++;

      for (const d of data) {
        c = initialCol;
        for (const h of header) {
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).value = flagNumeroVacio
            ? d[h.name] === '-1'
              ? ''
              : d[h.name]
            : d[h.name];
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: false,
            color: { argb: 'FF000000' },
          };
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          worksheet.getCell(this.obtenerNombreColumna(c).toString() + initialRow).border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          };
          c++;
        }
        initialRow++;
      }

      c = initialCol;
      for (const cs of columnsSize) {
        worksheet.getColumn(c).width = cs;
        c++;
      }

      await workbook.xlsx.writeBuffer().then((dataBlob: any) => {
        fs.saveAs(
          new Blob([dataBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          fileName,
        );
      });
    // }
  }


}
