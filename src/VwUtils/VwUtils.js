export default class VwUtils {
    /**
     * 
     * @param {boolean} log 
     * @param {Error} error 
     */
    static manageError({log=false, error, message='', onlyAdmin=true}) {
        if(log) {
            // to do
        } else {
            if(onlyAdmin && !theApp.isAdministrator()) {
                return;
            }
            alert(message + '\n\nLine number: ' + error.lineNumber + "\n\n" + error.message);
        }
    }

    static appendLog(logVariableId, textToAppend, color="black") {
        const variableExists = Utils.variableExists(theRoot.objectInfo(), logVariableId);
        if(variableExists) {
            const previousLog = theRoot.varToString(logVariableId);
            if(previousLog) {
                theRoot.setVar(logVariableId, `${previousLog}\n\n<span style="color:${color}">${textToAppend}</span>`);
            } else {
                theRoot.setVar(logVariableId, textToAppend);
            }
        }
    }

    static prependLog(logVariableId, textToAppend, color="black") {
        const variableExists = Utils.variableExists(theRoot.objectInfo(), logVariableId);
        if(variableExists) {
            const previousLog = theRoot.varToString(logVariableId);
            if(previousLog) {
                theRoot.setVar(logVariableId, `<span style="color:${color}">${textToAppend}</span>\n\n${previousLog}`);
            } else {
                theRoot.setVar(logVariableId, textToAppend);
            }
        }
    }

    static variableExists(objectInfo, variableId) {
        if(objectInfo.toString().indexOf('VCInfo') == -1) {
            throw new Error('Parameter is not a VObjectInfo');
        }
        const numVariables = objectInfo.subObjectCount(VObjectInfo.TypeVariable);
        let exists = false;

        for(let i = 0; i < numVariables; i++) {
            const variableInfo = objectInfo.subObjectInfo(VObjectInfo.TypeVariable, i);
            if(variableInfo.id() == variableId) {
                exists = true;
            }
        }

        return exists;
    }
}