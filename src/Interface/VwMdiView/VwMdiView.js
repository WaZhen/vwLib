export default class VwMdiView{
    constructor(view) {
        this.view = view;
        this.root = view.root();
    }

    get tableIdRef() {
        const register = this.registerIn;
        if(!register) {
            return "";
        }
        const idRef = register.tableInfo().idRef();

        if(!!idRef) {
            return idRef;
        } else {
            return "";
        }
    }

    get formIdRef() {
        const form = this.viewForm;
        var formInfo = form.objectInfo();
        const idRef = formInfo.idRef();
        if(!!idRef) {
            return idRef;
        } else {
            return "";
        }
    }

    get tableId() {
        const idRef = this.tableIdRef;
        if(idRef.indexOf("/") != -1) {
            return idRef.split("/")[1];
        } else {
            return "";
        }
    }

    get tableProject() {
        const idRef = this.tableIdRef;
        if(idRef.indexOf("/") != -1) {
            return idRef.split("/")[0];
        } else {
            return "";
        }
    }

    get tableName() {
        const register = this.registerIn;
        const info = register.tableInfo();
        let name = info.singleName(theApp.currentLanguageCode(), theApp.currentCountryCode());
        if(!name) {
            name = info.singleName(theApp.currentLanguageCode());
        }
        return name;
    }

    get viewForm() {
        return this.root.dataView();
    }
    
    get formProject() {
        const idRef = this.formIdRef;
        if(idRef.indexOf("/") != -1) {
            return idRef.split("/")[0];
        } else {
            return "";
        }
    }
    
    get formId() {
        const idRef = this.formIdRef;
        if(idRef.indexOf("/") != -1) {
            return idRef.split("/")[1];
        } else {
            return "";
        }
    }

    get registerId() {
        const viewRegister = this.registerIn;
        if(viewRegister) {
            return viewRegister.fieldToString("ID");
        } else {
            return null;
        }
    }

    get registerIn() {
        const form = this.viewForm;
        const formRegister = new VRegister(theRoot);
        const hasRegisterOrigin = form.getRegister(formRegister);
        if(hasRegisterOrigin) {
            return formRegister
        } else {
            return null;
        }
    }

    type() {
        return this.view.type();
    }

    saveRegister() {
        this.root.dataView().saveRegister();
    }
}