import VwTable from '../VwTable/VwTable';
import VwMapper from '../VwMapper/VwMapper';

/**
 * Class for register operations
 * @extends VwTable
 * @param {VRegister} VRegister {@link https://doc.velneo.es/vregister.html|VRegister}
 * @param {VwMapper} vwMapper Optional. If provided, the class will map all the register values ORM like
 * @property {VRegister} vRegister Velneo VRegister {@link https://doc.velneo.es/vregister.html|VRegister}
 * @property {string} tableName Table name
 * @property {string} tableId Table id
 */
export default class VwRegister extends VwTable {

    static TYPE_CECO = 1;
    static TYPE_VREG = 2;
    static GET_VALUES_OBJECT = 1;
    static GET_VALUES_KEY_VALUE = 2;

    constructor(vRegister, vwMapper) {
        const vwTableInfo = vRegister.tableInfo();
        const idRef = vwTableInfo.idRef();
        super(idRef);
        this.vRegister = vRegister;
        this.tableName = vwTableInfo.name();
        this.tableId = vwTableInfo.id();

        for(let key in vwMapper.mappedValues) {
            const value = vwMapper.mappedValues[key](this.vRegister);
            this[`${key}`] = value;
        }
    }

     /**
     * Returns a VwRegister that matches the query made with the parameters. If no results found returns null
     * @param {string} idRefTable 
     * @param {string} index 
     * @param {string[]} resolver 
     * @returns {VwRegister} VwRegister
     */
    static getRegister(idRefTable, index, resolver) {

        if(!Array.isArray(resolver)) {
            throw new Error('VwRegister.getRegister: the resolver parameter must be an Array of strings');
        }

        const registerList = new VRegisterList(theRoot);
        registerList.setTable(idRefTable);
        registerList.load(index, resolver);
        
        if(registerList.size() > 1) {
            throw new Error('VwRegister.getRegister: more than 1 result found. Check the query to use an unique index');
        }

        if(registerList.size() == 0) {
            return null;
        }

        if(registerList.size() == 1) {
            const register = new VRegister(theRoot);
            register.copyFrom(registerList.readAt(0));
            const tableInfo = register.tableInfo();
            const mapper = new VwMapper(tableInfo);
            return new VwRegister(register, mapper);
        }
    }

    /**
     * Returns the VwRegister of a master
     * @param {string} masterId the field master Id
     * @param {int} masterType VwRegister.TYPE_CECO, VwRegister.TYPE_VREG
     * @return {VwRegister}
     */
    getMaster = (masterId, masterType = VwRegister.TYPE_CECO, mapper) => {
        if(typeof masterId !== 'string') {
            throw new Error('VwRegister.getMaster -> first parameter must be a string');
        }

        if(typeof masterType !== 'number') {
            throw new Error('VwRegister.getMaster -> second parameter must be a number');
        }

        if(mapper && !mapper instanceof VwMapper) {
            throw new Error('VwRegister.getMaster -> third parameter must be an instance if VwMapper');
        }

        const masterVregister = this.vRegister.readMaster(masterId);
        if(masterType === VwRegister.TYPE_CECO) {
            const masterTableInfo = masterVregister.tableInfo();
            const masterMapper = mapper ? mapper : new VwMapper(masterTableInfo);
            const masterVwRegister = new VwRegister(masterVregister, masterMapper);
            return masterVwRegister;
        } else if(masterType === VwRegister.TYPE_VREG) {
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

        if(!Array.isArray(arrMasterField)) {
            throw new Error(`VwRegister.getValues -> first parameter must be an array`);
        }

        if(!Array.isArray(arrFilter)) {
            throw new Error(`VwRegister.getValues -> second parameter must be an array`);
        }
        let result;
        if(format === VwRegister.GET_VALUES_OBJECT) {
            result = [];
        } else if (format === VwRegister.GET_VALUES_KEY_VALUE) {
            result = {};
        }

        let fieldsInfo = this.vwFieldsIdName;
        
        if(arrFilter.length > 0) {
            fieldsInfo = fieldsInfo.filter( field => {
                return arrFilter.indexOf(field.id) !== -1;
            });
        }
        fieldsInfo.forEach(fieldInfo => {
            let value;
            if(fieldInfo.bindType == 1) {
                delete fieldInfo['bindType']
                const master = this[fieldInfo.id]();
                const BreakException = {};
                try {
                    arrMasterField.forEach(fieldId => {
                        try{
                            value = master[fieldId]();
                            throw BreakException;
                        } catch(e) {
                            // field does not exist in master
                        }
                    });
                } catch(e) {
                    // break exception
                }
                if(!value) {
                    value = this[fieldInfo.id]()['ID']();
                }
            } else {
                value = this[fieldInfo.id]();
            }
            if(format === VwRegister.GET_VALUES_OBJECT) {
                result.push({
                    ...fieldInfo,
                    value,
                    table: this.tableName
                });
            } else if(format === VwRegister.GET_VALUES_KEY_VALUE) {
                if(!!fieldInfo.name && fieldInfo.name.indexOf('___') === -1) {
                    result[fieldInfo.name] = value;
                }
            }
        });

        return result;
    }
}