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
        
        console.log("inst", apps);
        if (apps.length > 0) return ;
        let toHandle = new ShyComponent({state : {...this.instanceObject.state} , render : this.instanceObject.render , actions : {...this.instanceObject.actions} });
        toHandle.prepare(elementId);        
        this.listApps.push({id : elementId , component : toHandle , appRef :  this.appRef || null});
        return this;
    }

}
 
window.Shy = Shyjs;
export default window.Shy;
