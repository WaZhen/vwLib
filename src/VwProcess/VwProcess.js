export default class VwProcess {
    static checkProcessVariables(processObject, variableList=[]) {
        if(!Array.isArray(variableList)) {
            throw new Error('variableList must be an array');
        }

        if(variableList.length == 0) {
            throw new Error('Check process variables requires a variable list with at least 1 element');
        }
        const objectInfo = processObject.objectInfo();
        const processIdRef = objectInfo.idRef()
        const typeVariable = 9
        const numVariables = objectInfo.subObjectCount(typeVariable);
        const variablesArray = [];

        for(let i = 0; i < numVariables; i++) {
            const variableInfo = objectInfo.subObjectInfo(typeVariable, i);
            const variableId = variableInfo.id();
            variablesArray.push(variableId);
        }

        let error = '';
        variableList.forEach((requiredVariable) => {
            if(variablesArray.indexOf(requiredVariable) == -1) {
                error = error + `Process to execute: ${processIdRef} should have a variable with id ${requiredVariable}\n`
            }
        });

        if(error.length > 0) {
            throw new Error(error)
        } else {
            return true;
        }
    }

    static call(processIdRef, variableList, executeLayer=VProcess.RunInServer) {
        importClass("VProcess");
        const process = new VProcess(theRoot);
        process.setProcess(processIdRef);

        for(key in variableList) {
            const value = variableList[key];
            process.setVar(key, value);
        }

        if(process.exec()) {
            return process.result();
        } else {
            throw new Error("Process call execution error");
        }
    }
}