import VwForm from "../VwForm/VwForm";
import VwProjectUtils from "./VwProjectUtils";
/**
 * Herramientas para gestionar los proyectos de una solución
 * @param {VProjectInfo} [vWProjectInfo=theApp.mainProjectInfo()] {@link https://doc.velneo.es/vprojectinfo.html|VProjectInfo}
 */
export default class VwProject {
    constructor(projectInfo=undefined) {
        if(projectInfo) {
            /**
             * Contiene el [vProjectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vprojectinfo} pasado en el constructor
             * @type {object}
             */
            this.projectInfo = projectInfo;
        } else {
            this.projectInfo = theApp.mainProjectInfo();
        }
    }

    /**
     * Nombre del proyecto
     * @type {string}
     */
    get name() {
        return this.projectInfo.name();
    }

    /**
     * Tipo de proyecto. [Valores]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vprojectinfo#enumeraciones}
     * @type {int}
     */
    get type() {
        return this.projectInfo.type();
    }

    /**
     * Alias del proyecto
     * @type {string}
     */
    get alias() {
        return this.projectInfo.alias();
    }

    /**
     * Devuelve un array de {@link VwProject} de tipo aplicación
     * @returns {VwProject[]}
     * 
     */
    getInheritedAppProjects() {
        // Returns an array of app projects
        return VwProject.getInheritedProjectList(this.projectInfo, 1);
    }

    /**
     * Devuelve un array de {@link VwProject} de tipo datos
     * @returns {VwProject[]}
     */
    getInheritedDatProjects() {
        // Returns an array of dat projects
        return VwProject.getInheritedProjectList(this.projectInfo, 0)
    }

    /**
     * Array de [VObjectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vobjectinfo} de las tablas
     * @type {Object[]} 
     */
    get tables() {
        // Returns an array of tableInfo
        if (this.projectInfo.type() != 0) {
            throw new Error('VwProject.getTables needs a dat type project as argument');
        }

        const tables = [];
        const numTables = this.tableCount();

        for (let i = 0; i < numTables; i++) {
            const vWTableInfo = this.tableInfo(i);
            tables.push(vWTableInfo);
        }

        return tables;
    }

    /**
     * Devuelve los formularios del proyecto
     * @type {VwForm[]}
     */
    get forms() {
        // Return an array of vObjectInfo of forms
        if (this.projectInfo.type() != 1) {
            throw new Error('VwProject.forms needs a app type project as argument');
        }

        const forms = [];
        const typeFormCode = 18;
        const numObjects = this.projectInfo.objectCount(typeFormCode);

        for (let i = 0; i < numObjects; i++) {
            const form = new VwForm(this.projectInfo.objectInfo(typeFormCode, i));
            forms.push(form);
        }
        return forms;
    }

    /**
     * Devuelve los proyectos heredados
     * @param {*} startingProject Proyecto del que se quieren obtener herencias
     * @param {*} [projectType=undefined] Tipo de proyecto
     * @param {*} [foundProjects=[]] Resultados previos para llamadas recursivas del propio método. Se recomienda no inicializar
     * @returns 
     */
    static getInheritedProjectList(startingProject, projectType=undefined, foundProjects=[]) {
        const projects = [];
        const found = foundProjects;

        if(projectType == undefined || projectType == startingProject.type()) {
            if(!VwProjectUtils.checkExistingProject(found, startingProject)) {
                projects.push(startingProject);
                found.push(startingProject);
            }
        }

        for (var i=0; i<startingProject.legacyProjectCount(); i++) {
            var project = startingProject.legacyProjectInfo(i);
            if(!projectType == undefined || projectType == project.type()) {
                if(!VwProjectUtils.checkExistingProject(found, project)) {
                    projects.push(project);
                    found.push(project);
                }

                if(project.legacyProjectCount() > 0) {
                    projects.push(...VwProject.getInheritedProjectList(project, projectType, found));
                }
            } else {
                if(project.legacyProjectCount() > 0) {
                    projects.push(...VwProject.getInheritedProjectList(project, projectType, found));
                }
            }
        }
        return projects;
    }

    /**
     * Obtiene los vObjectInfo del tipo especificado del proyecto
     * @param {object} project [VProyectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vprojectinfo}
     * @param {int} objectType [Enumeración]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vobjectinfo/vobjectinfo-enumeraciones#tipos-de-objetos}
     * @returns {object[]} Array de [VObjectInfo]{@link https://doc.velneo.com/velneo-vdevelop/scripts/lenguajes/javascript/clases/vobjectinfo}
     */
    getProjectObjects(project, objectType) {
        var objectList = [];
        var objectCount = project.allObjectCount(objectType);

        for(var i=0; i<objectCount; i++) {
            var objectInfo = project.objectInfo(objectType, i)
            objectList.push(objectInfo);
        }

        return objectList;
    }
}