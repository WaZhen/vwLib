export default class AppConfiguration {
    static getAppConfigurationRegister() {
        const appConfList = new VRegisterList(theRoot);
        appConfList.setTable('velneo_verp_2_dat/APP_CFG_W');
        appConfList.load('ID', []);
        const appConf = appConfList.readAt(0);
        return appConf;
    }

    static getAppConfigurationEndPoint(endPointId) {
        const appConf = AppConfiguration.getAppConfigurationRegister();
        const appConfTableInfo = appConf.tableInfo();
        const fieldNumber =  appConfTableInfo.findField(endPointId);
        const fieldType = appConfTableInfo.fieldType(fieldNumber);

        if(fieldType !== VTableInfo.FieldTypeFormulaAlfa) {
            throw new Error(`Formula ${endPointId} not found in app configuration`);
        }

        return appConf.fieldToString(endPointId);
    }

    static getAppConfigurationStrField(fieldId) {
        const appConf = AppConfiguration.getAppConfigurationRegister();
        const appConfTableInfo = appConf.tableInfo();
        const fieldNumber =  appConfTableInfo.findField(fieldId);
        const fieldType = appConfTableInfo.fieldType(fieldNumber);

        if(fieldType !== VTableInfo.FieldTypeAlpha256) {
            throw new Error(`Alpha field ${fieldId} not found in app configuration`);
        }

        return appConf.fieldToString(fieldId);
    }
}