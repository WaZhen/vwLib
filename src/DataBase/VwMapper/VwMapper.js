import VwTable from "../VwTable/VwTable";
import VwRegister from "../VwRegister/VwRegister";

/**
 * @param {VTableInfo} VTableInfo {@link https://doc.velneo.es/vtableinfo.html|VTableInfo}
 */
const CONST_MAP_TYPE_MAP = 0;
const CONST_MAP_TYPE_ALL_STRING = 1;
export default class VwMapper {
    /**
     * Property: Object that contains the functions that return the value of the mapped field
     */
    mappedValues = {};
    static get MAP_TYPE_MAP() { return CONST_MAP_TYPE_MAP };
    static get MAP_TYPE_ALL_STRING() { return CONST_MAP_TYPE_ALL_STRING };

    constructor(velneoTableInfo, mapType = VwMapper.MAP_TYPE_MAP) {
        const idRefTable = velneoTableInfo.idRef();
        const vwTable = new VwTable(idRefTable);
        this.mappedValues = this.mapValues(vwTable);
        this.mapType = mapType;
    }

    // Private - no docs
    mapValues = (vwTable) => {
        const mappedValues = {};
        vwTable.vwFields.forEach((field) => {
            if(field.type === VTableInfo.FieldTypeBool) {
                mappedValues[field.id] = (velneoVregister) => {
                    return () => {
                        if(this.mapType === VwMapper.MAP_TYPE_MAP) {
                            return velneoVregister.fieldToBool(field.id);
                        } else {
                            return velneoVregister.fieldToString(field.id);
                        }
                    }
                }
            } else if(field.bindType == VTableInfo.BindTypeMaster) {
                mappedValues[field.id] = (velneoVregister) => {
                    const fieldId = field.id;
                    return () => {
                        const master = velneoVregister.readMaster(fieldId);
                        const mapper = new VwMapper(master.tableInfo(), this.mapType);
                        return new VwRegister(master, mapper);
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
                        return velneoVRegister.fieldToString(field.id);
                    }
                }
            } else if([VTableInfo.FieldTypeDateTime].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        return velneoVRegister.fieldToDateTime(field.id);
                    }
                }
            } else if([VTableInfo.FieldTypeDate].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        return velneoVRegister.fieldToDate(field.id);
                    }
                }
            } else if([VTableInfo.FieldTypeTime].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        return velneoVRegister.fieldToTime(field.id);
                    }
                }
            } else if([VTableInfo.FieldTypeNumeric].indexOf(field.type) != -1) {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        return velneoVRegister.fieldToDouble(field.id);
                    }
                }
            } else {
                mappedValues[field.id] = (velneoVRegister) => {
                    return () => {
                        return velneoVRegister.fieldToString(field.id);
                    }
                }
            }
        });

        return mappedValues;
    }
}