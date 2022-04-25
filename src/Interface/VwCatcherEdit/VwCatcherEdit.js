import VwRegister from '../../DataBase/VwRegister/VwRegister';
import VwMapper from '../../DataBase/VwMapper/VwMapper';

/**
 * @hideconstructor
 * @classdesc
 * Utilidades para catcher edit para utilizar en manejadores de evento
 */
export default class VwCatcherEdit {

    /**
     * @typedef dataOptions
     * @property {string} idCatcherEdit id del control de tipo catcher edit
     * @property {object} vRegisterList {@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vregisterlist} 
     * que va a alimentar el catcher edit
     * @property {string} registerTable idRef del registro seleccionado inicial
     * @property {string} registerIndex indice por el que localizar el registro
     * @property {any[]} resolvers partes de resolución del índice para el registro seleccionado inicial
     */

    /**
     * Establece los valores del catcher edit y selecciona el valor inicial
     * @param {dataOptions} dataOptions {idCatcherEdit, RegisterList, registerTable, registerIndex, resolvers}
     * @return {undefined} undefined 
     */
    static setData({
        idCatcherEdit,
        registerList,
        registerTable,
        registerIndex,
        resolvers
    }) {
        const formulario = theRoot.dataView();
        const catcherEdit = formulario.control(idCatcherEdit);
        catcherEdit.setRegisterList(registerList);
        const selectedRegister = VwRegister.getRegister(registerTable, registerIndex, resolvers);
        if (selectedRegister) {
            catcherEdit.setRegister(selectedRegister.vRegister);
        } else {
            catcherEdit.setRegister(registerList.readAt(0))
        }
    }

    /**
     * @static
     * @param {string} catcherEditId The id of the catcher edit 
     * @return {VRegister} VRegister {@link https://doc.velneo.es/vregister.html|VRegister}
     */
    static getRegister(catcherEditId) {

        if (typeof catcherEditId !== 'string') {
            throw new Error('First parameter of VwCatcherEdit.getRegister must be a string');
        }

        const form = theRoot.dataView();
        const catcherEdit = form.control(catcherEditId);
        const register = new VRegister(theRoot);
        catcherEdit.getRegister(register);
        const tableInfo = register.tableInfo();
        const mapper = new VwMapper(tableInfo);
        const vWRegister = new VwRegister(register, mapper);
        return vWRegister;
    }
}