import VwTransaction from '../DataBase/VwTransactions/VwTransactions'

export default class VwErrorLog {
    static errorLog(json, type = "E") {
        let message;
        try {
            if (typeof json === 'object') {
                const objObs = JSON.parse(json.observaciones)
                message = `
                ----------- ERROR ----------------
        
                Fichero y función: ${json.nombre}
                Mensaje: ${objObs.message} 
                Línea: ${objObs.lineNumber}, 
                Id fichero: ${objObs.fileName}
        
                -----------------------------------
                `
            }
            if (typeof json === 'string') {
                message = json;
            }
        } catch (e) {
            if (typeof json === 'string') {
                message = json;
            } else {
                message = JSON.stringify(json, undefined, 2);
            }
        }

        VwTransaction.transaction("Create error log", () => {
            const log = new VRegister(theRoot);
            log.setTable("velneo_verp_2_dat/LOG_ERR");
            log.setField("MSG", message);
            log.setField("LOG_TIP", type);
            log.addRegister();
        });
    }
}