import VwTable from '../VwTable/VwTable';
import VwRegister from '../VwRegister/VwRegister';
import VwMapper from '../VwMapper/VwMapper';

/**
 * <p>Clase para trabajar con listas de Velneo.</p>
 * <p>En caso de crear una instancia usando el constructor, se crea una propiedad vwRegisters que contiene un array de [VwRegister]{@link VwRegister}</p>
 * @extends {VwTable}
 * @param {VRegisterList} VRegisterList [VRegisterList]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vregisterlist}
 */
export default class VwList extends VwTable {

    constructor(VRegisterList) {
        const idRef = VRegisterList.tableInfo().idRef();
        super(idRef);
        this.vwRegisters = VwList.parseArray(VRegisterList);
    }

    /**
     * Herramienta principal de búsqueda. Equivalente a cargar lista
     * @param {string} idRef idRef de la tabla de búsqueda
     * @param {string} vwIndex ID del índice por el que se va a cargar lista
     * @param {string[]} vwParts Array con los valores de las partes de resolución del índice
     * @param {string[]} [sort=[]] Ordena el resultado por los campos indicados en el array
     * @returns {VwRegister[]} Array de [VwRegister]{@link VwRegister}
     */
    static search(idRef, vwIndex, vwParts, sort=[]) {
        if (typeof idRef !== 'string') {
            throw new Error('VwList.search first parameter must be a string');
        }
        if (typeof vwIndex !== 'string') {
            throw new Error('VwList.search second parameter must be a string');
        }
        if (!Array.isArray(vwParts)) {
            throw new Error('VwList.search. third parameter must be an array');
        }

        const vWList = new VRegisterList(theRoot);
        vWList.setTable(idRef);
        vWList.load(vwIndex, vwParts);
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
     * <p>Retorna un array de [VwRegister]{@link VwRegister} a partir de una 
     * [VRegisterList]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vregisterlist}</p>
     * @param {VRegisterList} 
     * @return {VwRegister[]} 
     * @method
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
     * <p>Retorna el idRef de la tabla de una 
     * [VRegisterList]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vregisterlist}</p>
     * @param {VRegisterList} VRegisterList [VRegisterList]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vregisterlist}
     * @return {string} Idref de la tabla
     * @method
     */
    static tableIdRef = (velneoVRegisterList) => {
        const tableInfo = velneoVRegisterList.tableInfo();
        const idRef = tableInfo.idRef();
        return idRef;
    }
}