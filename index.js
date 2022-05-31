/** Initialize variables section */

const listsContainer = document.querySelector('[data-my-lists]');
const createNewListForm = document.querySelector('[data-create-new-list-form]');
const createNewListInput = document.querySelector('[data-create-new-list-input]');
const deleteListButton = document.querySelector('.delete-list-button');
const currentDisplayContainer = document.querySelector('[data-current-display-container]');
const currentListCount = document.querySelector('[data-current-list-count]');
const listTitle = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks-container]');
const taskTemplate = document.querySelector('[data-task-template]');
const createNewTaskForm = document.querySelector('[data-create-new-task-form]');
const createNewTaskInput = document.querySelector('[data-create-new-task-input]');
const clearCompletedTasksButton = document.querySelector('.clear-completed-button');
const deleteEntireListButton = document.querySelector('.delete-list-button');
const alertTemplate = document.querySelector('[data-delete-alert-template]');
const listDate = document.querySelector('[data-current-list-date]');
const urgentCheckbox = document.getElementById('new-list-checkbox');
const urgentSign = document.querySelector('.isurgent');

/** Main Section Start */

//Windows Local Storage using key value pairs
//Where we will store our yourListArray
const LOCAL_STORAGE_LISTS_ARRAY_KEY = 'task.yourListsArray';
//Where we will store our current Selected List Id
const LOCAL_STORAGE_SELECT_LISTS_ID_KEY = 'task.selectedListId';

// get and parse yourListsArray from windows local storage and save as the current yourListsArray if it exists
let yourListsArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS_ARRAY_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECT_LISTS_ID_KEY);

window.onload = () => {
    selectedListId = null;
    saveToLocalStorage();
    initializeWebsite();
}

/** Main Section end */

/** Event listener section */
listsContainer.addEventListener('click', e => {
    selectYourList(e);
});

tasksContainer.addEventListener('click', e => {
    completeTaskUpdate(e);
});

deleteListButton.addEventListener('click', () => {
    deleteAlert();
});
clearCompletedTasksButton.addEventListener('click', () => {
    clearTasks();
});

createNewListForm.addEventListener('submit', e => {
    newListFunc(e);
});

createNewTaskForm.addEventListener('submit', e => {
    newTaskFunc(e);
});
/** Function section */

function createNewList(listName, isUrgent) {
    let date = new Date();
    return { listId: date.toString(), listName: listName, tasksArray: [], isUrgent };
}

function createNewTask(newTaskName) {
    return { taskId: Date.now().toString(), taskName: newTaskName, isComplete: false };
}

function initializeWebsite() {
    clearElement(listsContainer);
    initializeLists();
    const currentSelectedList = yourListsArray.find(list => list.listId === selectedListId);
    console.log(currentSelectedList)

    if (selectedListId === 'null' || selectedListId === null || selectedListId === undefined || selectedListId === '') {
        currentDisplayContainer.style.display = 'none';
    } else {
        currentDisplayContainer.style.display = '';
        listTitle.textContent = currentSelectedList.listName;
        listDate.textContent = 'Created on ' + currentSelectedList.listId.slice(4, 15);
        initializeCurrentTaskCount(currentSelectedList);
        clearElement(tasksContainer);
        initializeTasks(currentSelectedList);
        if (currentSelectedList.isUrgent) {
            urgentSign.style.display = '';
        } else {
            urgentSign.style.display = 'none';
        }
    }

}

function initializeTasks(currentSelectedList) {
    currentSelectedList.tasksArray.forEach(task => {
        const singleTaskElement = document.importNode(taskTemplate.content, true);
        const singleTaskCheckbox = singleTaskElement.querySelector('input');
        singleTaskCheckbox.id = task.taskId;
        singleTaskCheckbox.checked = task.isComplete;
        const singleTaskLabel = singleTaskElement.querySelector('label');
        singleTaskLabel.htmlFor = task.taskId;
        singleTaskLabel.append(task.taskName);
        tasksContainer.appendChild(singleTaskElement);
    })
}

function initializeCurrentTaskCount(currentSelectedList) {
    const incompleteTaskCount = currentSelectedList.tasksArray.filter(task => task.isComplete == false).length;
    const taskCountString = incompleteTaskCount === 1 ? 'task remaining' : 'tasks remaining';
    currentListCount.textContent = `${incompleteTaskCount} ${taskCountString}`;
}

function initializeLists() {
    yourListsArray.forEach(list => {
        const liElement = document.createElement('li');
        liElement.dataset.listId = list.listId;
        liElement.classList.add('list-name');
        liElement.innerText = list.listName;
        if (list.listId == selectedListId) {
            liElement.classList.add('active-list');
        }
        listsContainer.appendChild(liElement);
        if (list.isUrgent) {
            liElement.style.borderRight = '5px solid red';
            liElement.style.borderRadius = '5px';
        }
    });
}

function initializeAndSaveListMediator() {
    saveToLocalStorage();
    initializeWebsite();
}

function clearElement(element) {
    //Clear all elements that exist
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function clearTasks() {
    const currentSelectedList = yourListsArray.find(list => list.listId == selectedListId);
    currentSelectedList.tasksArray = currentSelectedList.tasksArray.filter(task => task.isComplete == false);
    initializeAndSaveListMediator();
}

function deleteList() {

    yourListsArray = yourListsArray.filter(list => list.listId !== selectedListId);
    selectedListId = null;
    initializeAndSaveListMediator();

}

function deleteAlert() {
    const deleteAlertElement = document.importNode(alertTemplate.content, true);
    document.body.appendChild(deleteAlertElement);
    const cancelButton = document.querySelector('.cancel-button');
    const okButton = document.querySelector('.ok-button');

    disableButtonsInputs();
    cancelButton.disabled = false;
    okButton.disabled = false;
    cancelButton.style.pointerEvents = 'auto';
    okButton.style.pointerEvents = 'auto';


    cancelButton.addEventListener('click', () => {
        document.body.removeChild(document.body.querySelector('.delete-alert-container'));
        enableButtonsInputs();
    });
    okButton.addEventListener('click', () => {
        document.body.removeChild(document.body.querySelector('.delete-alert-container'));
        enableButtonsInputs();
        deleteList();
    });

}

function disableButtonsInputs() {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.disabled = true;
        button.style.pointerEvents = 'none';
    });
    allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.disabled = true;
        input.style.pointerEvents = 'none';

    });
    const allLi = document.querySelectorAll('li');
    allLi.forEach(li => {
        li.style.pointerEvents = 'none';
    });
}

function enableButtonsInputs() {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.disabled = false;
        button.style.pointerEvents = 'auto';
    });
    allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.disabled = false;
        input.style.pointerEvents = 'auto';
    });
    const allLi = document.querySelectorAll('li');
    allLi.forEach(li => {
        li.style.pointerEvents = 'auto';
    });
}

function selectYourList(e) {
    if (e.target.tagName.toLowerCase() === 'li') {
        //Assign the id for the selectedListId variable as the current ID of the 'li' element
        selectedListId = e.target.dataset.listId;
        initializeAndSaveListMediator();
    }
}

function completeTaskUpdate(e) {
    if (e.target.tagName.toLowerCase() === 'input') {
        const currentSelectedList = yourListsArray.find(list => list.listId === selectedListId);
        const currentSelectedTask = currentSelectedList.tasksArray.find(task => task.taskId === e.target.id);
        currentSelectedTask.isComplete = e.target.checked; //match boolean values with each other
        saveToLocalStorage();
        initializeCurrentTaskCount(currentSelectedList);
    }
}

function newListFunc(e) {
    e.preventDefault();
    const newListName = createNewListInput.value;
    if (newListName === '' || newListName == null) {
        document.querySelector('.new-list').style.color = 'red';
        setTimeout(() => { document.querySelector('.new-list').style.color = 'inherit' }, 1500);
        return;
    }
    const newList = createNewList(newListName, urgentCheckbox.checked);
    createNewListInput.value = '';
    //Push the newly created yourList object onto the yourListsArray
    yourListsArray.push(newList);
    initializeAndSaveListMediator();
}

function newTaskFunc(e) {
    e.preventDefault();
    const newTaskName = createNewTaskInput.value;
    if (newTaskName === '' || newTaskName == null) {
        return;
    }
    const newTask = createNewTask(newTaskName);

    //clear new task field
    createNewTaskInput.value = '';
    //get selected list and add the task to the tasksArray of the selectedList
    const currentSelectedList = yourListsArray.find(list => list.listId === selectedListId);
    currentSelectedList.tasksArray.push(newTask);
    initializeAndSaveListMediator();
}

function saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_LISTS_ARRAY_KEY, JSON.stringify(yourListsArray));
    localStorage.setItem(LOCAL_STORAGE_SELECT_LISTS_ID_KEY, selectedListId);
}