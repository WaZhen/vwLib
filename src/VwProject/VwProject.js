export default class VwProject {
    static getInheritedProjectList(projectType=null) {
        const projects = [];
        const currentProyect = theApp.mainProjectInfo();

        if(!projectType || projectType == currentProyect.type()) {
            projects.push(currentProyect)
        }
        
        for (var i=1; i<currentProyect.legacyProjectCount(); i++) {
            var project = currentProyect.legacyProjectInfo(i);
            if(!projectType || projectType == project.type()) {
                projects.push(project)
            }
        }
        return projects;
    }

    static getProjectObjects(project, objectType) {
        var objectList = [];
        var objectCount = project.allObjectCount(objectType);

        for(var i=0; i<objectCount; i++) {
            var objectInfo = project.objectInfo(objectType, i)
            objectList.push(objectInfo);
        }

        return objectList;
    }
}