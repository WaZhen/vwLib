import VwForm from "../VwForm/VwForm";
const projectNames = ['velneo_verp_2_dat', 'velneo_verp_2_app', 'VwSat_app', 'VwRPV_app'];
/**
 * Class for manage velneo solutions
 */
export default class VwProject {
    /**
     * Creates an instance of VwProject
     * @param {VProjectInfo} vwProjectInfo {@link https://doc.velneo.es/vprojectinfo.html|VProjectInfo}
     */
    constructor(vwProjectInfo) {
        this.projectInfo = vwProjectInfo;
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
            const vwProjectInfo = new VwProject(theApp.projectInfo(projectName));
            projects.push(vwProjectInfo);
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
        if(this.projectInfo.type() != 0) {
            throw new Error('VwProject.getTables needs a dat type project as argument');
        }

        const tables = [];
        const numTables = this.tableCount();
        
        for (let i = 0; i < numTables; i++) {
            const vwTableInfo = this.tableInfo(i);
            tables.push(vwTableInfo);
        }

        return tables;
    }

    /**
     * @return {Array.<VwForm>}
     */
    get forms() {
        // Return an array of vObjectInfo of forms
        if(this.projectInfo.type() != 1) {
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
}