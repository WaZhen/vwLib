class RegisterModificationsLogger {
    constructor() {
        const fields = this.getFields();
        const log = this.generateLog(fields);
        alert(JSON.stringify(log));
    }

    getFields = () => {
        const tableInfo = theRegisterIn.tableInfo();
        const fieldNumber = tableInfo.fieldCount();
        const fields = [];

        for(let i = 0; i < fieldNumber; i++) {
            const fieldId = tableInfo.fieldId(i);
            fields.push(fieldId);
        }

        return fields;
    }

    generateLog = (fields) => {
        const log = {};

        fields.forEach((fieldId) => {
            const oldValue = theRegisterIn.oldFieldToString(fieldId);
            const currenValue = theRegisterIn.fieldToString(fieldId);
            
            if(oldValue != currenValue) {
                log[fieldId] = {
                    oldValue,
                    currenValue
                }
            }
        });

        return log;
    }
}

const registerModificationsLogger = new RegisterModificationsLogger();