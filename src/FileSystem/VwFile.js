import generaLogError from '../../VWErp_dat/VWErrorLog/VWErrorLog'
/**
 * Class for manage files
 */
export default class VwFile {
    /**
     * @static Method to read a single line from a plain text file
     * @param {string} filePath The path of the file to read
     * @param {int} position The position of the cursor
     * @return {object} success and string 
     */
    static readLineAtPos(filePath, position) {
        importClass('VTextFile');
        importClass('VFile');

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
    static appendLine(filePath, text) {
        importClass('VTextFile');
        importClass('VFile');

        const file = new VTextFile(filePath);

        if (file.open(VFile.OpenModeAppend | VFile.OpenModeTruncate)) {
            file.write(text)
            file.close()
        }
    }

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