

export default class ShyAction
{
    constructor(context,action,action_name , actionsExtraPass =null)
    {
        this.context = context ; 
        this.actionsExtraPass = actionsExtraPass;
        this.action = action ; 
        this.name = action_name;
    }

     pass(props){
        return new ShyAction(this.context, this.action,  this.name, props)
    }
 

}