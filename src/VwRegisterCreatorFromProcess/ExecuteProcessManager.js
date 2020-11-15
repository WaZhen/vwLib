const LOG = 'LOG';

export default class ExecuteProcessManager {
    constructor({objFieldId, proyectFieldId}) {
        try {
            this.processIdRef = theRoot.objectInfo().idRef();
            this.OBJ_ID_FIELD_ID = objFieldId;
            this.PROYECT_FIELD_ID = proyectFieldId;
            this.requiredVariables = ['LOG'];
        } catch(e) {
            // Error
            this.LOG = JSON.stringify(e);
            alert(JSON.stringify(e));
        }
    }

    execute = ({registerInIdRef = null}) => {
        // to allow overriden methods
        this.checkRegisterIn({registerInIdRef});
        this.runProcess();
    }

    checkRegisterIn ({registerInIdRef}) {
        if(registerInIdRef) {
            if(!theRegisterIn) {
                this.processDefinitionError({error: `The process ${this.processIdRef} expects ${registerInIdRef}, but not registerIn found`});
            }
    
            const tableInfo = theRegisterIn.tableInfo();
            const idRef = tableInfo.idRef();
    
            if(idRef !== registerInIdRef) {
                this.processDefinitionError({error: `The process ${this.processIdRef} expects . Instead ${idRef} provided`});
            }
        }
    }

    processDefinitionError ({error}) {
        // to be extended
        this.LOG = error;
        throw new Error(error);
    }

    runProcess() {
        importClass("VProcess");
        const processIdRef = this.getProcessIdRef();
        const processObject = new VProcess(theRoot);
        processObject.setProcess(processIdRef);
        processObject.setRegisterIn(theRegisterIn);
        const valid = this.checkProcessVariables(processObject);

        if(valid) {
            processObject.exec(VProcess.RunInServer);
            this.requiredVariables.forEach((requiredVariable) => {
                theRoot.setVar(requiredVariable, processObject.varToString(requiredVariable));
            })
        }
    }

    getProcessIdRef () {
        return theRegisterIn.fieldToString('OBJ_ID_REF');
    }

    checkProcessVariables(processObject) {
        const objectInfo = processObject.objectInfo();
        const typeVariable = 9
        const numVariables = objectInfo.subObjectCount(typeVariable);
        const variablesArray = [];

        for(let i = 0; i < numVariables; i++) {
            const variableInfo = objectInfo.subObjectInfo(typeVariable, i);
            const variableId = variableInfo.id();
            variablesArray.push(variableId);
        }

        let error = '';
        this.requiredVariables.forEach((requiredVariable) => {
            if(variablesArray.indexOf(requiredVariable) == -1) {
                error = error + `Process to execute: ${this.processIdRef} should have a variable with id ${requiredVariable}\n`
            }
        });

        if(error.length > 0) {
            this.processDefinitionError({error});
        } else {
            return true;
        }
    }

    get LOG() {
        return theRoot.varToString(LOG);
    }

    set LOG(value) {
        theRoot.setVar(LOG, value);
    }
}