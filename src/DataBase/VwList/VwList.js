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
     * @param {string} vwIndex Index id 
     * @param {string[]} vwParts Array with the parts of the index
     */
    static search(idRef, vwIndex, vwParts) {
        // Devuelve un array de VRegister 
        if(typeof idRef !== 'string') {
            throw new Error('VwList.search first parameter must be a string');
        }
        if(typeof vwIndex !== 'string') {
            throw new Error('VwList.search second parameter must be a string');
        }
        if(!Array.isArray(vwParts)) {
            throw new Error('VwList.search. third parameter must bu an array');
        }

        const vwList = new VRegisterList(theRoot);
        vwList.setTable(idRef);
        vwList.load(vwIndex, vwParts);
        const numResults = vwList.size();
        const results = [];

        for(let i = 0; i < numResults; i++) {
            const result = new VRegister(theRoot);
            result.copyFrom(vwList.readAt(i));
            results.push(result);
        }

        return results;
    }

    /**
     * Returns an array of VwRegisters from a velneo VRegisterList
     * @param {VRegisterList} Velneo VRegisterList
     * @return {VwRegister[]} Array of VwRegisters
     */
    static parseArray = (velneoVRegisterList) => {
        const tableInfo = velneoVRegisterList.tableInfo();
        const mapper = new VwMapper(tableInfo);
        const numResults = velneoVRegisterList.size();
        const results = [];

        for(let i = 0; i < numResults; i++) {
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