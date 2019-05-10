import utils from "./utils";

export default class ShyDom {
  set html(html) {
    if (this._dom.innerHTML !== html) {
      this._dom.innerHTML = html;
    }
  }

  get html() {
    return this._dom.innerHTML;
  }

  set style(style) {
    if (this._dom.style !== style) {
      this._dom.style = style;
    }
  }

  set checked(checked)
  {
    if (this._dom.checked !== checked) {
      this._dom.checked = checked;
    }
  }

  get style() {
    return this._dom.style;
  }


  
  set click(action) {
    this.bind("click", action);
  }


  set change(action) {
    this.bind("change", action);
  }

  constructor(dom, context) {
    this._dom = dom;
    this._clones = [];
    this.refs = {};
    this.isDirty = false;
    this._context = context;
    this.listeners = {};
    this.actionsExtraPass = {};
    this._ref = dom.getAttribute("ref");
    this._repeat_dom = dom.cloneNode(true);
    this._repeat_dom_guide = document.createElement("div");
        
  }

  get value() {
    return this._dom.value;
  }

  set value(value) {
     this._dom.value = value;
  }

  bind(event, cb_action) {    
    if (this.listeners[event] === undefined) {
      console.log(cb_action)
      if (typeof cb_action.action === "function") {
        this._dom.addEventListener(event, event => {
          this._context.stateContext = "userAction";
          cb_action.action = cb_action.action.bind(this._context);
          cb_action.action(event, this._context.shyDom , this._ref, cb_action.actionsExtraPass );
        });
      }
      this.listeners = { ...this.listeners, [event]: cb_action };
    }
  }

  childrens() {}

  all(query) {
    // add all expected doms to be effected by state to array
  }

  testFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  repeat(stateArray, _key, cb) {
    if (utils.testFunction(_key) && cb === undefined) {
      cb = _key;
      _key = null;
    }

    console.log(this._dom);

    if (this._dom.parentNode !== null){
      this._dom.parentNode.insertBefore(this._repeat_dom_guide, this._dom);
      this._dom.remove();  
    }

    

    if (this._clones.length > 0) {
    }

    if (_key === null) {
      this._clones.forEach((clone, index) => {
        clone._dom.remove();
      });
      this._clones = [];
    }


    //TODO adding support for array key helping dom generate

    stateArray.map(async (item, index) => {
      let newDom = this._repeat_dom.cloneNode(true);
      let shyDome = new ShyDom(newDom, this._context);
      await cb(shyDome, item);
      this._clones.push(shyDome);
      this._repeat_dom_guide.parentNode.insertBefore(shyDome._dom, this._repeat_dom_guide);
    });
  }

  replace() {}

  ref(ref) {
    if (this.refs[ref] === undefined) {
      console.log("ref is undefiend");
      let refDom = this._dom.querySelectorAll(`[ref="${ref}"]`);

      if (refDom.length > 0) {
        this.refs = {
          ...this.refs,
          [ref]: new ShyDom(refDom[0], this._context)
        };
      } else {
        return null;
      }
    }
    return this.refs[ref];
  }
}
