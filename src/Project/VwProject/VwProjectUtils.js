export default class VwProjectUtils {
    static checkExistingProject(projectList, project) {
        for(var i=0; i<projectList.length; i++) {
            var prj = projectList[i];
            if(project.id() == prj.id()) {
                return true;
            }
        };
        return false;
    }
}