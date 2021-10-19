/**
 * Class for use VProjectInfo methods {@link https://doc.velneo.es/vprojectinfo.html|VProjectInfo}
 */
export default class VwObjects {
    static getProcessArray = (projectAlias) => {
        const projectInfo = theApp.projectInfo(projectAlias)
        const processQuantity = projectInfo.objectCount(VObjectInfo.TypeProcess)
        const processArray = [];

        for (let i = 0; i < processQuantity; i++) {
            const processInfo = projectInfo.objectInfo(VObjectInfo.TypeProcess, i);
            processArray.push(processInfo.idRef());
        }

        return processArray;
    }

    static getProcessRegisterInTableInfo(projectName, processId) {
        const proyectInfo = theApp.projectInfo(projectName);
        const process = proyectInfo.objectInfo(VObjectInfo.TypeProcess, processId);
        const tableInfo = process.inputTable();
        return tableInfo;
    }

    static getProcessObjectInfo(projectAlias, processId) {
        const proyectInfo = theApp.projectInfo(projectAlias);
        const processInfo = proyectInfo.objectInfo(VObjectInfo.TypeProcess, processId);
        return processInfo
    }
}