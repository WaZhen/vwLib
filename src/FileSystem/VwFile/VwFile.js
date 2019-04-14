import generaLogError from '../../VwErp_dat/VwErrorLog/VwErrorLog'
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

        if(file.open(VFile.OpenModeReadOnly)) {
            const success = file.seek(position);
            if(success) {
                const text = file.readLine();
                const atEnd = file.atEnd();
                if(atEnd) {
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
}