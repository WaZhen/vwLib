import VwTransactions from '../VwTransactions/VwTransactions';

const indexTypesNames = ['Clave única', 'Palabras', 'Múltiples claves', 'Acepta repetidas', 'Trozos de palabras'];

/**
 * Class for table operations
 * @param{idRef} idRef projectAlias/TableId of the Velneo object
 */
export default class VwTable {
    /**
     * @type{String[]}
     */
    static get indexTypesNames(){
        return indexTypesNames;
    }

    /**
     * Creates a register
     * @param {string} idRefTable idRef of the table
     * @param {Object} data Object: the key must be the field ID.
     */
    static createRegister(idRefTable, data) {
        
    }

    constructor(idRef) {
        const vwProject = idRef.split("/")[0];
        const vwTable = idRef.split("/")[1];
        this.vwProject = theApp.projectInfo(vwProject);
        this.infovwTable = this.vwProject.tableInfo(vwTable);
    };

    /**
     * @type {Array}
     */
    get vwFields() {
        const vwFields = [];
        const numvwFields = this.infovwTable.fieldCount();
        
        for(let i = 0; i < numvwFields; i++) {
            vwFields.push({
                id: this.infovwTable.fieldId(i),
                name: this.infovwTable.fieldName(i),
                type: this.infovwTable.fieldType(i),
                bindType: this.infovwTable.fieldBindType(i),
                objectType: this.infovwTable.fieldObjectType(i)
            });
        }

        return vwFields;
    };

    get vwFieldsIdName() {
        const vwFieldsId = [];
        const numVwFields = this.infovwTable.fieldCount();

        for(let i = 0; i < numVwFields; i++) {
            const object = {
                id: this.infovwTable.fieldId(i),
                name: this.infovwTable.fieldName(i)
            }

            if(this.infovwTable.fieldBindType(i) == 1) {
                object = {
                    ...object,
                    bindType: 1
                }
            }
            vwFieldsId.push(object);
        }

        return vwFieldsId;
    }

    /**
     * @type{Array}
     */
    get vwIdexes() {
        const vwIdexes = [];
        const numVwIdexes = this.infovwTable.indexCount();

        for(let i = 0; i < numVwIdexes; i++) {
            vwIdexes.push({
                id: this.infovwTable.indexId(i),
                nombre: this.infovwTable.indexName(i),
                tipo: this.infovwTable.indexType(i),
                nombreTipo: vwTable.indexTypesNames[this.infovwTable.indexType(i)] 
            });
        }

        return vwIdexes;
    }
}