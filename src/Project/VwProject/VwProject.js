import VwForm from "../VwForm/VwForm";
import VwProjectUtils from "./VwProjectUtils";
/**
 * Class for manage velneo solutions
 */
export default class VwProject {
    /**
     * Creates an instance of VwProject
     * @param {VProjectInfo} vWProjectInfo {@link https://doc.velneo.es/vprojectinfo.html|VProjectInfo}
     */
    constructor(projectInfo=undefined) {
        if(projectInfo) {
            this.projectInfo = projectInfo;
        } else {
            this.projectInfo = theApp.mainProjectInfo();
        }
    }

    get name() {
        return this.projectInfo.name();
    }

    get type() {
        return this.projectInfo.type();
    }

    get alias() {
        return this.projectInfo.alias();
    }

    /**
     * @type {Array.<VwProject>}
     */
    getInheritedAppProjects() {
        // Returns an array of app projects
        return VwProject.getInheritedProjectList(this.projectInfo, 1);
    }

    /**
     * @type {Array.<VwProject>}
     */
    getInheritedDatProjects() {
        // Returns an array of dat projects
        return VwProject.getInheritedProjectList(this.projectInfo, 0)
    }

    /**
     * Array de object infos
     * @type {Array}
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
     * @return {Array.<VwForm>}
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