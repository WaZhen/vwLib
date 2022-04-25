/**
 * Mapeo de {@link https://doc.velneo.es/vobjectinfo.html|VObjectInfo}
 */
export default class VwObjectInfo {
    /**
     * @param {VObjectInfo} vWObjectInfo {@link https://doc.velneo.es/vobjectinfo.html|VObjectInfo}
     */
    constructor(vWObjectInfo) {
        this.vWObjectInfo = vWObjectInfo;
        const typeControlCode = 19;
        const numSubObjects = this.vWObjectInfo.subObjectCount(typeControlCode);
        this.subObjects = [];

        for (let i = 0; i < numSubObjects; i++) {
            this.subObjects.push(this.vWObjectInfo.subObjectInfo(typeControlCode, i));
        }
    }

    /**
     * Devuelve el id del objeto
     * @returns {string}
     */
    get id() {
        return this.vWObjectInfo.id();
    }

    /**
     * Devuelve el idRef del objeto
     * @returns {string}
     */
    get idRef() {
        return this.vWObjectInfo.idRef();
    }

    // Getters
    /**
     * Obtiene todos los subobjetos de un tipo
     * @param {number} type
     * @returns {VObjectInfo} {@link https://doc.velneo.es/vobjectinfo.html|VObjectInfo}
     */
    getSubOjects(type) {
        const subObjects = this.subObjects.filter(subObject => subObject.propertyData(0) == type);
        const vWSubObjects = subObjects.map(subObject => new this.vWObjectInfo(subObject));
        return vWSubObjects;
    }
    /**
     * Devuelve subobjetos de tipo dibujo
     * @type {VwObjectInfo}
     */
    get pictures() {
        return this.getSubOjects(0);
    }
    /**
     * Devuelve subobjetos de tipo texto estático
     * @type {VwObjectInfo}
     */
    get staticTexts() {
        return this.getSubOjects(2);
    }

    /**
     * Devuelve subobjetos de tipo nombre de campo
     * @type {VwObjectInfo}
     */
    get fieldNames() {
        return this.getSubOjects(3);
    }

    /**
     * Devuelve subobjetos de tipo edición de texto
     * @type {VwObjectInfo}
     */
    get textEdits() {
        return this.getSubOjects(4);
    }

    /**
     * Devuelve subobjetos de tipo botones
     * @type {VwObjectInfo}
     */
    get buttons() {
        return this.getSubObjects(5);
    }

    /**
     * Devuelve subobjetos de tipo botón de radio
     * @type {VwObjectInfo}
     */
    get radios() {
        return this.getSubOjects(6);
    }

    /**
     * Devuelve subobjetos de tipo botón de check
     * @type {VwObjectInfo}
     */
    get checkButtons() {
        return this.getSubOjects(7);
    }

    /**
     * Devuelve subobjetos de tipo edición numérica
     * @type {VwObjectInfo}
     */
    get numericEdits() {
        return this.getSubOjects(8);
    }

    /**
     * Devuelve subobjetos de tipo edición de fecha
     * @type {VwObjectInfo}
     */
    get dateEdits() {
        return this.getSubOjects(9);
    }

    /**
     * Devuelve subobjetos de tipo separador
     * @type {VwObjectInfo}
     */
    get splitters() {
        return this.getSubOjects(13);
    }

    /**
     * Devuelve subobjetos de tipo combo
     * @type {VwObjectInfo}
     */
    get comboBoxes() {
        return this.getSubOjects(14);
    }
}

/*
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