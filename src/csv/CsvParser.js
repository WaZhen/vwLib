import CSV from 'comma-separated-values';

/**
 * Class to manage CSV operations
 */
export default class CsvParser {
    /**
     * Get a cell of a csv row
     * @param {string} row The csv row to parse
     * @param {string} delimiter The character used as delimiter
     */
    static getCell(row, delimiter, column) {
        const result = new CSV(row, {
            lineDelimiter: '\n',
            cellDelimiter: delimiter
        }).parse();
        alert(result)
        return result[column];
    }
};