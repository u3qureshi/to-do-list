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

//localstorage using key value pairs
const LOCAL_STORAGE_LISTS_ARRAY_KEY = 'task.yourListsArray'; //Where we will store our listArray
const LOCAL_STORAGE_SELECT_LISTS_ID_KEY = 'task.selectedListId';
// parse local storage lists array and save as the current yourListsArray if it exists
let yourListsArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTS_ARRAY_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECT_LISTS_ID_KEY);

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        //Assign the id for the selectedListId variable as the current ID of the 'li' element
        selectedListId = e.target.dataset.listId;
        initalizeAndSaveListMediator();
    }
});

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const currentSelectedList = yourListsArray.find(list => list.listId === selectedListId);
        const currentSelectedTask = currentSelectedList.tasksArray.find(task => task.taskId === e.target.id);
        currentSelectedTask.isComplete = e.target.checked; //match boolean values with each other
        saveListsArrayToStorage();
        initalizeCurrentTaskCount(currentSelectedList);
    }
})

function saveListsArrayToStorage() {
    localStorage.setItem(LOCAL_STORAGE_LISTS_ARRAY_KEY, JSON.stringify(yourListsArray));
    localStorage.setItem(LOCAL_STORAGE_SELECT_LISTS_ID_KEY, selectedListId);
}

createNewListForm.addEventListener('submit', e => {
    e.preventDefault();
    const newListName = createNewListInput.value;
    if (newListName === '' || newListName == null) {
        document.querySelector('.new-list').style.color = 'red';
        setTimeout(() => { document.querySelector('.new-list').style.color = 'inherit' }, 2000);
        return;
    }
    const newList = createNewList(newListName);
    createNewListInput.value = '';
    //Push the newly created yourList object onto the yourListsArray
    yourListsArray.push(newList);
    initalizeAndSaveListMediator();
});
createNewTaskForm.addEventListener('submit', e => {
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
    initalizeAndSaveListMediator();
});

function createNewList(listName) {
    return { listId: Date.now().toString(), listName: listName, tasksArray: [] };
}

function createNewTask(newTaskName) {
    return { taskId: Date.now().toString(), taskName: newTaskName, isComplete: false };
}

function initalize() {
    clearElement(listsContainer);
    initalizeLists();

    const currentSelectedList = yourListsArray.find(list => list.listId === selectedListId);
    if (selectedListId == null) {
        currentDisplayContainer.style.display = 'none';
    } else {
        currentDisplayContainer.style.display = '';
        listTitle.textContent = currentSelectedList.listName;
        initalizeCurrentTaskCount(currentSelectedList);
        clearElement(tasksContainer);
        initalizeTasks(currentSelectedList);
    }

}
initalize();

function initalizeTasks(currentSelectedList) {
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

function initalizeCurrentTaskCount(currentSelectedList) {
    const incompleteTaskCount = currentSelectedList.tasksArray.filter(task => task.isComplete == false).length;
    const taskCountString = incompleteTaskCount === 1 ? 'task remaining' : 'tasks remaining';
    currentListCount.textContent = `${incompleteTaskCount} ${taskCountString}`;
}

function initalizeLists() {
    yourListsArray.forEach(list => {
        const liElement = document.createElement('li');
        liElement.dataset.listId = list.listId;
        liElement.classList.add('list-name');
        liElement.innerText = list.listName;
        if (list.listId == selectedListId) {
            liElement.classList.add('active-list');
        }
        listsContainer.appendChild(liElement);
    })
}

function initalizeAndSaveListMediator() {
    saveListsArrayToStorage();
    initalize();
}

function clearElement(element) {
    //Clear all elements that exist
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
deleteListButton.addEventListener('click', () => {
    deleteList();
});
clearCompletedTasksButton.addEventListener('click', () => {
    clearTasks();
});

function clearTasks() {
    const currentSelectedList = yourListsArray.find(list => list.listId == selectedListId);
    currentSelectedList.tasksArray = currentSelectedList.tasksArray.filter(task => task.isComplete == false);
    initalizeAndSaveListMediator();
}

function deleteList() {
    yourListsArray = yourListsArray.filter(list => list.listId !== selectedListId);
    selectedListId = null;
    initalizeAndSaveListMediator();
}