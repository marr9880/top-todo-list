const toDoListContainer = document.querySelector(".to-do-list");
const tasksListContainer = document.querySelector(".tasks-list");
const newToDoInput = document.querySelector(".new-to-do-input");
const newToDoDueDate = document.querySelector(".new-to-do-due-date");
const newTaskInput = document.querySelector(".new-task-input");
const newToDoForm = document.querySelector(".new-to-do-form");
const newTaskForm = document.querySelector(".new-task-form");

const LOCAL_STORAGE_TODO_KEY = "todo.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "todo.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODO_KEY)) || [];
let selectedListId;// = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

toDoListContainer.addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.id;
        renderFunctions.renderToDoList();
        renderFunctions.renderTaskList();
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
            toDoListElement.id = list.id;
            toDoListElement.classList.add("to-do");
            toDoListElement.textContent = `${list.name} due by ${list.dueDate}`;
            if (list.id === selectedListId) {
                toDoListElement.classList.add("active");
            }
            const today = new Date().toISOString().slice(0, 10);
            if (list.dueDate < today) {
                toDoListElement.style.backgroundColor = "rgba(202, 102, 102, 0.65)";
            } else if (list.dueDate > today) {
                toDoListElement.style.backgroundColor = "rgb(95, 201, 95)";
            } else {
                toDoListElement.style.backgroundColor = "rgb(230, 230, 99)";
            }
            toDoListContainer.appendChild(toDoListElement);
        })
    };

    const renderTaskList = () => {
        tasksListContainer.replaceChildren();
        let targetList = lists.find(list => list.id === selectedListId);
        if (targetList == null) {
            alert("You must select a To-Do!");
            return;
        }
        let tasks = targetList.tasks;
        tasks.forEach(task => {
            const taskListElement = document.createElement("li");
            const taskLabel = document.createElement("label");
            taskLabel.classList.add("not-checked");
            taskLabel.textContent = task.name;
            taskLabel.id = task.id;
            const taskInput = document.createElement("input");
            taskInput.name = task.name;
            taskInput.value = task.name;
            taskInput.id = task.id;
            taskInput.type = "checkbox";
            taskListElement.appendChild(taskInput);
            taskListElement.appendChild(taskLabel);
            tasksListContainer.appendChild(taskListElement);
            
            taskInput.addEventListener("change", e => {
                if (e.target.checked) {
                    task.isComplete = true;
                    if (taskInput.id === taskLabel.id) {
                        taskLabel.classList.replace("not-checked", "checked");
                    }
                } else {
                    task.isComplete = false;
                    if (taskInput.id === taskLabel.id) {
                        taskLabel.classList.replace("checked", "not-checked");
                    }
                }
            });
         });
    };



    return { renderToDoList, renderTaskList };
}) ();

const clickAndSubmitFunctions = (() => {
    
    const newToDoFormSubmit = (event) => {
        event.preventDefault();
        const toDoName = newToDoInput.value;
        const toDoDueDate = newToDoDueDate.value;
        if (toDoName == null || toDoName === "" || toDoDueDate == null || toDoDueDate === "") return;
        function createToDo(name, date) {
            return { id: crypto.randomUUID(), name: name, dueDate: date, tasks: [], isComplete: false };
        };
        const toDo = createToDo(toDoName, toDoDueDate);
        newToDoInput.value = null;
        newToDoDueDate.value = null;
        lists.push(toDo);
        renderFunctions.renderToDoList();
    };

    const newTaskFormSubmit = (event) => {
        event.preventDefault();
        const taskName = newTaskInput.value;
        if (taskName == null || taskName === "") return;
        function createTask(name) {
            return { id: crypto.randomUUID(), name: name, isComplete: false };
        };
        const task = createTask(taskName);
        newTaskInput.value = null;
        let targetList = lists.find(list => list.id === selectedListId);
        if (targetList) {
            targetList.tasks.push(task);
        }
        renderFunctions.renderTaskList();
    };

    return { newToDoFormSubmit, newTaskFormSubmit };
}) ();

newToDoForm.addEventListener("submit", clickAndSubmitFunctions.newToDoFormSubmit);
newTaskForm.addEventListener("submit", clickAndSubmitFunctions.newTaskFormSubmit);