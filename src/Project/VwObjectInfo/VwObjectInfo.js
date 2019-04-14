/**
 * Class for maping {@link https://doc.velneo.es/vobjectinfo.html|VObjectInfo}
 */
export default class VwObjectInfo {
    /**
     * @param {VObjectInfo} vwObjectInfo {@link https://doc.velneo.es/vobjectinfo.html|VObjectInfo}
     */
    constructor(vwObjectInfo) {
        this.vwObjectInfo = vwObjectInfo;
        const typeControlCode = 19;
        const numSubObjects = this.vwObjectInfo.subObjectCount(typeControlCode);
        this.subObjects = [];
        
        for(let i = 0; i < numSubObjects; i++) {
            this.subObjects.push(this.vwObjectInfo.subObjectInfo(typeControlCode, i));
        }
    }

    /**
     * @returns {string}
     */
    get id() {
        return this.vwObjectInfo.id();
    }

    /**
     * @returns {string}
     */
    get idRef() {
        return this.vwObjectInfo.idRef();
    }

    // Getters
    /**
     * 
     * @param {number} type
     * @returns {VObjectInfo} Reference: {@link https://doc.velneo.es/vobjectinfo.html|VObjectInfo}
     */
    getSubOjects(type) {
        const subObjects = this.subObjects.filter(subObject => subObject.propertyData(0) == type);
        const vwSubObjects = subObjects.map(subObject => new this.vwObjectInfo(subObject));
        return vwSubObjects;
    }
    /**
     * @type {VwObjectInfo}
     */
    get pictures(){
        return this.getSubOjects(0);
    }
    /**
     * @type {VwObjectInfo}
     */
    get staticTexts() {
        return this.getSubOjects(2);
    }

     /**
     * @type {VwObjectInfo}
     */
    get fieldNames() {
        return this.getSubOjects(3);
    }

     /**
     * @type {VwObjectInfo}
     */
    get textEdits() {
        return this.getSubOjects(4);
    }

     /**
     * @type {VwObjectInfo}
     */
    get buttons() {
        return this.getSubObjects(5);
    }

     /**
     * @type {VwObjectInfo}
     */
    get radios() {
        return this.getSubOjects(6);
    }

     /**
     * @type {VwObjectInfo}
     */
    get checkButtons() {
        return this.getSubOjects(7);
    }

     /**
     * @type {VwObjectInfo}
     */
    get numericEdits() {
        return this.getSubOjects(8);
    }

     /**
     * @type {VwObjectInfo}
     */
    get dateEdits() {
        return this.getSubOjects(9);
    }

     /**
     * @type {VwObjectInfo}
     */
    get splitters() {
        return this.getSubOjects(13);
    }

    /**
    * @type {VwObjectInfo}
    */   
    get comboBoxes() {
        return this.getSubOjects(14);
    }
}

/*


From velneo docs:


Dibujo = 0
Caja de grupo = 1
Texto estático = 2
Nombre de campo = 3
Edición alfabética = 4
Botón = 5
Botón de radio = 6
Botón de check = 7
Edición numérica = 8
Calendario = 9
Barra de progreso = 10
Deslizador = 11
Dial = 12
Separador de formularios = 13
ComboBox = 14
ListBox = 15
Vista de datos = 16
Caja de formularios = 17
Caja de texto = 18
Reservado = 19
Visor HTML = 20
Objeto dibujo = 21
Layout = 22
Espaciador = 23
Edición Fecha/Hora = 24
Edición Fecha = 25
Edición Hora = 26
Caja de texto enriquecido = 27
Pila de formularios = 28
Reloj = 29
Manómetro = 30
Termómetro = 31
Rueda = 32
Imagen Svg = 33
Botón Svg = 34
Interruptor Svg = 35
Switch Svg = 36
Reloj indicador Svg = 37
Menú arbolado = 38
Edición fórmula = 39
Edición senda de fichero = 40
Edición senda de directorio = 41
Splitter = 42
Data Catcher Edit = 43
Tree Widget = 44
Área de scroll = 45

*/