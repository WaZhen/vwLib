import VwObjectInfo from '../VwObjectInfo/VwObjectInfo';

/** 
 * Herramienta para mapear vObjectInfo de un formulario
 * @extends VwObjectInfo
 * @param {VwObjectInfo}
 */
export default class VwForm extends VwObjectInfo {
    constructor(vWObjectInfo) {
        super(vWObjectInfo);
        if (vWObjectInfo.type() != 18) {
            throw new Error('New VwForm needs a vObjectInfo of type form (18) as input');
        }
    }
}