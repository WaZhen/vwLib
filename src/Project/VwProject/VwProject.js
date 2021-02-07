import VWForm from "../VWForm/VWForm";
import VwProjectUtils from "./VwProjectUtils";
const projectNames = ['velneo_verp_2_dat', 'velneo_verp_2_app', 'VWSat_app', 'VWRPV_app'];
/**
 * Class for manage velneo solutions
 */
export default class VwProject {
    /**
     * Creates an instance of VWProject
     * @param {VProjectInfo} vWProjectInfo {@link https://doc.velneo.es/vprojectinfo.html|VProjectInfo}
     */
    constructor(vWProjectInfo) {
        this.projectInfo = vWProjectInfo;
    }

    /**
     * Returns the names of the projects
     * @type {string[]}
     */
    static get projectNames() {
        return projectNames
    }

    /**
     * @type {Array.<VwProject>}
     */
    static get projects() {
        // Returns an array of projects
        const projects = [];

        VwProject.projectNames.forEach((projectName) => {
            const vWProjectInfo = new VwProject(theApp.projectInfo(projectName));
            projects.push(vWProjectInfo);
        });

        return projects;
    }

    /**
     * @type {Array.<VwProject>}
     */
    static get appProjects() {
        // Returns an array of app projects
        const projects = VwProject.projects.filter(project => project.projectInfo.type() == 1);

        return projects;
    }
    /**
     * @type {Array.<VwProject>}
     */
    static get datProjects() {
        // Returns an array of dat projects
        const projects = VwProject.projects.filter(project => project.projectInfo.type() == 0);
    }
    /**
     * Array de object infos
     * @type {Array}
     */
    get tables() {
        // Returns an array of tableInfo
        if (this.projectInfo.type() != 0) {
            throw new Error('VWProject.getTables needs a dat type project as argument');
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
     * @return {Array.<VWForm>}
     */
    get forms() {
        // Return an array of vObjectInfo of forms
        if (this.projectInfo.type() != 1) {
            throw new Error('VWProject.forms needs a app type project as argument');
        }

        const forms = [];
        const typeFormCode = 18;
        const numObjects = this.projectInfo.objectCount(typeFormCode);

        for (let i = 0; i < numObjects; i++) {
            const form = new VWForm(this.projectInfo.objectInfo(typeFormCode, i));
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

    static getProjectObjects(projectArg, objectType) {
        let project;
        if(typeof projectArg == "string") {
            project = theApp.projectInfo(projectArg)
        } else if (projectArg instanceof VProjectInfo){
            project = projectArg;
        } else {
            throw new Error("Invalid projectArg");
        }
        var objectList = [];
        var objectCount = project.allObjectCount(objectType);

        for(var i=0; i<objectCount; i++) {
            var objectInfo = project.objectInfo(objectType, i)
            objectList.push(objectInfo);
        }

        return objectList;
    }
}