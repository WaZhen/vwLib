import VWList from '../DataBase/VWList/VWList';
import VWRegister from '../DataBase/VWRegister/VWRegister';
import VWObjects from '../ObjectsAPI/VWObjects/VWObjects';

export default class RegisterCreatorFromProcess {
    constructor() {
        this.projects = [
            'velneo_verp_2_dat',
            'velneo_verp_2_app',
        ];
        this.requiredKeys = [];
    }

    runStart(keyword, tableIdRef) {
        this.projects.forEach(project => {
            const processesIds = this.getKeywordProcesses(project, keyword);
            if (processesIds) {
                this.createProcessesRegisters(project, processesIds, tableIdRef);
                this.removeRegisterNoProcess({
                    project,
                    processesIds,
                    tableIdRef
                });
            }
        });
    }

    getKeywordProcesses(projectName, idKeyWord) {
        const project = theApp.projectInfo(projectName);
        const processNumber = project.allObjectCount(VObjectInfo.TypeProcess);
        const processesNames = [];
        for (let i = 0; i < processNumber; i++) {
            const processObj = project.objectInfo(VObjectInfo.TypeProcess, i);
            const processId = processObj.id();
            if (processId.substr(0, idKeyWord.length + 1) == idKeyWord + '_') {
                processesNames.push(processId);
            }
        }
        return processesNames;
    }

    createProcessesRegisters(project, processes, tableIdRef) {
        processes.forEach((processId) => {
            const processInfo = VWObjects.getProcessObjectInfo(project, processId);
            const processName = processInfo.name();
            const processComment = processInfo.comments();
            const processData = this.processDataFromComment(processComment);
            this.createProcessRegister(project, processId, processName, processData, tableIdRef)
        })
    }

    getOrCreateRegister({
        project,
        objId,
        processName,
        processData,
        tableIdRef,
        other = {}
    }) {
        const register = VWRegister.getRegister(tableIdRef, 'PRY', [project, objId]);
        const keys = Object.keys(processData);
        this.requiredKeys.forEach(requiredKey => {
            if (keys.indexOf(requiredKey) == -1) {
                alert(`Register creation process, missing key ${requiredKey} in ${project}/${objId} comments`)
            }
        })
        if (register) {
            return this.modifyExistingRegisterIfDifferent({
                register,
                processName,
                processData
            });
        } else {
            return this.createNewRegister({
                tableIdRef,
                processName,
                project,
                objId,
                processData,
                other
            });
        }
    }

    createNewRegister({
        tableIdRef,
        processName,
        project,
        objId,
        processData,
        other
    }) {
        return VWRegister.createRegister(tableIdRef, {
            NAME: processName,
            PRY: project,
            OBJ_ID: objId,
            ...other,
            ...processData,
        });
    }

    modifyExistingRegisterIfDifferent({
        register,
        processName,
        processData
    }) {
        let changes = false;

        if (register.NAME() != processName) {
            changes = true;
        }

        if (processData) {
            for (key in processData) {
                const value = processData[key];
                if (register[key]() != value) {
                    changes = true;
                }
            }
        }

        if (changes) {
            this.modifyExistingRegister({
                register,
                processName,
                processData
            });
        }
        return register
    }

    modifyExistingRegister({
        register,
        processName,
        processData
    }) {
        register.modifyRegister({
            NAME: processName,
            ...processData
        });
    }

    createProcessRegister(project, testProcessId, processName, processData, tableIdRef) {
        throw new Error('createProcessRegiter not overriden');
    }

    processDataFromComment(processComment) {
        const processData = {};
        const pairs = processComment.split('\n');
        pairs.forEach((pair) => {
            if (pair.trim().length > 0 && pair.indexOf(":") != -1) {
                const key = pair.split(':')[0];
                const value = pair.split(':')[1];
                processData[key] = value;
            }
        });
        return processData;
    };

    removeRegisterNoProcess({
        project,
        processesIds,
        tableIdRef
    }) {

        registerList = VWList.search(tableIdRef, 'PRY', [project]);
        const registersToRemove = registerList.filter((register) => {
            try {
                return processesIds.indexOf(register.OBJ_ID()) == -1;
            } catch (e) {
                return false;
            }
        });

        if (registersToRemove.length > 0) {
            registersToRemove.forEach((register) => {
                register.deleteRegister(true);
            });
            theApp.regenDataArea(tableIdRef, false);
        }
    }
}