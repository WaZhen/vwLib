import VwRegister from '../../DataBase/VwRegister/VwRegister';
import VwMapper from '../../DataBase/VwMapper/VwMapper';
/**
 * Class for managing Catcher edits
 */
export default class VwCatcherEdit {
    /**
     * @static Method to set the list of a catcher edit and set the selected value
     * @param {object} object {idCatcherEdit, RegisterList, registerTable, registerIndex, resolvers}
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