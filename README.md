# shy.js
tiny javascript library for tiny apps that lives inside landing pages.
## beta not ready for production 



## CDN
```html
<script src="https://cdn.jsdelivr.net/gh/rayeddev/shy.js@0.1/dist/shy.js"></script>
```
## Easy to use
### Counter Exmaple ([codepen](https://codepen.io/rayeddev/pen/vwGRZg))

```html
<div id="counterApp">
    <button ref="incButton">+</button>    
    <span ref="count">0</span>    
    <button ref="decButton">-</button>
</div>
```

```js
var shyApp = new Shy("counter", {
  state: {
    count: 9
  },
  render: function(dom) {
    dom.ref("incButton").click = this.actions.mutateCount;
    dom.ref("decButton").click = this.actions.mutateCount;
    dom.ref("count").html = this.state.count;
  },
  actions: {
    mutateCount: function(event, dom, ref) {
      this.setState({ count: { $inc: ref === "incButton" ? 1 : -1 } });
    }
  }
});
shyApp.handle("#counterApp"); 
```
---

### Todo list Exmaple ([codepen](https://codepen.io/rayeddev/pen/BeKxBq))
```html
<div>
    Todo App (<sapn ref="tasksCount"></sapn>)
</div>
<div class="card-body">
    <ul>
        <li ref="tasks" >
            <span  ref="task.title">title</span>
            <input type="checkbox"  ref="task.task_mode">
        </li>
    </ul>
</div>
<div>
    <input type="text"  ref="task_title" >
    <button type="button" ref="btn_insert" >insert</button>
</div> 
```

```js
var shyTodoApp = new Shy({
  state: { tasks: [] },
  render: function(dom) {
    dom.ref("tasksCount").html = this.state.tasks.length;
    dom.ref("btn_insert").click = this.actions.insertTask;

    dom.ref("tasks").repeat(this.state.tasks, (itemDom, item) => {
      itemDom.ref("task.title").html = item.title;
      itemDom.ref("task.title").style = item.done ? "text-decoration: line-through;" : "";
      itemDom.ref("task.task_mode").checked = item.done;
      itemDom.ref("task.task_mode").change = this.actions.taskToggle.pass(item);
    });


  },
  actions: {
    insertTask: function(event, dom, ref) {
      this.setState({
        tasks: { $push: { title: dom.ref("task_title").value, done: false } }
      });
      dom.ref("task_title").value = "";
    },
    taskToggle: function(event, dom, ref, toggledItem) {
      this.setState({
        tasks: {
          $map: function(item, index) {
            if (item.title === toggledItem.title) {
              item.done = !item.done;
            }

            return item;
          }
        }
      });
    }
  }
}).handle("#todoapp");
```
----
## State mutation 
```js
    // Path mutation
    this.setState({"form.submit.loading", true})

    //Mongodb Query style state mutation

    //Toggle Value
    this.setState({"form.submit.loading", "$toggle" })

    // force toggle value
    this.setState({"form.submit.loading", {$toggle : true })

    // Inc value ++
    this.setState({"form.errors.total", "$inc" })

    // with inc factor 
    this.setState({"form.errors.total", {$inc : -1} })

    //Extend
    this.setState({"form.book", {"$extend" : {Auther : "Ali"} } })

    //Push Array Element
    this.setState({"form.errors", {$push : {message : "error 1"}} })

    // Map Array 
    this.setState({"form.errors", {$map :  function(error,index) {
        return error
    } }})

    //click event
   dom.ref("btn_insert").click = this.actions.insertTask; 
```

# Roadmap 

 - Support all html events.
 - add more exmaples.
 - jsDocs.
 - npm.
 - HTML Form components special treatment.
 - Support QuerySelect instead of ref.
 - HTML Directives (as simple as we can).
 - Better support for virtual DOM.
