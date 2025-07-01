package com.example.project.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.example.project.model.AssetData;

public class ExcelHelper {

    public static List<AssetData> excelToAssetData(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            List<AssetData> list = new ArrayList<>();
            if (rows.hasNext()) rows.next(); 

            while (rows.hasNext()) {
                Row row = rows.next();
                AssetData data = new AssetData();

                data.setVcType(getCellValueAsString(row.getCell(0)));
                data.setVcSerialNo(getCellValueAsString(row.getCell(1)));
                data.setUoc(getCellValueAsString(row.getCell(2)));
                data.setOutletName(getCellValueAsString(row.getCell(3)));
                data.setAddress(getCellValueAsString(row.getCell(4)));
                data.setState(getCellValueAsString(row.getCell(5)));
                data.setPostalCode(getCellValueAsString(row.getCell(6)));
                data.setContactPerson(getCellValueAsString(row.getCell(7)));
                data.setMobileNumber(getCellValueAsString(row.getCell(8)));
                data.setStatus(getCellValueAsString(row.getCell(9)));

                list.add(data);
            }

            workbook.close();
            return list;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Excel: " + e.getMessage());
        }
    }

    private static String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf(((Double) cell.getNumericCellValue()).longValue()); // trims .0
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }
}
