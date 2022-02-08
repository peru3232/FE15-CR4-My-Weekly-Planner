//some global stuff
const output = document.getElementById("task-container");
let actTaskList = [];
let actObjArray = [];
const inputForm = document.getElementById("deliverModal");

//data access
var arrTasks = JSON.parse(taskData);


function addTask(obj) {
    //generate single html part from a task
    return `
        <div id="${obj.id}" class="col-lg-4 col-md-6 task">
            <div class="card mb-2">
                <div class="card-header bg-transparent border-0">
                    <div class="d-flex pt-2">
                        <div class="flex-grow-1 text-start"><span class="bg-info text-light py-1 px-2 rounded-3">Task:${obj.id+1}</span></div>
                        <a class="symLink" href="#noAction"><i class="far fa-bookmark px-3"></i></a>
                        <a class="symLink" href="#noAction"><i class="fad fa-ellipsis-v"></i></a>
                    </div>
                </div>
                <div class="img-task m-3 mt-1">
                    <img class="img-fluid rounded-3" src="${obj.picture}" alt="${obj.picText}">
                </div>
                <div class="card-body">
                    <h3 class="task-title">${obj.title}</h3>
                    <p class="task-text">${obj.text}</p>
                    <hr>
                    <div class="task-parameter text-start">
                        <p><a class="symLink prio" href="#noAction"><i class="fad fa-exclamation-triangle me-2"></i></a>Priority level: <span class="px-2 py-1 rounded-3 text-light bg-success">${obj.priority}</span></p>
                        <p><a class="symLink" href="#noAction"><i class="fad fa-calendar-alt me-2 task-title"></i></a>Deadline: ${obj.date} ${obj.time}</p>
                    </div>
                    <hr>
                    <div class="task-buttons text-end">
                        <button class="btn mx-0 btn-danger"><i class="fad fa-trash-alt"></i> Delete</button>
                        <button class="btn mx-1 btn-success"><i class="fad fa-check-circle"></i> Done</button>
                    </div>
                </div>
            </div>
        </div>
`
}

// <div class="row align-items-center">
//     <a class="symLink col-1" href="#noAction"><i class="fad fa-calendar-alt me-2 task-title"></i></a><span class="col-4">Deadline: </span><input type="date" class="col-6" id="task-date" value="${obj.date}"> ${obj.time}
// </div>


function deleteTask(index) {
    // access to needed elements
    const taskObj = document.getElementById(index);
    // delete task (from html and set list parameter)
    taskObj.classList.add("collapsing");
    arrTasks[index].delete = true;
    //update list and mainpage
    actTaskList = generateTaskList(null, false);
    updateMainpage(actTaskList);
}


function createNewTask() {
    console.log(arrTasks);

    //get data from form in object:
    const element = {
        "id": arrTasks.length,
        "title": document.getElementById("TaskName").value,
        "text": document.getElementById("text").value,
        "picture": document.getElementById("Picture").value,
        "picText": document.getElementById("PicTitle").value,
        "priority": Number(document.getElementById("PrioSelector").value),
        "date": document.getElementById("task-date").value,
        "time": document.getElementById("task-time").value,
        "open": true,
        "delete": false
    }
    console.log(element);
    //push new element in task array:
    arrTasks.push(element);
    //update main page including the new task :-)
    actTaskList = generateTaskList(null, false);
    updateMainpage(actTaskList);

}


function getTaskNr() {
    document.getElementById("taskID").innerHTML = ` ${arrTasks.length}`;
}


function manipulateTaskCompletion(index, toggle) {
    // access to needed elements
    const taskObj = document.getElementById(index);
    const prioObj = taskObj.querySelector("button.mx-1");
    const card = taskObj.firstElementChild;
    let open = arrTasks[index].open;

    //toggle if wanted
    if (toggle) {open = !open};

    if (!open) {
        prioObj.classList.remove("btn-success");
        prioObj.classList.add("btn-outline-success");
        prioObj.innerHTML = `<i class="fad fa-check-circle"></i> Open`;
        card.classList.add("bg-success");
        card.classList.add("bg-opacity-50");
        // prioObj.outerHTML = `<button class="btn mx-1 btn-outline-success"><i class="fad fa-check-circle"></i> Done</button>`
    }
     else {
        prioObj.classList.add("btn-success");
        prioObj.classList.remove("btn-outline-success");
        prioObj.innerHTML = `<i class="fad fa-check-circle"></i> Done`;
        card.classList.remove("bg-success");
        card.classList.remove("bg-opacity-50");
        // prioObj.outerHTML = `<button class="btn mx-1 btn-success"><i class="fad fa-check-circle"></i> Done</button>`
    }

    //wrote back to list
    arrTasks[index].open = open;
}


function manipulatePrioValue(index, count) {
    // access to needed elements
    const taskObj = document.getElementById(index);
    const prioObj = taskObj.querySelector("a.prio").nextElementSibling;
    let value = Number(arrTasks[index].priority);
    //only stepper the value if count = true
    if (count) {
        value++;
        if (value > 5) {value = 0};
        arrTasks[index].priority = value;
    };
    //first try remove all possible background colors from prio element
    prioObj.classList.remove("bg-success");
    prioObj.classList.remove("bg-warning");
    prioObj.classList.remove("bg-danger");
    //set in case of value the new background color
    switch (true) {
        case (value < 2):
            prioObj.classList.add("bg-success");
            break;
        case (value < 4):
            prioObj.classList.add("bg-warning");
            break;
        default:
            prioObj.classList.add("bg-danger");
    }
    //update value information from the object
    prioObj.innerHTML = value;
    //save settings
    updateArray();
}


function sortByPriority(x) {
    const sortElement = document.getElementById("sort");
        
    //generate comparelist -> create list of objects with the needed 2 parameters...
    let compareList = [];  
    for (id of actTaskList) {
        const compareObject = {};
        compareObject.id = id;
        compareObject.prio = arrTasks[id].priority;
        compareList.push(compareObject);
    }
    //switch to the 3 possible sort directions and update the elemts on html (stepper)
    switch(x){
        case "up": //prio direction from highest to low
            sortElement.outerHTML = `<a class="symLink" href="javascript:sortByPriority('down');" id="sort"><i class="ps-1 fad fa-sort-amount-down"></i></a>`;      
            compareList.sort((a, b) => b.prio - a.prio);
            break;
        case "down": //prio direction from lowest to high
            sortElement.outerHTML = `<a class="symLink" href="javascript:sortByPriority('no');" id="sort"><i class="ps-1 far fa-bars"></i></a>`;
            compareList.sort((a, b) => a.prio - b.prio);
            break;
        default: //standard -> from lowest to highest ID
            sortElement.outerHTML = `<a class="symLink" href="javascript:sortByPriority('up');" id="sort"><i class="ps-1 fad fa-sort-amount-up"></i></a>`;
            compareList.sort((a, b) => a.id - b.id);
    }
    //update the task list with the comparelist
    for (index in actTaskList) {
        actTaskList[index] = compareList[index].id;
    }
    //update mainpage with the new list
    updateMainpage(actTaskList);
}


function updateArray() {
    //save tasklist to JSON file (only temporary)
    taskData = JSON.stringify(arrTasks);
}


function updateMainpage(taskList) {
    //recreate of Mainpage
    output.innerHTML = '';
    //add elements serial to main as given from tasklist
    for (i of taskList) {
        output.innerHTML += addTask(arrTasks[i]);
    }

    //create eventlistener (new) to all obj
    actObjArray = output.getElementsByClassName("task");
    for (obj of actObjArray) {
        let i = obj.id;
        manipulatePrioValue(i, false);  //set prio symbol and value -> false means without counting up
        manipulateTaskCompletion(i, false);
        obj.querySelector("a.prio").addEventListener("click", function() {manipulatePrioValue(i, true)});  //click on prio symbol
        obj.querySelector("button.mx-0").addEventListener("click", function() {deleteTask(i)});  //click on delete button
        obj.querySelector("button.mx-1").addEventListener("click", function() {manipulateTaskCompletion(i, true)});  //click on done button
    }
}


function generateTaskList(opend, deleted) {
    //generate and return the tasklist with objects who matched the given parameters
    const taskList = [];
    arrTasks.forEach((task, index) => {
        switch(true) {
            case (opend == null && deleted == null):
                taskList.push(index);
                break;
            case (opend == null):
                if (task.delete == deleted) {taskList.push(index)};
                break;
            case (deleted == null):
                if (task.open == opend) {taskList.push(index)};
            default:
                if (task.open == opend && task.delete == deleted) {
                    taskList.push(index);
                }
        }
    });
    return taskList;
}


// start
actTaskList = generateTaskList(true, false);
updateMainpage(actTaskList);

document.getElementById("btnCreateTask").addEventListener("click", createNewTask);
document.getElementById("deliverModal").addEventListener("mouseover", getTaskNr);