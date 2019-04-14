import VwObjectInfo from '../VwObjectInfo/VwObjectInfo';

/** 
 * Class for maping form objects
 * @extends VwObjectInfo
 * @param {VwObjectInfo}
 */
export default class VwForm extends VwObjectInfo{
    constructor(vwObjectInfo) {
        super(vwObjectInfo);
        if(vwObjectInfo.type() != 18) {
            throw new Error('New VwForm needs a vObjectInfo of type form (18) as input');
        }
    }
}