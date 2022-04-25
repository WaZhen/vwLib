import generaLogError from '../Debug/VwErrorLog'
/**
 * @classdesc
 * Utilidades para gestionar ficheros
 * @hideconstructor
 */
export default class VwFile {
    /**
     * Leer una línea de un fichero en texto plano
     * @param {string} filePath Ruta del fichero
     * @param {int} position Posición del cursor
     * @return {returnData} success and string 
     */
    static readLineAtPos(filePath, position) {
        importClass('VTextFile');
        importClass('VFile');
        /**
         * @typedef {object} returnData
         * @param {boolean} success Exito de la operación
         * @param {string} text Contenido leído del fichero
         * @param {int} position Posición del cursor al final de la lectura
         */

        const file = new VTextFile(filePath);

        if (file.open(VFile.OpenModeReadOnly)) {
            const success = file.seek(position);
            if (success) {
                const text = file.readLine();
                const atEnd = file.atEnd();
                if (atEnd) {
                    return {
                        success: true,
                        text,
                        position: -1
                    };
                } else {
                    const newPosition = file.pos();
                    return {
                        success: true,
                        text,
                        position: newPosition
                    }
                }
            } else {
                return {
                    success: false,
                    text: undefined,
                    position: -1
                }
            }
        } else {
            throw new Error(`Unable to open ${filePath} in read only mode`);
            generaLogError({
                msg: `Unable to open ${filePath} in read only mode`
            })
        }
    }

    /**
     * Añade una línea al final de un fichero de texto plano
     * @param {string} filePath Ruta del fichero
     * @param {string} text Texto a añadir
     */
    static appendLine(filePath, text) {
        importClass('VTextFile');
        importClass('VFile');

        const file = new VTextFile(filePath);

        if (file.open(VFile.OpenModeAppend | VFile.OpenModeTruncate)) {
            file.write(text)
            file.close()
        }
    }

    /**
     * Devuelve el contenido del fichero en base 64
     * @param {string} path Ruta del fichero
     * @returns {string} Contenido en base 64
     * @method
     */
    static pathToBase64 = (path) => {
        try {
            importClass("VTextFile");
            importClass("VFile");

            const file = new VTextFile(path);
            file.setCodec("UTF-8");
            let texto;
            if (file.open(VFile.OpenModeReadOnly)) {
                texto = file.readAll();
            }
            const ba = new VByteArray();
            ba.setText(texto);
            const ba64 = ba.toBase64();
            return ba64.toLatin1String();

        } catch (e) {
            alert(JSON.stringify(e, undefined, 2));
        }
    }

    /**
     * A partir de una lista de ficheros, devuelve una lista de contenidos en base 64
     * @param {string[]} pathArray Array the rutas de fichero
     * @returns {string[]} Devuelve un base 64 por fichero
     * @method
     */
    static pathsToBase64 = (pathArray) => {
        try {
            const filesB64 = [];
            pathArray.forEach((path) => {
                const filename = path.replace(/^.*[\\\/]/, '')
                const strB64 = VwFile.pathToBase64(path);
                filesB64.push({
                    file: {
                        name: filename,
                        content: strB64
                    }
                });
            });
            return filesB64;
        } catch (e) {
            alert(JSON.stringify(e, undefined, 2));
        }
    };
}