/**
 * @classdesc
 * Utilidades para {@link https://doc.velneo.es/vprojectinfo.html|VProjectInfo}
 * @hideconstructor
 */
export default class VwObjects {
    /**
     * Obtiene los procesos de un proyecto
     * @param {string} projectAlias alias del proyecto
     * @returns {string[]} Array con los idRef de los procesos
     * @method
     */
    static getProcessArray = (projectAlias) => {
        const projectInfo = theApp.projectInfo(projectAlias)
        const processQuantity = projectInfo.objectCount(VObjectInfo.TypeProcess);
        const processArray = [];

        for (let i = 0; i < processQuantity; i++) {
            const processInfo = projectInfo.objectInfo(VObjectInfo.TypeProcess, i);
            processArray.push(processInfo.idRef());
        }
        return processArray;
    }

    /**
     * Obtiene la [VTableInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vtableinfo} del registro de origen de un proceso origen ficha
     * @param {string} projectAlias alias proyecto
     * @param {string} processId idProceso
     * @returns {object} [VTableInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vtableinfo}
     */
    static getProcessRegisterInTableInfo(projectAlias, processId) {
        const proyectInfo = theApp.projectInfo(projectAlias);
        const process = proyectInfo.objectInfo(VObjectInfo.TypeProcess, processId);
        const tableInfo = process.inputTable();
        return tableInfo;
    }

    /**
     * Devuelve el [VObjectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vobjectinfo} de un proceso
     * @param {string} projectAlias Alias del proyecto
     * @param {*} processId idProceso
     * @returns {object} [VObjectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vobjectinfo}
     */
    static getProcessObjectInfo(projectAlias, processId) {
        const proyectInfo = theApp.projectInfo(projectAlias);
        const processInfo = proyectInfo.objectInfo(VObjectInfo.TypeProcess, processId);
        return processInfo
    }

    /**
     * Duevuelve un array de VObjectInfo de procesos de un proyecto
     * @param {string} projectAlias Alias del proyecto
     * @returns {object[]} Devuelve un array de [VObjectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vobjectinfo}
     */
    static getProcessObjectInfoArray(projectAlias) {
        const processIdRefArray = VwObjects.getProcessArray(projectAlias);
        return processIdRefArray.map((processIdRef) => {
            return VwObjects.getProcessObjectInfo(projectAlias, processIdRef.split('/')[1]);
        })
    }
}