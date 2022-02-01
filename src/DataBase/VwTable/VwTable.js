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
    static get indexTypesNames() {
        return indexTypesNames;
    }

    constructor(idRef) {
        const vWProject = idRef.split("/")[0];
        const vWTable = idRef.split("/")[1];
        this.vWProject = theApp.projectInfo(vWProject);
        this.infovWTable = this.vWProject.tableInfo(vWTable);
    };

    /**
     * @type {Array}
     */
    get vWFields() {
        const vWFields = [];
        const numvWFields = this.infovWTable.fieldCount();

        for (let i = 0; i < numvWFields; i++) {
            vWFields.push({
                id: this.infovWTable.fieldId(i),
                name: this.infovWTable.fieldName(i),
                type: this.infovWTable.fieldType(i),
                bindType: this.infovWTable.fieldBindType(i),
                objectType: this.infovWTable.fieldObjectType(i)
            });
        }

        return vWFields;
    };

    get vWFieldsIdName() {
        const vWFieldsId = [];
        const numVwFields = this.infovWTable.fieldCount();

        for (let i = 0; i < numVwFields; i++) {
            const object = {
                id: this.infovWTable.fieldId(i),
                name: this.infovWTable.fieldName(i)
            }

            if (this.infovWTable.fieldBindType(i) == 1) {
                object = {
                    ...object,
                    bindType: 1
                }
            }
            vWFieldsId.push(object);
        }

        return vWFieldsId;
    }

    /**
     * @type{Array}
     */
    get vWIdexes() {
        const vWIdexes = [];
        const numVwIdexes = this.infovWTable.indexCount();

        for (let i = 0; i < numVwIdexes; i++) {
            vWIdexes.push({
                id: this.infovWTable.indexId(i),
                nombre: this.infovWTable.indexName(i),
                tipo: this.infovWTable.indexType(i),
                nombreTipo: indexTypesNames[this.infovWTable.indexType(i)]
            });
        }

        return vWIdexes;
    }
}