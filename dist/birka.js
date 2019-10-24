(function(){'use strict';var c;c={compiler:{},project:{},system:{},ui:{}};var e={createElem:function(a){return document.createElement(a)},createClassElem:function(a,b){a=document.createElement(a);void 0!==b&&a.setAttribute("class",b);return a},createIdElem:function(a,b){a=document.createElement(a);void 0!==b&&a.setAttribute("id",b);return a},appendNewElem:function(a,b){b=this.createElem(b);a.appendChild(b);return b},appendNewClassElem:function(a,b,d){b=this.createClassElem(b,d);a.appendChild(b);return b},appendNewIdElem:function(a,b,d){b=this.createIdElem(b,d);a.appendChild(b);
return b},img:function(a,b,d){d=this.createElem("img",d);d.setAttribute("src",a);d.setAttribute("alt",b);return d},link:function(a,b,d){d=this.createElem("a",d);d.setAttribute("href",a);a=document.createTextNode(b);d.appendChild(a);return d},p:function(a,b){b=this.createElem("p",b);a=document.createTextNode(a);b.appendChild(a);return b},text:function(a,b){b=document.createTextNode(b);a.appendChild(b)}};c.Tool=function(a){this.name=a||"";this.toolElem=this.appContent=null};c.Tool.prototype.initHeader=function(){this.appContent=document.getElementById("app-content");this.toolWrapper=document.getElementById("tool-wrapper");this.toolHeader=e.appendNewClassElem(this.toolWrapper,"div","tool-header");var a=e.appendNewElem(this.toolHeader,"h2");e.text(a,this.name);this.m_initTitle()};c.Tool.prototype.m_initTitle=function(){document.title="Birka "+this.name};c.Projectdirectory=function(a){this.m_project=a.name||"";this.m_output=a.location+"/"+a.name||"";this.m_title=a.title||"";this.m_id=a.id||"";this.m_resquestQueue=[];this.m_request={};this.m_folders="/bin-debug/ /lib/ /src/data/ /src/scene/ /src/scope/ /src/system/".split(" ");this.m_files=[{name:"Main.js",template:"/templates/Main.txt",directory:"/src/system/"},{name:"rune.js",url:"https://raw.githubusercontent.com/VectorPanic/rune/master/dist/rune.js",template:"",directory:"/lib/"},{name:"SceneMain.js",
template:"/templates/SceneMain.txt",directory:"/src/scene/"},{name:"Alias.js",template:"/templates/Alias.txt",directory:"/src/scope/"},{name:"Manifest.js",template:"/templates/Manifest.txt",directory:"/src/scope/"},{name:"Index.html",template:"/templates/Index.txt",directory:"/bin-debug/"}]};c.Projectdirectory.fs=require("fs");c.Projectdirectory.mkdirp=require("mkdirp");c.Projectdirectory.prototype.create=function(){this.m_initFolders()};
c.Projectdirectory.prototype.m_initFolders=function(){for(var a=0;a<this.m_folders.length;a++)this.m_checkDirectory(this.m_folders[a]);this.m_initFiles()};c.Projectdirectory.prototype.m_initFiles=function(){this.m_resquestQueue=this.m_files;this.m_processRequestQueue()};c.Projectdirectory.prototype.m_processRequestQueue=function(){0<this.m_resquestQueue.length?(this.m_request=this.m_resquestQueue.shift(),this.m_processRequest()):this.m_onComplete()};
c.Projectdirectory.prototype.m_processRequest=function(){"rune.js"==this.m_request.name?this.m_getURLdata():this.m_createFileData()};c.Projectdirectory.prototype.m_getURLdata=function(){var a=this,b=new XMLHttpRequest;b.open("GET",this.m_request.url,!0);b.onreadystatechange=function(){4===b.readyState&&(200===b.status?a.m_saveDataToFile(this.responseText):console.log("Error..."))};b.send()};c.Projectdirectory.prototype.m_checkDirectory=function(a){c.Projectdirectory.mkdirp.sync(this.m_output+a)};
c.Projectdirectory.prototype.m_createFileData=function(){var a=this.m_readTemplate(this.m_request.template).replace(/%APP%/g,this.m_project);"Main.js"==this.m_request.name&&(a=a.replace(/%TITLE%/g,this.m_title),a=a.replace(/%ID%/g,this.m_id));this.m_saveDataToFile(a)};c.Projectdirectory.prototype.m_saveDataToFile=function(a){var b=this;c.Projectdirectory.fs.writeFile(this.m_output+this.m_request.directory+this.m_request.name,a,function(a){if(a)throw a;b.m_processRequestQueue()})};
c.Projectdirectory.prototype.m_readTemplate=function(a){return c.Projectdirectory.fs.readFileSync(__dirname+a).toString()};c.Projectdirectory.prototype.m_onComplete=function(){this.m_request=this.m_resquestQueue=null;console.log("Directory complete!")};c.Projectdirectory.prototype.m_onError=function(){};c.Resourcefile=function(a,b){this.m_project=a||"";this.m_output=b||"";this.m_resquestQueue=[];this.m_request={};this.m_tempArr=[]};c.Resourcefile.fs=require("fs");c.Resourcefile.prototype.compile=function(a){0<a.length?(this.m_resquestQueue=a,this.m_processRequestQueue()):this.m_writeFile()};c.Resourcefile.prototype.m_processRequestQueue=function(){0<this.m_resquestQueue.length?(this.m_request=this.m_resquestQueue.shift(),this.m_processRequest()):this.m_writeFile()};
c.Resourcefile.prototype.m_processRequest=function(){this.m_generateBase64(this.m_request.blob,this.m_request.name)};c.Resourcefile.prototype.m_generateBase64=function(a,b){var d=this,f=new FileReader;f.onload=function(){d.m_generateResponse(b,f.result);d.m_resquest=null;d.m_processRequestQueue()};f.readAsDataURL(a)};c.Resourcefile.prototype.m_generateResponse=function(a,b){this.m_tempArr.push('this.create("'+a+'", "'+b+'");')};
c.Resourcefile.prototype.m_writeFile=function(){var a=this.m_readTemplate().replace(/%APP%/g,this.m_project),b=this.m_tempArr.join("\n\t");a=a.replace("%RESOURCES%",b);this.m_saveDataToFile(a)};c.Resourcefile.prototype.m_saveDataToFile=function(a){var b=this;c.Resourcefile.fs.writeFile(this.m_output+"/src/data/Resources.js",a,function(a){if(a)throw a;b.m_onComplete()})};c.Resourcefile.prototype.m_readTemplate=function(){return c.Resourcefile.fs.readFileSync(__dirname+"/templates/Resources.txt").toString()};
c.Resourcefile.prototype.m_onComplete=function(){this.m_tempArr=[];this.m_resquestQueue=[];this.m_request={};this.m_output=this.m_project="";console.log("Resource file has been saved!")};c.project.Toolbar=function(){this.m_tabs=[];this.m_init()};Object.defineProperty(c.project.Toolbar.prototype,"tabs",{get:function(){return this.m_tabs}});
c.project.Toolbar.prototype.m_init=function(){var a=document.getElementById("app-content");a=e.appendNewIdElem(a,"div","nav-wrapper");a=e.appendNewElem(a,"nav");a=e.appendNewElem(a,"ul");var b=[];this.m_tabs=[];for(var d=0;2>d;d++)b.push(e.appendNewElem(a,"li")),this.m_tabs.push(e.appendNewElem(b[d],"a")),this.m_tabs[d].setAttribute("href","#");this.m_tabs[0].innerHTML="Overview";this.m_tabs[0].id="overview";this.m_tabs[0].setAttribute("class","active");this.m_tabs[1].innerHTML="Compiler";this.m_tabs[1].id=
"compiler"};c.project.Modal=function(a,b){this.element=e.appendNewClassElem(document.body,"div","dialog");this.modal=a;this.options=b;this.m_footer=this.content=this.browseBtn=null;this.buttons=[];this.init()};
c.project.Modal.prototype.init=function(){var a=this,b=e.appendNewClassElem(this.element,"div","dialog-container"),d=e.appendNewClassElem(b,"div","dialog-header");d=e.appendNewElem(d,"h1");0<this.options.title.length&&(d.innerHTML=this.options.title);b=e.appendNewElem(b,"form");this.content=e.appendNewClassElem(b,"div","dialog-content");this.m_footer=e.appendNewClassElem(b,"div","dialog-footer");this.m_initFooterButtons();"error"===this.options.type?this.m_initMessage(this.options.type):"warning"===
this.options.type?this.m_initMessage(this.options.type):"custom"===this.options.type&&this.m_initCustom();this.element.addEventListener("click",function(b){"dialog"===b.target.className&&a.m_close()})};c.project.Modal.prototype.m_initMessage=function(a){0<this.options.message.length&&(a=e.appendNewClassElem(this.content,"p","dialog-"+a),a.innerHTML=this.options.message)};c.project.Modal.prototype.m_initCustom=function(){};
c.project.Modal.prototype.m_initFooterButtons=function(){var a=this;this.buttons=[];for(var b=0;1>b;b++)this.buttons.push(e.appendNewClassElem(this.m_footer,"input","button")),this.buttons[b].setAttribute("type","button");this.buttons[0].value="OK";this.buttons[0].addEventListener("click",function(){a.m_close(this)})};c.project.Modal.prototype.m_close=function(){this.element.parentNode.removeChild(this.element);this.modal=null};c.project.CreateModal=function(a,b){this.element=e.appendNewClassElem(document.body,"div","dialog");this.modal=a;this.options=b;this.locationpath=this.browseBtn=null;this.spans=[];this.buttons=[];this.init()};c.project.CreateModal.dialog=require("electron").remote.dialog;c.project.CreateModal.fs=require("fs");c.project.CreateModal.path=require("path");c.project.CreateModal.prototype=Object.create(c.project.Modal.prototype);c.project.CreateModal.prototype.constructor=c.project.CreateModal;
c.project.CreateModal.prototype.m_initCustom=function(){var a=this,b=e.appendNewElem(this.content,"div"),d=e.appendNewElem(b,"span");e.text(d,"Project name");this.inputs=[];d=e.appendNewClassElem(b,"input","game-name");d.setAttribute("type","text");d.setAttribute("placeholder","Write your project name...");d.setAttribute("required","");d.setAttribute("minlength","1");this.inputs.push(d);this.spans=[];for(d=0;4>d;d++)this.spans.push(e.createClassElem("span","spanerror"));b.appendChild(this.spans[0]);
b=[];var f=[];for(d=0;2>d;d++)b.push(e.appendNewElem(this.content,"fieldset")),f.push(e.appendNewElem(b[d],"legend"));f[0].innerHTML="Project location";f[1].innerHTML="Configuration settings";f=e.appendNewClassElem(b[0],"div","input-field");this.locationpath=e.appendNewClassElem(f,"div","filepath");this.browseBtn=e.appendNewClassElem(f,"input","project-browse");this.browseBtn.setAttribute("type","button");b[0].appendChild(this.spans[1]);var g=[];for(d=0;2>d;d++);g[0]=e.appendNewElem(b[1],"label");
this.inputs[1]=e.appendNewElem(b[1],"input");b[1].appendChild(this.spans[2]);g[1]=e.appendNewElem(b[1],"label");this.inputs[2]=e.appendNewElem(b[1],"input");b[1].appendChild(this.spans[3]);g[0].innerHTML="Id";this.inputs[1].setAttribute("type","number");this.inputs[1].setAttribute("placeholder","E.g. 0");this.inputs[1].setAttribute("required","");g[1].innerHTML="Title";this.inputs[2].setAttribute("type","text");this.inputs[2].setAttribute("placeholder","Title");this.inputs[2].setAttribute("required",
"");f.addEventListener("click",function(){a.m_chooseLocation(this)});this.inputs[0].addEventListener("input",function(){a.inputs[0].validity.valid&&(a.spans[0].innerHTML="",a.spans[0].className="spanerror")},!1);this.inputs[1].addEventListener("input",function(b){a.inputs[1].validity.valid&&(a.spans[2].innerHTML="",a.spans[2].className="spanerror",b.preventDefault())},!1);this.inputs[2].addEventListener("input",function(){a.inputs[2].validity.valid&&(a.spans[3].innerHTML="",a.spans[3].className="spanerror")},
!1)};
c.project.CreateModal.prototype.save=function(a,b){this.inputs[0].validity.valid||(this.spans[0].innerHTML="Fill in a project name.",this.spans[0].className="spanerror active");this.inputs[1].validity.valid||(this.spans[2].innerHTML="Fill in an id for your project.",this.spans[2].className="spanerror active");this.inputs[2].validity.valid||(this.spans[3].innerHTML="Fill in a title for your project.",this.spans[3].className="spanerror active");""===this.locationpath.innerHTML&&(this.spans[1].innerHTML="Please choose a location for your project.",
this.spans[1].className="spanerror active");if(this.inputs[0].validity.valid&&this.inputs[1].validity.valid&&this.inputs[2].validity.valid&&""!==this.locationpath.innerHTML){var d={name:this.inputs[0].value,location:this.locationpath.innerHTML,id:this.inputs[1].value,title:this.inputs[2].value};window.sessionStorage.setItem("loaded","true");window.sessionStorage.setItem("name",this.inputs[0].value);window.sessionStorage.setItem("projectLocation",this.locationpath.innerHTML+"/"+this.inputs[0].value);
window.sessionStorage.setItem("output",this.locationpath.innerHTML+"/"+this.inputs[0].value+"/src/data");(new c.Projectdirectory(d)).create();this.m_close();a(b)}};c.project.CreateModal.prototype.m_chooseLocation=function(){var a=this;c.project.CreateModal.dialog.showOpenDialog({title:"Select a folder",properties:["openDirectory"]},function(b){void 0!==b&&0!==b.length&&(0<a.spans.length&&(a.spans[1].innerHTML="",a.spans[1].className="spanerror"),a.locationpath.innerHTML=b[0])})};
c.project.CreateModal.prototype.m_initFooterButtons=function(){for(var a=this,b=0;2>b;b++)this.buttons.push(e.appendNewClassElem(this.m_footer,"input","button")),this.buttons[b].setAttribute("type","button");this.buttons[0].value="Cancel";this.buttons[1].value="Create";this.buttons[0].addEventListener("click",function(){a.m_close(this)})};c.project.ElementManager=function(){this.projectElem=this.toolWrapper=null;this.buttons={};this.formInputElems=this.form=this.saveBtn=this.browseBtn=this.locationpath=this.projectName=this.rightElem=null};c.project.ElementManager.prototype.init=function(){this.m_initLeft();this.m_initRight()};c.project.ElementManager.prototype.removeElems=function(){for(;this.toolWrapper.hasChildNodes();)this.toolWrapper.removeChild(this.toolWrapper.firstChild)};
c.project.ElementManager.prototype.createProjectForm=function(){this.m_createFormElems()};
c.project.ElementManager.prototype.m_initLeft=function(){this.toolWrapper=document.getElementById("app-content");this.projectElem=e.appendNewElem(this.toolWrapper,"div");this.projectElem.setAttribute("id","project");var a=e.appendNewClassElem(this.projectElem,"div","project-left"),b=e.appendNewElem(a,"h2");e.text(b,"Let's get started!");b=e.appendNewElem(a,"p");e.text(b,"Start by selecting an existing project or create a new project.");a=e.appendNewElem(a,"div");b=[];for(var d=0;2>d;d++);b[0]=e.appendNewElem(a,
"input");b[0].setAttribute("type","button");d=e.appendNewElem(a,"h3");e.text(d,"OR");b[1]=e.appendNewElem(a,"input");b[1].setAttribute("type","button");b[0].setAttribute("value","Choose project...");b[1].setAttribute("value","Create new project");this.buttons={chooseBtn:b[0],createBtn:b[1]}};
c.project.ElementManager.prototype.m_initRight=function(){this.rightElem=e.appendNewClassElem(this.projectElem,"div","project-right");var a=e.appendNewClassElem(this.rightElem,"div","no-project");a=e.appendNewElem(a,"p");e.text(a,"No project loaded...")};c.project.ElementManager.prototype.m_removeElems=function(){for(;this.rightElem.hasChildNodes();)this.rightElem.removeChild(this.rightElem.firstChild)};c.project.Project=function(){this.m_toolWrapper=this.m_toolbar=this.m_appContent=null;this.m_tabs=[];this.m_activeTool=null};c.project.Project.prototype.init=function(){this.m_appContent=document.getElementById("app-content");this.m_clearWindow();this.m_initUI()};
c.project.Project.prototype.m_initUI=function(){var a=this;this.m_toolbar=new c.project.Toolbar;this.m_tabs=this.m_toolbar.tabs;for(var b=0;b<this.m_tabs.length;b++)this.m_tabs[b].addEventListener("click",function(b){a.changeTool(b,this)});this.m_toolWrapper=e.appendNewIdElem(this.m_appContent,"div","tool-wrapper");this.m_initProjectDetails();this.m_initTitle()};
c.project.Project.prototype.m_initProjectDetails=function(){e.appendNewElem(this.m_toolWrapper,"h2");var a=e.appendNewClassElem(this.m_toolWrapper,"div","tool-header");a=e.appendNewElem(a,"h2");e.text(a,"Project name: "+window.sessionStorage.name)};c.project.Project.prototype.m_initTitle=function(){document.title=window.sessionStorage.name};
c.project.Project.prototype.changeTool=function(a,b){if(!b.classList.contains("active")){for(var d=0;d<this.m_tabs.length;d++)this.m_tabs[d].classList.remove("active");b.classList.toggle("active");this.startTool(a.target.id)}};c.project.Project.prototype.startTool=function(a){switch(a){case "overview":this.removeTool();this.m_activeTool=new c.project.Project;this.m_activeTool.init();break;case "compiler":this.removeTool(),this.m_activeTool=new c.compiler.Compiler,this.m_activeTool.init()}};
c.project.Project.prototype.m_clearWindow=function(){for(;this.m_appContent.hasChildNodes();)this.m_appContent.removeChild(this.m_appContent.firstChild)};c.project.Project.prototype.removeTool=function(){for(;this.m_toolWrapper.hasChildNodes();)this.m_toolWrapper.removeChild(this.m_toolWrapper.firstChild);this.m_activeTool=null};c.project.ProjectManager=function(a){this.callback=a;this.elemManager=null;this.paths=[];this.modal=null};c.project.ProjectManager.dialog=require("electron").remote.dialog;c.project.ProjectManager.fs=require("fs");c.project.ProjectManager.path=require("path");c.project.ProjectManager.prototype.init=function(){this.m_initUI()};c.project.ProjectManager.prototype.m_initUI=function(){this.elemManager=new c.project.ElementManager(this.toolWrapper);this.elemManager.init();this.m_addListeners()};
c.project.ProjectManager.prototype.m_addListeners=function(){var a=this;this.elemManager.buttons.createBtn.addEventListener("click",function(){a.m_createProject(this)});this.elemManager.buttons.chooseBtn.addEventListener("click",function(){a.m_openProject(this)})};
c.project.ProjectManager.prototype.m_createProject=function(){var a=this;a.modal=new c.project.CreateModal(a.modal,{type:"custom",title:"Create project"});a.modal.buttons[1].addEventListener("click",function(){a.modal.save(a.m_saveProject,a)})};c.project.ProjectManager.prototype.m_saveProject=function(a){var b=new c.project.Project;a.callback(b)};
c.project.ProjectManager.prototype.m_openProject=function(){var a=this;c.project.ProjectManager.dialog.showOpenDialog({title:"Select a folder",properties:["openDirectory"]},function(b){void 0!==b&&0!==b.length&&a.m_loadProject(b[0])})};
c.project.ProjectManager.prototype.m_loadProject=function(a){if(this.m_checkProjectValidity(a,this.m_walkDir(a))){var b=a.replace(/^.*[\\\/]/,"");window.sessionStorage.setItem("name",b);window.sessionStorage.setItem("projectLocation",a);window.sessionStorage.setItem("output",a+"/src/data");window.sessionStorage.setItem("loaded","true");this.m_saveProject(this)}else this.m_showError("Not a working project.","Missing Main.js and/or data folder.")};
c.project.ProjectManager.prototype.m_walkDir=function(a){var b=this;c.project.ProjectManager.fs.readdirSync(a).forEach(function(d){d=c.project.ProjectManager.path.join(a,d);c.project.ProjectManager.fs.lstatSync(d).isDirectory()?(b.m_walkDir(d),b.paths.push(d)):d.match(/(^|\/)\.[^\/\.]/g)||b.paths.push(d)})};c.project.ProjectManager.prototype.m_checkProjectValidity=function(a){if(-1<this.paths.indexOf(a+"/src/system/Main.js")){if(-1<this.paths.indexOf(a+"/src/data"))return!0}else return!1};
c.project.ProjectManager.prototype.m_showError=function(a,b){this.modal=new c.project.Modal(this.modal,{type:"error",title:[a],message:[b]})};c.compiler.Table=function(a){this.element=e.appendNewClassElem(a,"div","fileIndex");this.tableElem=null};c.compiler.Table.prototype.init=function(){var a=e.appendNewElem(this.element,"h3");e.text(a,"Files");this.tableElem=e.appendNewElem(this.element,"table");a=e.appendNewElem(this.tableElem,"thead");a=e.appendNewElem(a,"tr");for(var b=[],d=0;5>d;d++)b.push(e.appendNewElem(a,"th"));e.text(b[0],"Incl.");e.text(b[1],"File path");e.text(b[2],"Name");e.text(b[3],"File size");e.text(b[4],"")};c.compiler.Form=function(a){this.element=e.appendNewElem(a,"form");this.refreshBtn=this.outputPath=this.inputPath=this.outputBtn=this.inputBtn=null};
c.compiler.Form.prototype.init=function(){this.element.method="post";this.element.enctype="multipart/form-data";for(var a=[],b=[],d=[],f=0;2>f;f++)b.push(e.appendNewClassElem(this.element,"div","input-field"));var g=[];for(f=0;2>f;f++)g.push(e.appendNewClassElem(b[f],"input","browse")),g[f].setAttribute("type","button"),g[f].setAttribute("value","Browse..."),d.push(e.appendNewClassElem(b[f],"div","output-row")),a.push(e.appendNewElem(d[f],"label"));a[0].setAttribute("for","selectInputBtn");a[0].innerText=
"Select input folder";a[1].setAttribute("for","selectOutputBtn");a[1].innerText="Select output folder";g[0].id="selectInputBtn";this.inputBtn=g[0];g[1].id="selectOutputBtn";this.outputBtn=g[1];a=[];for(f=0;2>f;f++)a.push(e.appendNewElem(d[f],"div")),a[f].setAttribute("class","filepath");this.refreshBtn=e.appendNewClassElem(b[0],"input","refresh");this.refreshBtn.setAttribute("type","button");this.inputPath=a[0];this.outputPath=a[1];this.inputPath.innerHTML="No folder chosen.";this.outputPath.innerHTML=
void 0===window.sessionStorage.output||""===window.sessionStorage.output?"No folder chosen.":window.sessionStorage.output};c.compiler.Footer=function(a){this.element=e.appendNewClassElem(a,"div","footer");this.compileBtn=null};Object.defineProperty(c.compiler.Footer.prototype,"setWarnings",{set:function(a){this.warningsElem.innerHTML=a.toString()}});Object.defineProperty(c.compiler.Footer.prototype,"setErrors",{set:function(a){this.errorsElem.innerHTML=a.toString()}});
c.compiler.Footer.prototype.init=function(){var a=e.appendNewClassElem(this.element,"div","msg"),b=e.appendNewClassElem(a,"div","msg-error");this.errorsElem=b.appendChild(e.p("0"));b.appendChild(e.p(" error(s) "));a=e.appendNewClassElem(a,"div","msg-warning");this.warningsElem=a.appendChild(e.p("0"));a.appendChild(e.p(" warning(s)"));this.errors=this.warnings=0;this.compileBtn=e.appendNewElem(this.element,"input");this.compileBtn.setAttribute("type","submit");this.compileBtn.setAttribute("value",
"Compile");this.compileBtn.setAttribute("id","compileBtn")};c.compiler.File=function(a,b){this.blob=a;this.path=b;this.status=[];this.name=null;this.size="";this.init()};c.compiler.File.ALLOWED_FILE_TYPES="image/png image/jpeg audio/ogg audio/mpeg application/xml application/json".split(" ");Object.defineProperty(c.compiler.File.prototype,"setStatus",{set:function(a){this.status.push(a)}});Object.defineProperty(c.compiler.File.prototype,"setName",{set:function(a){this.name=a}});
c.compiler.File.prototype.init=function(){this.name=this.m_getFileName(this.path);this.size=this.m_bytesToSize(this.blob.size)};c.compiler.File.prototype.removeError=function(a){for(var b=0;b<this.status.length;b++)this.status[b]===a&&this.status.splice(b,1)};c.compiler.File.prototype.isDuplicate=function(){for(var a=!1,b=0;b<this.status.length;b++)a=2===this.status[b]?!0:!1;return a};c.compiler.File.prototype.hasWarning=function(){for(;0<this.status.length;)return 10<=this.status[0]?!0:!1};
c.compiler.File.prototype.m_checkStatus=function(){0>c.compiler.File.ALLOWED_FILE_TYPES.indexOf(this.blob.type)&&(this.setStatus=1);("image/png"===this.blob.type||"image/jpg"===this.blob.type)&&11E5<this.blob.size&&(this.setStatus=10);("audio/ogg"===this.blob.type||"audio/mpeg"===this.blob.type)&&33E5<this.blob.size&&(this.setStatus=11)};c.compiler.File.prototype.m_getFileName=function(a){a=a.replace(/^.*[\\\/]/,"");a=a.split(".").slice(0,-1).join(".");return a=a.replace(" ","_")};
c.compiler.File.prototype.m_bytesToSize=function(a){if(0===a)return"0 Byte";var b=parseInt(Math.floor(Math.log(a)/Math.log(1024)));return Math.round(a/Math.pow(1024,b),2)+" "+["B","kB","MB","GB","TB"][b]};c.compiler.Message=function(){this.tbody=null;this.messages=[]};c.compiler.Message.prototype.create=function(a,b){this.tbody=e.createClassElem("tbody","message");a.insertBefore(this.tbody,a.children[b+1])};c.compiler.Message.prototype.addMessage=function(a){if(0<a.length)for(var b=0;b<a.length;b++){var d=new c.compiler.MessageRow(this.tbody,a[b]);d.setStatus=a[b];this.messages.push(d)}else d=new c.compiler.MessageRow(this.tbody,a),d.setStatus=a,this.messages.push(d);this.tbody.style.display="none"};
c.compiler.Message.prototype.addMessageAt=function(a){for(var b=0;b<a.length;b++){var d=new c.compiler.MessageRow(this.tbody,a[b]);d.setStatus=a[b];this.messages.push(d)}this.tbody.style.display="none"};c.compiler.Message.prototype.removeDup=function(){for(var a=0;a<this.messages.length;a++)2===this.messages[a].status&&(this.tbody.removeChild(this.messages[a].element),this.messages.splice(a,1))};
c.compiler.Message.prototype.containsDuplicateErr=function(){for(var a=!1,b=0;b<this.messages.length;b++)a=2===this.messages[b].status?!0:!1;return a};c.compiler.MessageRow=function(a,b){this.element=e.appendNewClassElem(a,"tr","msg");this.create(b);this.status=0};Object.defineProperty(c.compiler.MessageRow.prototype,"setStatus",{set:function(a){this.status=a}});c.compiler.MessageRow.prototype.create=function(a){this.setStyle(a);var b=e.appendNewElem(this.element,"td");b.setAttribute("colspan","5");b.innerHTML=this.codeToMessage(a)};c.compiler.MessageRow.prototype.m_toggleDisabled=function(a){this.element.style.display=a?"none":"table-row"};
c.compiler.MessageRow.prototype.codeToMessage=function(a){var b="";switch(a){case 1:b="Invalid file type.";break;case 2:b="Duplicate file name. Change ...";break;case 10:b="File size exceeds 1MB.";break;case 11:b="File size exceeds 3MB"}return b};
c.compiler.MessageRow.prototype.setStyle=function(a){switch(a){case 0:this.element.classList.remove("error");break;case 1:this.element.classList.add("error");break;case 2:this.element.classList.add("error");break;case 10:this.element.classList.add("warning");break;case 11:this.element.classList.add("warning")}};c.compiler.TableRow=function(a){this.tbody=e.appendNewElem(a,"tbody");this.element=e.appendNewElem(this.tbody,"tr");this.include=!0;this.m_parentTable=a;this.tds=[];this.messageRow=this.textInput=null};c.compiler.TableRow.prototype.create=function(a){this.m_createCells(a);this.m_makeCollapsible();0<a.status.length&&this.m_changeStatus(a.status)};c.compiler.TableRow.prototype.m_createRow=function(){};
c.compiler.TableRow.prototype.m_createCells=function(a){for(var b=0;5>b;b++)this.tds.push(e.appendNewElem(this.element,"td"));this.m_addCheckbox(this.tds[0]);this.tds[1].innerHTML=a.path;this.m_inputName(this.tds[2],a.name);this.tds[3].innerHTML=a.size;this.tds[4].classList.add("coll-cell")};
c.compiler.TableRow.prototype.m_addCheckbox=function(a){var b=this;a=e.appendNewClassElem(a,"label","check-container");var d=e.appendNewClassElem(a,"input","checkbox");d.setAttribute("type","checkbox");d.setAttribute("checked","checked");d.addEventListener("click",function(){b.m_toggleInclude(this)});e.appendNewClassElem(a,"span","checkmark")};c.compiler.TableRow.prototype.m_toggleInclude=function(){this.element.classList.toggle("ignored");this.include=!0!==this.include};
c.compiler.TableRow.prototype.m_inputName=function(a,b){this.textInput=e.appendNewElem(a,"input");this.textInput.setAttribute("type","text");this.textInput.setAttribute("value",b)};c.compiler.TableRow.prototype.m_changeStatus=function(a){var b=0;if(0<a.length)for(var d=0;d<a.length;d++){if(1===a[d]||2===a[d])b=1;10<=a[d]&&(b=10)}this.m_styleRow(b)};
c.compiler.TableRow.prototype.m_styleRow=function(a){switch(a){case 0:this.element.classList.remove("error");break;case 1:this.element.classList.add("error");break;case 2:this.element.classList.add("error");break;case 10:this.element.classList.add("warning");break;case 11:this.element.classList.add("warning");break;case 5:this.element.classList.remove("warning"),this.element.classList.add("error")}};
c.compiler.TableRow.prototype.m_toggleDisabled=function(a){a&&(this.messageRow.style.display="none");this.m_makeCollapsible()};c.compiler.TableRow.prototype.m_makeCollapsible=function(){var a=this;this.tds[4].addEventListener("click",function(){a.m_collapse(this)})};
c.compiler.TableRow.prototype.m_collapse=function(a){if(this.element.classList.contains("error")||this.element.classList.contains("warning"))a.classList.toggle("coll-active"),a=this.tbody.nextElementSibling,"table-row-group"===a.style.display?a.style.display="none":"none"===a.style.display&&(a.style.display="table-row-group")};c.compiler.Compiler=function(){c.Tool.call(this,"Compiler");this.footer=this.table=this.form=this.toolHeader=null;this.files=[];this.outputPath="";this.warnings=this.errors=0;this.modal=null};c.compiler.Compiler.dialog=require("electron").remote.dialog;c.compiler.Compiler.ALLOWED_FILE_TYPES="image/png image/jpeg audio/ogg audio/mpeg text/xml application/json".split(" ");c.compiler.Compiler.fs=require("fs");c.compiler.Compiler.path=require("path");c.compiler.Compiler.prototype=Object.create(c.Tool.prototype);
c.compiler.Compiler.prototype.constructor=c.compiler.Compiler;c.compiler.Compiler.prototype.init=function(){if(void 0===window.sessionStorage.loaded){this.initHeader();var a=e.appendNewClassElem(this.toolHeader,"div","no-project");a=e.appendNewElem(a,"p");e.text(a,"No project loaded...")}else this.m_initUI()};
c.compiler.Compiler.prototype.m_initUI=function(){this.initHeader();this.form=new c.compiler.Form(this.toolHeader);this.form.init();this.table=new c.compiler.Table(this.toolWrapper);this.table.init();this.footer=new c.compiler.Footer(this.toolWrapper);this.footer.init();this.m_addListeners()};
c.compiler.Compiler.prototype.m_addListeners=function(){var a=this;this.form.inputBtn.addEventListener("click",function(){a.m_uploadFiles(this)});this.form.refreshBtn.addEventListener("click",function(){a.m_refresh(this)});this.form.outputBtn.addEventListener("click",function(){a.m_chooseOutput(this)});this.footer.compileBtn.addEventListener("click",function(){a.m_compile(this)})};
c.compiler.Compiler.prototype.m_compile=function(){for(var a=[],b=0;b<this.files.length;b++)!0===this.files[b].row.include&&a.push(this.files[b].file);for(b=0;b<a.length;b++)if(0<a[b].status.length)for(var d=0;d<a[b].status.length;d++)if(1===a[b].status[d]||2===a[b].status[d]){this.modal=new c.project.Modal(this.modal,{type:"error",title:"Can't compile",message:"Your selected folder contains errors."});return}(new c.Resourcefile(window.sessionStorage.name,window.sessionStorage.projectLocation)).compile(a)};
c.compiler.Compiler.prototype.m_chooseOutput=function(){var a=this;c.compiler.Compiler.dialog.showOpenDialog({title:"Select a folder",properties:["openDirectory"]},function(b){void 0===b||0===b.length?console.log("No destination folder selected"):(a.outputPath=b[0],a.form.outputPath.innerHTML=b[0])})};
c.compiler.Compiler.prototype.m_uploadFiles=function(){var a=this;c.compiler.Compiler.dialog.showOpenDialog({title:"Select a folder",properties:["openDirectory"]},function(b){void 0===b||0===b.length?console.log("No destination folder selected"):(a.m_emptyTable(),a.form.inputPath.innerHTML=b[0],a.m_walkDir(b[0]))})};c.compiler.Compiler.prototype.m_refresh=function(){""!==this.form.inputPath.innerHTML&&(this.m_emptyTable(),this.m_walkDir(this.form.inputPath.innerHTML))};
c.compiler.Compiler.prototype.m_emptyTable=function(){this.warnings=0;this.footer.setWarnings=this.warnings;this.errors=0;for(this.footer.setErrors=this.errors;1<this.table.tableElem.childNodes.length;)this.table.tableElem.removeChild(this.table.tableElem.lastChild);this.files=[]};
c.compiler.Compiler.prototype.m_walkDir=function(a){var b=this;c.compiler.Compiler.fs.readdirSync(a).forEach(function(d){d=c.compiler.Compiler.path.join(a,d);c.compiler.Compiler.fs.lstatSync(d).isDirectory()?b.m_walkDir(d):d.match(/(^|\/)\.[^\/\.]/g)||b.m_requestFile(d)})};
c.compiler.Compiler.prototype.m_requestFile=function(a){var b=this,d=new XMLHttpRequest;d.open("GET",a,!0);d.responseType="blob";d.onreadystatechange=function(){4===d.readyState&&(200===d.status?b.m_getData(new c.compiler.File(this.response,a)):console.log("Error..."))};d.send()};
c.compiler.Compiler.prototype.m_getData=function(a){var b=this;a.m_checkStatus();0<this.files.length&&b.m_checkIfDuplicate(a.name)&&(a.setStatus=2,this.m_checkForNewDuplicates(a.name));var d=new c.compiler.TableRow(this.table.tableElem);d.create(a);d.textInput.addEventListener("input",function(a){b.m_changeName(a,d)});if(0<a.status.length){var f=new c.compiler.Message(this.table.tableElem);f.create(this.table.tableElem,this.table.tableElem.childNodes);f.addMessage(a.status);for(var g=0;g<a.status.length;g++)this.m_incrementException(a.status[g])}this.files.push({file:a,
row:d,message:f})};c.compiler.Compiler.prototype.m_incrementException=function(a){0<a&&10>a&&(this.errors++,this.footer.setErrors=this.errors);10<=a&&(this.warnings++,this.footer.setWarnings=this.warnings)};c.compiler.Compiler.prototype.m_decrementException=function(a){0<a&&10>a&&(this.errors--,this.footer.setErrors=this.errors);10<=a&&(this.warnings--,this.footer.setWarnings=this.warnings)};
c.compiler.Compiler.prototype.m_checkIfDuplicate=function(a){for(var b=!1,d=0;d<this.files.length;d++)this.files[d].file.name===a&&(b=!0);return b};
c.compiler.Compiler.prototype.m_changeName=function(a,b){for(a=0;a<this.files.length;a++)if(this.files[a].row===b){var d=this.files[a];this.m_checkIfDuplicate(b.textInput.value)&&d.file.isDuplicate()?(this.m_checkRemainingDuplicates(d.file.name),this.m_checkForNewDuplicates(b.textInput.value)):this.m_checkIfDuplicate(b.textInput.value)&&!d.file.isDuplicate()?(this.m_checkForNewDuplicates(b.textInput.value),this.m_addDuplicateError(d,a+2)):!this.m_checkIfDuplicate(b.textInput.value)&&d.file.isDuplicate()&&
(this.m_removeDuplicateError(d),this.m_checkRemainingDuplicates(d.file.name));this.files[a].file.setName=b.textInput.value}};c.compiler.Compiler.prototype.m_checkRemainingDuplicates=function(a){for(var b=0,d=0;d<this.files.length;d++)this.files[d].row.textInput.value===a&&b++;for(d=0;d<this.files.length;d++)this.files[d].row.textInput.value===a&&1>=b&&this.m_removeDuplicateError(this.files[d])};
c.compiler.Compiler.prototype.m_checkForNewDuplicates=function(a){for(var b=0;b<this.files.length;b++)if(this.files[b].file.name===a&&!this.files[b].file.isDuplicate()){for(var d=0,f=0;f<this.table.tableElem.childNodes.length;f++)this.table.tableElem.childNodes[f].childNodes[0]===this.files[b].row.element&&(d=f);this.m_addDuplicateError(this.files[b],d)}};
c.compiler.Compiler.prototype.m_addDuplicateError=function(a,b){a.file.setStatus=2;if(void 0===a.message||null===a.message){var d=new c.compiler.Message(this.table.tableElem);d.create(this.table.tableElem,b);a.message=d}a.message.addMessage(2);a.file.hasWarning()?a.row.m_styleRow(5):a.row.m_styleRow(2);this.m_incrementException(2)};
c.compiler.Compiler.prototype.m_removeDuplicateError=function(a){a.message.containsDuplicateErr()&&(a.message.removeDup(),a.file.removeError(2));-1<a.file.status.indexOf(10)&&a.row.m_styleRow(10);this.m_decrementException(2);0===a.file.status.length&&(a.message.tbody.parentNode.removeChild(a.message.tbody),a.message=null,a.row.tds[4].classList.contains("coll-active")&&a.row.tds[4].classList.remove("coll-active"),a.row.m_styleRow(0))};c.system.Main=function(){this.project=this.projectManager=null};c.system.Main.init=function(){c.system.Main.m_initUI()};c.system.Main.m_initUI=function(){this.projectManager=new c.project.ProjectManager(c.system.Main.m_addProject);this.projectManager.init()};c.system.Main.m_addProject=function(a){this.project=a;this.project.init()};c.system.Main.m_removeProject=function(){this.project=null};window.addEventListener("load",c.system.Main.init);"undefined"!==typeof window&&"undefined"===typeof window.birka&&(window.birka=c);}).call(this);
