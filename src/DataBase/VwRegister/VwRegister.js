import VwTable from '../VwTable/VwTable';
import VwMapper from '../VwMapper/VwMapper';
import VwList from '../VwList/VwList';
import VwTransactions from '../VwTransactions/VwTransactions';
import VwTableInfo from '../VwTableInfo/VwTableInfo';

/**
 * Clase que representa un registro
 * @extends VwTable
 * @param {VRegister} VRegister {@link https://doc.velneo.es/vregister.html|VRegister}
 * @param {VwMapper} [vWMapper] Si se le pasa un {@link VwMapper}, se crea un método por cada campo para acceder al valor o navegar al maestro
 */
export default class VwRegister extends VwTable {

    static TYPE_CECO = 1;
    static TYPE_VREG = 2;
    static GET_VALUES_OBJECT = 1;
    static GET_VALUES_KEY_VALUE = 2;

    constructor(vRegister, vWMapper) {
        const vWTableInfo = vRegister.tableInfo();
        const idRef = vWTableInfo.idRef();
        super(idRef);
        this.vRegister = vRegister;
        this.tableName = vWTableInfo.name();
        this.tableId = vWTableInfo.id();

        for (let key in vWMapper.mappedValues) {
            const value = vWMapper.mappedValues[key](this.vRegister);
            this[`${key}`] = value;
        }
    }

    /**
     * Utiliza un índice de clave única para directamente localizar y obtener una instancia
     * @param {string} idRefTable idRef aliasProyecto/idTabla de la tabla
     * @param {string} index Índice de clave única
     * @param {string[]} resolver Array con los valores que resuelven el índice
     * @returns {VwRegister} VwRegister
     */
    static getRegister(idRefTable, index, resolver) {

        if (!Array.isArray(resolver)) {
            throw new Error('VwRegister.getRegister: the resolver parameter must be an Array of strings');
        }

        const registerList = new VRegisterList(theRoot);
        registerList.setTable(idRefTable);
        registerList.load(index, resolver);

        if (registerList.size() > 1) {
            throw new Error('VwRegister.getRegister: more than 1 result found. Check the query to use an unique index');
        }

        if (registerList.size() == 0) {
            return null;
        }

        if (registerList.size() == 1) {
            const register = new VRegister(theRoot);
            register.copyFrom(registerList.readAt(0));
            const tableInfo = register.tableInfo();
            const mapper = new VwMapper(tableInfo);
            return new VwRegister(register, mapper);
        }
    }

    /**
     * Da de alta un registro y lo retorna como una instancia de VwRegister
     * @param {string} tableIdRef idRef de la tabla aliasProyecto/idTabla
     * @param {Object} data Objeto con los valores del registro a crear. Las claves son los id de los campos (en mayúsculas)
     * @returns {VwRegister} VwRegister
     */
    static createRegister(tableIdRef, data, skipErrors=false) {
        const vregister = new VRegister(theRoot);
        vregister.setTable(tableIdRef);
        const tableInfo = vregister.tableInfo();
        const tableName = tableInfo.name();
        let saved = false;
        let currentKey;
        for (let key in data) {
            if (tableInfo.fieldName(key)) {
                currentKey = key
                const value = data[key];
                if(typeof value == "object" && !(value instanceof Date) && (value != null)) {
                    try {
                        const info = new VwTableInfo(tableInfo);
                        const bountdedTableInfo = info.getBoundedTableInfo(key);
                        // Data for extended tables
                        if(info.getFieldBoundedType(key) == VTableInfo.BindTypeMasterExt) {
                            VwTransactions.transaction('Create register', () => {
                                vregister.addRegister();
                            });
                            saved = true;
                            value["ID"] = vregister.fieldToString("ID");
                        }
                        const master = VwRegister.createRegister(bountdedTableInfo.idRef(), value);
                        if(info.getFieldBoundedType(key) != VTableInfo.BindTypeMasterExt) {
                            vregister.setField(key, master.ID());
                        }
                    } catch(e) {
                        if(!skipErrors) {
                            throw new Error(e.message);
                        } else {
                            alert(e.message);
                        }
                    }
                } else {
                    try {
                        vregister.setField(key, value);
                    } catch(e) {
                        if(!skipErrors) {
                            if(typeof data[currentKey] == "object") {
                                    throw new Error(`setField error. key: ${currentKey}, value: ${JSON.stringify(data[currentKey])}`);
                            } else {
                                    throw new Error(`setField error. key: ${currentKey}, value: ${data[currentKey]}`);
                            }
                        } else {
                            alert(`setField error. key: ${currentKey}, value: ${JSON.stringify(data[currentKey])}`);
                        }
                    }
                }
            } else {
                if(!skipErrors) {
                    throw new Error(`The field ${key} does not exist in the table ${tableName}`);
                } else {
                    alert(`The field ${key} does not exist in the table ${tableName}`);
                }
            }
        }
        if(!saved) {
            VwTransactions.transaction('Create register', () => {
                vregister.addRegister();
            });
        } else {
            VwTransactions.transaction('Save register', () => {
                vregister.modifyRegister();
            });
        }
        const mapper = new VwMapper(tableInfo);
        return new VwRegister(vregister, mapper);
    }

    /**
     * Carga los plurales del registro y devuelve un array de {@link VwRegister}
     * @param {string} pluralId id del plural a cargar
     * @returns {VwRegister[]}
     */
    loadPlurals = (pluralId) => {
        if (!pluralId) {
            throw new Error(`LoadPlurals: pluralId not provided`);
        }
        const list = this.vRegister.loadPlurals(pluralId);
        return VwList.parseArray(list);
    }

    /**
     * Modificar un registro
     * @param {Object} data Objeto con los datos. Las claves son los IDs de los campos a modificar
     * @returns {bolean} Devuelve si la transacción ha tenido éxito
     */
    modifyRegister(data, skipErrors=false) {
        const tableInfo = this.vRegister.tableInfo();
        const tableName = tableInfo.name();
        let success = false;
        let currentKey;
        VwTransactions.transaction('Modify register', () => {
            for (let key in data) {
                if (tableInfo.fieldName(key)) {
                    currentKey = key
                    try {
                        const value = data[key];
                        this.vRegister.setField(key, value);
                    } catch(e) {
                        if(!skipErrors) {
                            if(typeof data[currentKey] == "object") {
                                throw new Error(`setField error. key: ${currentKey}, value: ${JSON.stringify(data[currentKey])}`);
                            } else {
                                throw new Error(`setField error. key: ${currentKey}, value: ${data[currentKey]}`);
                            }
                        } else {
                            alert(`setField error. key: ${currentKey}, value: ${JSON.stringify(data[currentKey])}`);
                        }
                    }
                } else {
                    if(!skipErrors) {
                        throw new Error(`The field ${key} does not exist in the table ${tableName}`);
                    }
                }
            }
            success = this.vRegister.modifyRegister();
        });
        return success;
    }

    getMaster = (masterId, masterType = VwRegister.TYPE_CECO, mapper) => {
        if (typeof masterId !== 'string') {
            throw new Error('VwRegister.getMaster -> first parameter must be a string');
        }

        if (typeof masterType !== 'number') {
            throw new Error('VwRegister.getMaster -> second parameter must be a number');
        }

        if (mapper && !mapper instanceof VwMapper) {
            throw new Error('VwRegister.getMaster -> third parameter must be an instance if VwMapper');
        }

        const masterVregister = this.vRegister.readMaster(masterId);
        if (masterType === VwRegister.TYPE_CECO) {
            const masterTableInfo = masterVregister.tableInfo();
            const masterMapper = mapper ? mapper : new VwMapper(masterTableInfo);
            const masterVwRegister = new VwRegister(masterVregister, masterMapper);
            return masterVwRegister;
        } else if (masterType === VwRegister.TYPE_VREG) {
            return masterVregister;
        }
    }

    /**
     * @typedef {getAllValuesReturn}
     * @property {string} id The velneo table field identifier
     * @property {string} name The table field name
     * @property {string} value The value of the field
     */
    /**
     * Returns a Json with every table field information and its value for the register
     * @param {string[]} arrMasterField Array of masters IDs to find
     * @param {string[]} arrFilter Array to filter the values wanted. If empty or not provided the function will return all the fields
     * @return {getAllValuesReturn[]} 
     *      Returns an array of objects with the information
     */
    getValues = (arrMasterField = ['NAME'], arrFilter = [], format = VwRegister.GET_VALUES_OBJECT) => {

        if (!Array.isArray(arrMasterField)) {
            throw new Error(`VwRegister.getValues -> first parameter must be an array`);
        }

        if (!Array.isArray(arrFilter)) {
            throw new Error(`VwRegister.getValues -> second parameter must be an array`);
        }
        let result;
        if (format === VwRegister.GET_VALUES_OBJECT) {
            result = [];
        } else if (format === VwRegister.GET_VALUES_KEY_VALUE) {
            result = {};
        }

        let fieldsInfo = this.vWFieldsIdName;

        if (arrFilter.length > 0) {
            fieldsInfo = fieldsInfo.filter(field => {
                return arrFilter.indexOf(field.id) !== -1;
            });
        }
        fieldsInfo.forEach(fieldInfo => {
            let value;
            const tableInfo = this.vRegister.tableInfo();
            const fieldNumber = tableInfo.findField(fieldInfo.id);
            const type = tableInfo.fieldType(fieldNumber);
            if (fieldInfo.bindType == 1) { // master field
                delete fieldInfo['bindType'];
                const master = this[fieldInfo.id]();
                const BreakException = {};
                try {
                    arrMasterField.forEach(fieldId => {
                        try {
                            value = master[fieldId]();
                            throw BreakException;
                        } catch (e) {
                            // field does not exist in master
                        }
                    });
                } catch (e) {
                    // break exception
                }
                if (!value) {
                    value = this[fieldInfo.id]()['ID']();
                }
            } else {
                value = this[fieldInfo.id]();
            }
            if (format === VwRegister.GET_VALUES_OBJECT) {
                result.push({
                    ...fieldInfo,
                    type,
                    value,
                });
            } else if (format === VwRegister.GET_VALUES_KEY_VALUE) {
                if (!!fieldInfo.name && fieldInfo.name.indexOf('___') === -1) {
                    result[fieldInfo.name] = value;
                }
            }
        });

        return result;
    }

    /**
     * Elimina el registro
     * @param {boolean} cascade true si quieres eliminar en cascada
     */
    deleteRegister = (cascade = false) => {
        const registerId = this.vRegister.fieldToString('ID');
        VwTransactions.transaction(`Delete ${this.tableName} register, id: ${registerId}`, () => {
            if (cascade) {
                this.deletePlurals();
            }
            this.vRegister.deleteRegister();
        });
    }

    /**
     * Elimina todos los plurales del registro en cascada
     */
    deletePlurals() {
        const pluralsIdList = this.getPluralsArray();
        pluralsIdList.forEach(pluralId => {
            const plurals = this.loadPlurals(pluralId);
            plurals.forEach(plural => {
                plural.deleteRegister(true);
            })
        })
    }

    /**
     * Obtiene un array con los ids de los plurales del registro
     * @returns {string[]}
     */
    getPluralsArray() {
        const tableInfo = this.vRegister.tableInfo();
        const pluralCount = tableInfo.pluralCount();
        const pluralList = [];

        for (let i = 0; i < pluralCount; i++) {
            pluralList.push(tableInfo.pluralId(i));
        }

        return pluralList;
    }

    /**
     * Utilidad de validación. Genera un error si el vRegister no pertenece a la tabla tableIdRef
     * @param {Object} vRegister [vRegister]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vregister}
     * @param {string} tableIdRef idRef de la tabla aliasProyecto/idTabla
     */
    static checkRegister(vRegister, tableIdRef) {
        const tableInfo = vRegister.tableInfo();
        if (tableInfo.idRef() != tableIdRef) {
            throw new Error("Parameter is not a register of " + tableIdRef);
        }
    }

    /**
     * Devuelve un json con todos los campos que no son relaciones a otras tablas
     * @param {string[]} except campos a excluir del resultado
     * @returns {Object} Json que mapea ID campo -> valor
     */
    getNotMastersFieldsJson(except=[]) {
        returnJson = {};
        const tableInfo = this.vRegister.tableInfo();
        const fieldsNumber = tableInfo.fieldCount();
        for(let i=0; i<=fieldsNumber; i++) {
            try {
                if(tableInfo.fieldBindType(i) == 0) {
                    const fieldId = tableInfo.fieldId(i);
                    if(except.indexOf(fieldId) == -1) {
                        returnJson[fieldId] = this[fieldId]();
                    }
                }
            } catch(e) {

            }
        }
        return returnJson;
    }

    /**
     * Imprime en un alert los ids de los campos. Utilidad para desarrollo o depuración
     */
    printFieldIdList() {
        printString = "";
        const tableInfo = this.vRegister.tableInfo();
        const fieldsNumber = tableInfo.fieldCount();
        for(let i=0; i<=fieldsNumber; i++) {
            printString += tableInfo.fieldId(i) + "\n";
        }
        alert(printString);
    }

    /**
     * Nombre plural de la tabla
     */
    get pluralTableName() {
        this.vRegister.tableInfo().name();
    }

    /**
     * Nombre singular de la tabla
     */
    get singleTableName() {
        this.vRegister.tableInfo().singleName();
    }
}