import * as XLSX from "xlsx";

export const exportExcel = (
    data: any[],
    fileName: string,
    sheetName: string = "Data",
    collWidht: {wch: number}[]=[]
) => {
    const worksheet=XLSX.utils.json_to_sheet(data);

    if (collWidht.length > 0){
        worksheet['!cols'] = collWidht;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, fileName);
}