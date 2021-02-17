export default class VwTableInfo {
    constructor(vRegisterOrTableInfo) {
        if(vRegisterOrTableInfo instanceof VRegister) {
            this.tableInfo = vRegister.tableInfo();
        } else if(vRegisterOrTableInfo instanceof VTableInfo) {
            this.tableInfo = vRegisterOrTableInfo;
        } else {
            throw new Error(`Parameter is not an VRegister or VTableInfo`);
        }
    }

    getFieldIndexById(fieldId) {
        const fieldsCount = this.tableInfo.fieldCount();

        for(let i = 0; i < fieldsCount; i++) {
            const currentFieldId = this.tableInfo.fieldId(i);
            if(currentFieldId == fieldId) {
                return i;
            }
        }
    }

    getBoundedTableInfo(masterId) {
        const index = this.getFieldIndexById(masterId);
        const bindType = this.tableInfo.fieldBindType(index);

        if(bindType == 0) {
            throw new Error(`${masterId} is not a bind type field`);
        } else {
            const info = this.tableInfo.fieldBoundedTableInfo(index);
            return new VwTableInfo(info);
        }
    }
}