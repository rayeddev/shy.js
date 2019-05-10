import ShyComponent from './ShyCompoent';


class Shyjs {
 
    constructor(appRef, instanceObject)
    {
        
        this.appRef = instanceObject === undefined ? null : appRef;
        this.listApps = [];
        this.instanceObject = instanceObject === undefined ?   appRef : instanceObject;

    }



    handle(elementId) {
        let apps =this.listApps.filter((app) => {
            return app.id === elementId
        })        
        
        if (apps.length > 0) return ;
        let toHandle = new ShyComponent(this.instanceObject);
        toHandle.prepare(elementId);        
        this.listApps.push({id : elementId , component : toHandle , appRef :  this.appRef || null});
        return toHandle;
    }

}
 
window.Shy = Shyjs;
export default window.Shy;
