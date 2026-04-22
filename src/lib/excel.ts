import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const EXCEL_FILE_PATH = path.join(process.cwd(), 'datalog.xlsx');

export interface ExcelRow {
    PatientID: string;
    Datum: string;
    Åldersgrupp: string;
    Födelseår: string;
    // Dynamic situation keys will be mapped here
    [key: string]: string | boolean | undefined;
}

export async function appendToExcel(data: ExcelRow) {
    let workbook: XLSX.WorkBook;

    // Determine sheet name based on age group
    // Default to "Övrigt" if something unexpected comes in, though schema validation should prevent this
    const sheetName = data.Åldersgrupp === "0-6" ? "0-6" : (data.Åldersgrupp === "7-18" ? "7-18" : "Övrigt");

    // check if file exists
    if (fs.existsSync(EXCEL_FILE_PATH)) {
        try {
            const fileBuffer = fs.readFileSync(EXCEL_FILE_PATH);
            workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        } catch (error) {
            // If file is corrupted or unreadable, start fresh (or could throw)
            console.error("Error reading existing Excel file, creating new one:", error);
            workbook = XLSX.utils.book_new();
        }
    } else {
        // Create new workbook
        workbook = XLSX.utils.book_new();
    }

    let worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        // Create new sheet if it doesn't exist
        worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Convert worksheet to JSON to append
    // header: 1 means array of arrays, which effectively gives us raw rows if we wanted, 
    // but utils.sheet_to_json default is array of objects keyed by header.
    const existingData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    existingData.push(data);

    // Filter out obsolete columns
    const columnsToRemove = ['Sit_Test', 'Time_Left', 'HA_Config', 'HA_Config_R', 'HA_Config_L'];
    const cleanedData = existingData.map((row: any) => {
        columnsToRemove.forEach(col => {
            if (col in row) {
                delete row[col];
            }
        });
        return row;
    });

    // Convert back to sheet
    const newWorksheet = XLSX.utils.json_to_sheet(cleanedData);
    workbook.Sheets[sheetName] = newWorksheet;

    // Write to file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    fs.writeFileSync(EXCEL_FILE_PATH, excelBuffer);
}
