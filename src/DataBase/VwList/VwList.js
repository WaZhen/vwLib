import VwTable from '../VwTable/VwTable';
import VwRegister from '../VwRegister/VwRegister';
import VwMapper from '../VwMapper/VwMapper';

/**
 * Class for list operations
 * @extends VwTable
 * @param {idRef}
 */
export default class VwList extends VwTable {

    constructor(idRef) {
        super(idRef);
    }

    /**
     * 
     * @param {string} idRef Table idRef
     * @param {string} vWIndex Index id 
     * @param {string[]} vWParts Array with the parts of the index
     */
    static search(idRef, vWIndex, vWParts, sort=[]) {
        // Devuelve un array de VRegister 
        if (typeof idRef !== 'string') {
            throw new Error('VWList.search first parameter must be a string');
        }
        if (typeof vWIndex !== 'string') {
            throw new Error('VWList.search second parameter must be a string');
        }
        if (!Array.isArray(vWParts)) {
            throw new Error('VWList.search. third parameter must bu an array');
        }

        const vWList = new VRegisterList(theRoot);
        vWList.setTable(idRef);
        vWList.load(vWIndex, vWParts);
        if(sort.length > 0) {
            vWList.sort(sort);
        }
        const tableInfo = vWList.tableInfo()
        const mapper = new VwMapper(tableInfo)
        const numResults = vWList.size();
        const results = [];

        for (let i = 0; i < numResults; i++) {
            const result = new VRegister(theRoot);
            result.copyFrom(vWList.readAt(i));
            results.push(new VwRegister(result, mapper));
        }

        return results;
    }

    /**
     * Returns an array of VWRegisters from a velneo VRegisterList
     * @param {VRegisterList} Velneo VRegisterList
     * @return {VwRegister[]} Array of VWRegisters
     */
    static parseArray = (velneoVRegisterList) => {
        const tableInfo = velneoVRegisterList.tableInfo();
        const mapper = new VwMapper(tableInfo);
        const numResults = velneoVRegisterList.size();
        const results = [];
        for (let i = 0; i < numResults; i++) {
            const result = new VRegister(theRoot);
            result.copyFrom(velneoVRegisterList.readAt(i));
            results.push(new VwRegister(result, mapper));
        }

        return results;
    };

    /**
     * @param {VRegisterList} Velneo VRegister list
     * @return {string} table idRef
     */
    static tableIdRef = (velneoVRegisterList) => {
        const tableInfo = velneoVRegisterList.tableInfo();
        const idRef = tableInfo.idRef();
        return idRef;
    }
}