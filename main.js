//This is an IIFEE function
//to prevent namespace pollution and multiple file management(ie. same var, function names can be used more than once if in declared under iifee if not then the file ans var names will override the other)
(function(){

    //When a html doc is loaded into a web-browser it becomes a doc obj. || and it is accessed by document.(method name) like querySelector

    let btnAddFolder = document.querySelector("#addFolder");//querySelector retrives the object present int the #folder(# is used to locate to the id of the foldername)
    let btnAddTextFile = document.querySelector("#addTextFile");
    let divbreadcrumb = document.querySelector("#breadcrumb");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");

    let resources = [];//creating an empty array
    let cfid = -1;// initially we are at root (which has an id of -1)
    let rid =0;

    btnAddFolder.addEventListener("click", addFolder);
    //addEventListener attaches an event handler to the doc like here "click" is an event and addFolder is the function it will call after being clicked on the button
    btnAddTextFile.addEventListener("click", addTextFile);

    //Function-1 : addFolder
    function addFolder()
    {
        let rname = prompt("Enter folders name");//prompt() method displays a dialog box that prompts ther user for input(returns the input value if the user clicks "OK" otherwise returns null)
        rname = rname.trim();// The trim() method removes whitespace from both sides of a string.
         //The trim() method does not change the original string.
         
         //empty name validation
         if(!rname)//(if rname is ! = true , !!= false)checks if rname is present or not if true then name is empty
        {
            alert("Empty name is not allowed.")
            return;// return to the main tab
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);//some() method checks if any array elements pass a test(If True returns true and stops or if false returns false and stops) 
        if(alreadyExists == true)
        {
            alert(rname + " is already in use. Try some other name");
            return;
        }
        let rid = resources.length;
        let pid = cfid;

        addFolderHTML(rname, rid, pid);
        resources.push({
            rid : rid,
            rname: rname,
            rtype: "folder",
            pid: cfid
        });
        saveToStorage();
    }

    function addFolderHTML(rname, rid, pid){
        //let rname = prompt("Enter folder's name");
        
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);//makes a copy it wont use the original file

        let spanRename = divFolder.querySelector("[action=rename]");
        let spanDelete = divFolder.querySelector("[action=delete]");
        let spanView= divFolder.querySelector("[action=view]");
        let divName = divFolder.querySelector("[purpose='name']");

        spanRename.addEventListener("click", renameFolder);
        spanDelete.addEventListener("click",deleteFolder);
        spanView.addEventListener("click",viewFolder);
        divName.innerHTML = rname;
        divFolder.setAttribute("rid",rid);
        divFolder.setAttribute("pid",pid);
        
        divContainer.appendChild(divFolder);//responsible to append the folder to container
    }


    function addTextFile(){
        let tfname = prompt("Enter text file's name");
        console.log(tfname);
    }

    function deleteFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        console.log("In delete for "+divName.innerHTML);
    }

    function deleteTextFile(){

    }

    function renameFolder(){
        // let divFolder = this.parentNode;
        // let divName = divFolder.querySelector("[purpose = 'name']");
        // console.log(" in rename for "+divName.innerHTML);

        let nrname = prompt("Enter folders name");
        if(nrname!=null)
        {
            nrname = nrname.trim();//The trim() method removes whitespace from both ends of a string and returns a new string, without modifying the original string.
        }
        
        if(!nrname)//empty name validation
        {
            alert("Empty name is not allowed.")
            return;
        }

        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose = 'name']");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        if(nrname == orname)
        {
            alert("Please enter a new name.");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true)
        {
            alert(rname + " exists");
            return;
        }

        //change html
        divName.innerHTML = nrname;
        //change ram
        let resource = resources.find(r =>r.rid == ridTBU);
        resource.rname = nrname;

        //change storage
        saveToStorage();
    }

    function renameTextFile(){

    }

    function viewFolder(){
        // let divFolder = this.parentNode;
        // let divName = divFolder.querySelector("[purpose='name']");
        // console.log("In view for "+divName.innerHTML);
        let spanView = this;
        let divFolder = spanView.querySelector("[purpose='name]");

        cfid = parseInt(divFolder.getAttribute("rid"));

        


    }

    function viewTextFile(){

    }

    function saveToStorage(){
        let rjson = JSON.stringify(resources);//used to convert json to a json string which can be saved
        localStorage.setItem("data",rjson);

    }
// to see the folders which were created before
    function loadFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!rjson)
        {
            return;
        }
        
        resources = JSON.parse(rjson);
        for(let i=0;i<resources.length;i++)
        {
            if(resources[i].pid == cfid)
            {
                addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
            }
            if(resources[i].rid> rid)
            {
                rid = resources[i].rid;
            }
        }
    

    }
    loadFromStorage();
})();
// to prevent namespace pollution