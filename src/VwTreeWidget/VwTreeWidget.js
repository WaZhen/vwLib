import inspector from 'schema-inspector'

export default class VwTreeWidget {
    constructor(componentName) {
        this.treeWidget = theRoot.dataView().control(componentName);
        this.iconColumn = 0;
    }

    populate(options) {
        this.validateOptions(options);
        this._generateHeader(options);
        this._generateRows(options);
    }

    validateOptions(options){
        const result = inspector.validate(this.validationSchema(), options);
        if(!result.valid) {
            if(theApp.isAdministrator()) {
                alert(result.format());
            }
        }
    }

    _generateHeader(options) {
        const headerOptions = options.header;
        headerOptions.columns.forEach((column, i) => {
            this.treeWidget.setHeaderLabel(column.name)
            if(!column.visible) {
                this.treeWidget.hideColumn(i);
            }
        });
        this.treeWidget.headerHidden = !headerOptions.visible
        this.iconColumn = headerOptions.iconColumn
    }

    _generateRows(options) {
        const rows = options.rows;
        rows.forEach((rowData) => {
            this._createRow(rowData, this.treeWidget);
        });
    }

    _createRow(rowData, parent) {
        const treeItem = this._appendRow(parent);
        this._configureTreeItem(treeItem, rowData);
    }

    _appendRow(parent) {
        let treeItem = undefined;
        if(parent.hasOwnProperty("addTopLevelItem")) {
            treeItem = parent.addTopLevelItem();
        } else if (parent.hasOwnProperty("addChild")){
            treeItem = parent.addChild();
        } else {
            throw new Error('Invalid parent to append row. ' + typeof parent);
        }
        return treeItem;
    }

    _configureTreeItem(treeItem, rowData) {
        importClass("VImage");
        const image = new VImage();
        image.loadResource(rowData.icon);
        treeItem.setIcon(this.iconColumn, image);
        rowData.columns.forEach((column, i) => {
            treeItem.setText(i, column)
        });
        if(Array.isArray(rowData.children)) {
            rowData.children.forEach((childRowData) => {
                this._createRow(childRowData, treeItem);
            })
        }
    }

    manageClick() {

    }

    validationSchema() {
        var rowSchema = {
            type: 'array',
            items: {
                type: 'object',
                strict: true,
                properties: {
                    columns: {
                        type: 'array',
                        items: {type: 'string'}
                    },
                    icon: {type: 'string'},
                    children: {
                        ...this,
                        optional: true
                    },
                }
            }
        }
        return {
            type: 'object',
            strict: true,
            properties: {
                header: {
                    type: 'object',
                    strict: true,
                    properties: {
                        columns: {
                            type: 'array',
                            items: {
                                type: 'object',
                                strict: true,
                                properties: {
                                    name: {
                                        type: 'string'
                                    },
                                    visible: {
                                        type: 'boolean'
                                    },
                                },
                            },
                        },
                        iconColumn: {
                            type: 'integer'
                        },
                        visible: {type: 'boolean'}
                    },
                },
                rows: rowSchema,
            }
        }
    }
}


