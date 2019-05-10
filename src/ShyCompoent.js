import ShyDom from "./ShyDom";
import utils from './utils';
import ShyAction from './ShyAction'; 

class IArray {
  constructor(array) {
    console.log("IArray : ", array);
    this.array = array;
  }

  filter(cb) {
    return this.array.filter(cb);
  }

  map(cb) {
    return this.array.map(cb);
  }
}

export default class ShyComponent {
  get state() {
    return this._state;
  }

  filter(path, cb) {
    cb = cb.bind(this);
    return new IArray(this.__translatePath(path)).filter(cb);
  }

  map(path, cb) {
    cb = cb.bind(this);
    return new IArray(this.__translatePath(path)).map(cb);
  }



  constructor(instanceObject) {
    this._state = {};
    this.actions = {};
    this.actionsExtraPass = {};
    this.appDom = null;
    this.renderLogic = null;
    this.mounted = null;
    this.stateContext = null;
    this.instanceObject = instanceObject;
    this.noParamsCommand = ["$toggle", "$inc"];
    this.stateCommands = {
      $toggle: (value, toggler) => (toggler !== undefined ? toggler : !value),
      $inc: (value, factor) =>
        factor !== undefined ? value + factor : value++,
      $extend: (orginal, value) => {
        return {
          ...orginal,
          ...value
        };
      },
      $map: (list, cb) => list.map(cb),
      $filter: (list, cb) => list.filter(cb),
    };
    this.refStateCommands = {
      $pop: (list, elm) => list.pop(elm),
      $push: (list, elm) => list.push(elm),
      $splice: (list, ...rest) => list.splice(...rest)
    };
  }



  prepare(elementId) {
    this.appDom = document.getElementById(elementId.replace("#", "", "g"));
    let context = this;

    if (this.appDom !== null) {
      this.shyDom = new ShyDom(this.appDom, context);
      var cbDoc = this.instanceObject;
      console.log("instanceObject", this.instanceObject);

      this._state = cbDoc.state;
      console.log("state", this._state);
      this.actions = cbDoc.actions;

      Object.keys(this.actions).map((actionName,  index) => {
        this.actions[actionName] = new ShyAction(this, this.actions[actionName],  actionName);
      });
      console.log("actions", this.actions);

      this.renderLogic = cbDoc.render.bind(context);
      //  this.renderLogic = this.renderLogic.bind(context);
      if (cbDoc.mounted != null) {
        this.mounted = cbDoc.mounted;
        this.mounted = this.mounted.bind(context);
        this.mounted();
      }

      this.renderLogic(this.shyDom);
    }
  }

  validStateCommand(functionKey) {
      console.log(functionKey,[
        this.stateCommands[functionKey] || this.refStateCommands[functionKey] || null,
        this.refStateCommands[functionKey] !== undefined
      ]);
    return [
      this.stateCommands[functionKey] || this.refStateCommands[functionKey] || null,
      this.refStateCommands[functionKey] !== undefined
    ];
  }

  __translateValue(valueObj) {
    var sateFunc = null;
    var sateFuncParams = valueObj;
    var isByRef = false;

    // if the value is object ..
    if (typeof valueObj === "object") {
      let functionKey = Object.keys(valueObj).slice(0);

      [sateFunc, isByRef] = this.validStateCommand(functionKey);
      sateFuncParams = valueObj[functionKey];
    } else {
      [sateFunc, isByRef] = this.validStateCommand(valueObj);

      if (sateFunc) {
        if (this.noParamsCommand.indexOf(valueObj) >= 0) {
          sateFuncParams = null;
        }
      }
    }

    return [sateFunc, sateFuncParams, isByRef];
  }

  __translatePath(path, stateFunc, stateFuncParams, isByRef) {
    let refState = this._state;
    var refItem = path;

    if (refState[refItem] === undefined) {
      path.split(".").forEach((item, index) => {
        if (
          refState[item] !== undefined &&
          index < path.split(".").length - 1
        ) {
          refState = refState[item];
        } else {
          refItem = item;
        }
      });
    }

    if (stateFunc == undefined && stateFuncParams == undefined) {
      return refState[refItem];
    }
    if (stateFunc) {
      if (isByRef) {          
        stateFunc(refState[refItem], stateFuncParams || undefined);
      } else {
        refState[refItem] = stateFunc(refState[refItem], stateFuncParams || undefined);
      }
    } else {
      refState[refItem] = stateFuncParams;
    }
    return null;
  }

  async setState(newState) {
    if (this.stateContext === "renderLogic") {
      console.error("Not allowed to mutate state inside render logic");
      return;
    }

    // anlyize setState Keys , values,

    Object.keys(newState).map((key, index) => {
      // detect if state value is spical  state command .
      let [setStateFunc, setStateParams, isByRef] = this.__translateValue(
        newState[key]
      );
      console.log("state command for key" + key, [setStateFunc, setStateParams, isByRef]);

      if (key.split(".").length > 1) {
        // if key is string path
        this.__translatePath(key, setStateFunc, setStateParams, isByRef);
      } else {
        if (setStateFunc) {
          if (isByRef) {
            setStateFunc(this._state[key], setStateParams || undefined);
          } else {
            this._state[key] = setStateFunc(
              this._state[key],
              setStateParams || undefined
            );
          }
        } else {
          this._state[key] = setStateParams;
        }
      }
    });

    console.log("final state", this._state);
    await this.render();
  }

  render() {
    this.stateContext = "renderLogic";
    this.renderLogic(this.shyDom);
    this.stateContext = "free";
  }
}
