const indexTypesNames = ['Clave única', 'Palabras', 'Múltiples claves', 'Acepta repetidas', 'Trozos de palabras'];

/**
 * Clase para operaciones de tabla
 * @param {idRef} idRef de la tabla aliasProyecto/idTabla
 */
export default class VwTable {
    constructor(idRef) {
        const vWProject = idRef.split("/")[0];
        const vWTable = idRef.split("/")[1];
        this.vWProject = theApp.projectInfo(vWProject);
        this.infovWTable = this.vWProject.tableInfo(vWTable);
    };

    /**
     * <p>Constante de tipo array que contiene los nombres de los tipos de índices</p>
     * <ul>
     *   <li>Clave única</li>
     *   <li>Palabras</li>
     *   <li>Múltiples claves</li>
     *   <li>Acepta repetidas</li>
     *   <li>Trozos de palabras</li>
     * </ul>
     * @type {String[]}
     */
    static get indexTypesNames() {
        return indexTypesNames;
    }

    /**
     * @typedef {Object} vWFields
     * @property {string} id Id del campo
     * @property {string} name Nombre del campo
     * @property {int} type Tipo de campo -> [enum]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vtableinfo/vtableinfo-enumeraciones#tipos-de-campo}
     * @property {int} bindType Tipo de enlace -> [enum]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vtableinfo/vtableinfo-enumeraciones#tipos-de-enlaces-de-campo-bindtype}
     * @property {int} objectType Tipo de campo objeto -> [enum]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vtableinfo/vtableinfo-enumeraciones#tipos-de-enlaces-de-campo-bindtype}
     */

    /**
     * <p>Contiene un array de objetos que representan los campos</p>
     * @type {vWFields[]}
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
     * Contiene los IDs de los índices de la tabla
     * @type {String[]}
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