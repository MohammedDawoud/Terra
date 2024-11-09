import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportationService {

  constructor(public translatService:TranslateService) { }

  exportExcel(data:any[], name:string,headersLabels:string[]) {
    import("xlsx").then(xlsx => {

      const worksheet = xlsx.utils.json_to_sheet(data)

      // var headerCells = Object.getOwnPropertyNames(worksheet).filter(c => c.substr(c.length - 1) == '1' && c.length == 2)
      // for (var i = 0; i < headerCells.length; i++) {
      //   worksheet[headerCells[i]].v = headersLabels[i];
      // }
      let headers = [];
      headers.push(headersLabels);
      xlsx.utils.sheet_add_aoa(worksheet, headers);

      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, name);
    });
  }

exportExcelRTL(data: any[], name: string, headersLabels: string[]) {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);

      // Set the worksheet direction to RTL
      worksheet['!dir'] = 'ltr';

      // Add headers
      let headers = [];
      headers.push(headersLabels);
      xlsx.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });

      // Create the workbook and add the worksheet
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

      // Write the workbook with RTL direction
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, name);
    });
  }




  saveAsExcelFile(buffer: any, fileName: string) {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
       saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }


}
