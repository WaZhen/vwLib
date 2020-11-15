import VWObjectInfo from '../VWObjectInfo/VWObjectInfo';

/** 
 * Class for maping form objects
 * @extends VWObjectInfo
 * @param {VWObjectInfo}
 */
export default class VwForm extends VWObjectInfo {
    constructor(vWObjectInfo) {
        super(vWObjectInfo);
        if (vWObjectInfo.type() != 18) {
            throw new Error('New VWForm needs a vObjectInfo of type form (18) as input');
        }
    }
}