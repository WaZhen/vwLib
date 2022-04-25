import CSV from 'comma-separated-values';

/**
 * @hideconstructor
 * @classdesc
 * Herramientas para operaciones con ficheros CSV
 */
export default class CsvParser {
    /**
     * Obtener una celda a partir de una fila
     * @param {string} row Cadena de texto con la fila a procesar
     * @param {int} column The column you want to 
     * @param {string} [delimiter=;] Caracter usado como delimitador
     */
    static getCell(row, column, delimiter=";") {
        const result = new CSV(row, {
            lineDelimiter: '\n',
            cellDelimiter: delimiter
        }).parse();
        return result[column];
    }
};