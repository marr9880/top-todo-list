const toDoListContainer = document.querySelector(".to-do-list");
const newToDoForm = document.querySelector(".new-to-do-form");
const newToDoInput = document.querySelector(".new-to-do-input");
const tasksListContainer = document.querySelector(".tasks-list");
const newTaskForm = document.querySelector(".new-task-form");
const newTaskInput = document.querySelector(".new-task-input");

const LOCAL_STORAGE_TODO_KEY = "todo.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "todo.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODO_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

toDoListContainer.addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listID;
        renderFunctions.renderToDoList();
    }
});



function save() {
    localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
};



const renderFunctions = (() => {
    const renderToDoList = () => {
        toDoListContainer.replaceChildren();
        lists.forEach(list => {
            const toDoListElement = document.createElement("li");
            toDoListElement.dataset.listID = list.id;
            toDoListElement.classList.add("to-do");
            toDoListElement.innerText = list.name;
            if (list.id === selectedListId) {
                toDoListElement.classList.add("active")
            }    
            toDoListContainer.appendChild(toDoListElement);
        })
    };

    const renderTaskList = () => {
        tasksListContainer.replaceChildren();
        const targetList = lists.find(list => list.listID = selectedListId);
        let tasks = targetList.tasks;
        tasks.forEach(task => {
            const taskListElement = document.createElement("li");
            const taskLabel = document.createElement("label");
            taskLabel.innerText = task.name;
            const taskInput = document.createElement("input");
            taskInput.name = task.name;
            taskInput.value = task.name;
            taskInput.type = "checkbox";
            taskListElement.appendChild(taskInput);
            taskListElement.appendChild(taskLabel);
            tasksListContainer.appendChild(taskListElement);
        })
    };



    return { renderToDoList, renderTaskList };
}) ();

const clickAndSubmitFunctions = (() => {
    const newToDoFormSubmit = (event) => {
        event.preventDefault();
        const toDoName = newToDoInput.value;
        if (toDoName == null || toDoName === "") return;
        function createToDo(name) {
            return { id: crypto.randomUUID(), name: name, tasks: [] };
        };
        const toDo = createToDo(toDoName);
        newToDoInput.value = null;
        lists.push(toDo);
        renderFunctions.renderToDoList();
    };

    const newTaskFormSubmit = (event) => {
        event.preventDefault();
        const taskName = newTaskInput.value;
        if (taskName == null || taskName === "") return;
        function createTask(name) {
            return { id: crypto.randomUUID(), name: name};
        };
        const task = createTask(taskName);
        newTaskInput.value = null;
        const targetList = lists.find(list => list.listID = selectedListId);
        if (targetList) {
            targetList.tasks.push(task);
        }
        renderFunctions.renderTaskList();
    };

    return { newToDoFormSubmit, newTaskFormSubmit };
}) ();

newToDoForm.addEventListener("submit", clickAndSubmitFunctions.newToDoFormSubmit);
newTaskForm.addEventListener("submit", clickAndSubmitFunctions.newTaskFormSubmit);