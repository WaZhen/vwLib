import VwTable from "../VwTable/VwTable";
import VwRegister from "../VwRegister/VwRegister";

const CONST_MAP_TYPE_MAP = 0;
const CONST_MAP_TYPE_ALL_STRING = 1;

/**
 * <p>Clase que mapea todos los campos de una tabla creando una función que devuelve su valor</p>
 * <p>Gestiona automáticamente el tipo de valor: numérico, alfabético, fecha, enlace maestro, etc...</p>
 * @param {VTableInfo} VTableInfo {@link https://doc.velneo.es/vtableinfo.html|VTableInfo}
 * @param {int} [mapType=VwMapper.MAP_TYPE_MAP] Por defecto gestiona el tipo de valor. Pasar VwMapper.MAP_TYPE_ALL_STRING para que todos los campos se resuelvan como fieldToSTring
 */
export default class VwMapper {
    mappedValues = {};

    /**
     * Enum = 0: gestiona el tipo de retorno
     */
    static get MAP_TYPE_MAP() {
        return CONST_MAP_TYPE_MAP
    };

    /**
     * Enum = 1: no gestiona tipo de retorno. Intenta hacer fieldToString al resolver un campo
     */
    static get MAP_TYPE_ALL_STRING() {
        return CONST_MAP_TYPE_ALL_STRING
    };

    constructor(velneoTableInfo, mapType = VwMapper.MAP_TYPE_MAP) {
        const idRefTable = velneoTableInfo.idRef();
        const vWTable = new VwTable(idRefTable);
        this.mappedValues = this.mapValues(vWTable);
        this.mapType = mapType;
    }

    // Private - no docs
    mapValues = (vWTable) => {
        const mappedValues = {};
        vWTable.vWFields.forEach((field) => {
            if (field.type === VTableInfo.FieldTypeBool) {
                mappedValues[field.id] = (velneoVregister) => {
                    return () => {
                        if (this.mapType === VwMapper.MAP_TYPE_MAP) {
                            try {
                                return velneoVregister.fieldToBool(field.id);
                            } catch (e) {
                                return null
                            }
                        } else {
                            try {
                                return velneoVregister.fieldToString(field.id);
                            } catch (e) {
                                return null
                            }
                        }
                    }
                }
            } else if (
                field.bindType == VTableInfo.BindTypeMaster ||
                field.bindType == VTableInfo.BindTypeIndirectReal ||
                field.bindType == VTableInfo.BindTypeIndirectVirtual ||
                field.bindType == VTableInfo.BindTypeSingularPluralPos ||
                field.bindType == VTableInfo.BindTypeSingularPluralIndex ||
                field.bindType == VTableInfo.BindTypeAdjacentSibling ||
                field.bindType == VTableInfo.BindTypeMasterExt 
            ) {
                mappedValues[field.id] = (velneoVregister) => {
                    const fieldId = field.id;
                    return () => {
                        try {
                            const master = new VRegister(theRoot);
                            master.copyFrom(velneoVregister.readMaster(fieldId));
                            const mapper = new VwMapper(master.tableInfo(), this.mapType);
                            return new VwRegister(master, mapper);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            } else if ([
                    VTableInfo.FieldTypeAlpha256,
                    VTableInfo.FieldTypeAlpha128,
                    VTableInfo.FieldTypeAlpha64,
                    VTableInfo.FieldTypeAlpha40,
                    VTableInfo.FieldTypeAlphaLatin1,
                    VTableInfo.FieldTypeAlphaUtf16,
                ].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        try {
                            return velneoVRegister.fieldToString(field.id);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            } else if ([VTableInfo.FieldTypeDateTime].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        try {
                            return velneoVRegister.fieldToDateTime(field.id);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            } else if ([VTableInfo.FieldTypeDate].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        try {
                            return velneoVRegister.fieldToDate(field.id);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            } else if ([VTableInfo.FieldTypeTime].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        try {
                            return velneoVRegister.fieldToTime(field.id);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            } else if ([VTableInfo.FieldTypeNumeric].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        try {
                            return velneoVRegister.fieldToDouble(field.id);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            } else {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        try {
                            return velneoVRegister.fieldToString(field.id);
                        } catch (e) {
                            return null;
                        }
                    }
                }
            }
        });

        return mappedValues;
    }
}