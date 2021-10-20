"use strict"
const task = document.getElementById('task');
const description = document.getElementById('description');
const dateTask = document.querySelector("input.dateTask");
const priorityTask = document.querySelectorAll('input[name="priority"]');
const addBtn = document.querySelector("button.addBtn");
const saveBtn = document.querySelector("button.saveBtn");
const resetBtn = document.getElementById('resetBtn');
const darkThemeBtn = document.querySelector('.darkThemeBtn');
const lightThemeBtn = document.querySelector('.lightThemeBtn');
const filterTask = document.querySelector("select[name=filterTask]");
const infoForFilter = document.querySelector(".infoForFilter");
const sortTask = document.querySelector("select[name=sortTask]");
const saveInd = document.getElementById("saveIndex");
const pagination = document.querySelector('#pagination'); // ul который будет с номерами страниц
let notesOnPage = 5; //количество task на одной странице
let lang;
let todoArrCopyForFilter;
let txt = {
    en: {
        'title': 'TODO LIST',
        'addBtn': 'Add',
        'saveBtn': 'Save',
        'resetBtn': 'Reset',
        'filter': 'Filter',
        'taskFilter': 'task',
        'descriptionFilter': 'description',
        'dateFilter': 'date',
        'priorityFilter': 'priority',
        'priorityLow': 'Low',
        'priorityMedium': 'Medium',
        'priorityHigh': 'High',
        'sort': 'Sort',
        'dateSort': 'date',
        'prioritySort': 'priority'
    },

    ru: {
        'title': 'СПИСОК ДЕЛ',
        'addBtn': 'Добавить',
        'saveBtn': 'Сохранить',
        'resetBtn': 'Сброс',
        'filter': 'Фильтр',
        'taskFilter': 'задача',
        'descriptionFilter': 'описание',
        'dateFilter': 'дата',
        'priorityFilter': 'приоритет',
        'priorityLow': 'Низкий',
        'priorityMedium': 'Средний',
        'priorityHigh': 'Высокий',
        'sort': 'Сортировать',
        'dateSort': 'дата',
        'prioritySort': 'приоритет'
    },
};

let placeholdertxt = {
    en: {
        'task': 'Task',
        'description': 'Description'
    },

    ru: {
        'task': 'Задача',
        'description': 'Описание'
    },
};


let todoObj = {};
const nameLocalStorage = "todolist";
let todoArr = [];
let infoLocStorage = JSON.parse(localStorage.getItem("todolist"));
(infoLocStorage) ? (todoArr = infoLocStorage) : null
let priorityTaskChecked;
let checkRadio = (e) => (priorityTaskChecked = e.target.value);

addBtn.addEventListener("click", add);
addBtn.addEventListener("click", render(todoArr));
sortTask.addEventListener("change", sortTaskFunc);
filterTask.addEventListener("change", filterTaskFunc);
resetBtn.addEventListener("click", reset);
darkThemeBtn.addEventListener('click', changeTheme);
lightThemeBtn.addEventListener('click', changeTheme);
document.getElementById('e-lang-en').addEventListener('click', setLang.bind(null, 'en'));
document.getElementById('e-lang-ru').addEventListener('click', setLang.bind(null, 'ru'));
document.querySelectorAll('input[name="priority"]').forEach((elem) => {
    elem.addEventListener("change", checkRadio)
});
lang = (window.hasOwnProperty('localStorage') && window.localStorage.getItem('lang', lang)) || 'en';
setLang(lang);

function add() {
    priorityTaskChecked = document.querySelector('input[name="priority"]:checked')
    todoObj = {
        task: task.value,
        description: description.value,
        date: dateTask.value,
        priority: (priorityTaskChecked) ? priorityTaskChecked.value : '0'
    };
    resetAllField();
    todoArr.push(todoObj);
    localStorage.setItem(nameLocalStorage, JSON.stringify(todoArr));
    paginationFunk(todoArr);
}

function paginationFunk(arr) {
    let countOfItems = Math.ceil(arr.length / notesOnPage);
    let items = []; // массив с li с номером страниц
    let pageHtml = '';
    for (let i = 1; i <= countOfItems; i++) {
        pageHtml += `<li onclick="render(null, this)">${i}</li>`
    }
    pagination.innerHTML = pageHtml;
    render(arr);
}
paginationFunk(todoArr);


function render(arr, item) {
    (arr) ? (arr = arr) : (arr = todoArr);
    let pageNum = parseInt((item) ? (item.innerHTML) : 1); //item = function(item) = showPage(items[0])  одна li с номером страны
    // item.innerHTML = 2 строка и мы преоразуем сразу в число
    let start = (pageNum - 1) * notesOnPage;
    let end = start + notesOnPage;
    let notes = arr.slice(start, end); // notes - tasks которые показывает на текущей странице
    let html = " ";
    for (let ind = start; ind < ((end > arr.length) ? (arr.length) : end); ind++) {
        let starColor;
        switch (arr[ind].priority) {
            case '0':
                starColor = "low"
                break;
            case '1':
                starColor = "norm"
                break;
            case '2':
                starColor = "high"
                break;
        }

        html += `<div class="todo-card-allInfo"'>
        <div class="todo-card-first-row">
            <div class="todo-card-task">${arr[ind].task}</div>
            <div><i class="card-date">${arr[ind].date}</i></div>
            <i class="fas fa-star ${starColor}"></i>
            <i onclick='edit(${ind})' class="fas fa-pencil-alt changeBtn"></i>
            <i onclick='del(${ind})' class="fas fa-trash-alt delBtn"></i>
        </div>
        <div class="description">${arr[ind].description}</div>
        </div>`

    };
    let container = document.getElementById("container");
    container.innerHTML = html;
};



function edit(ind) {
    saveInd.value = ind;
    let todo = localStorage.getItem("todolist");
    todoArr = JSON.parse(todo);
    task.value = todoArr[ind].task;
    description.value = todoArr[ind].description;
    dateTask.value = todoArr[ind].date;
    priorityTask[todoArr[ind].priority].checked = true;
    addBtn.style.display = "none";
    saveBtn.style.display = "block";
}

saveBtn.addEventListener("click", () => {
    let todo = localStorage.getItem("todolist");
    todoArr = JSON.parse(todo);
    let id = saveInd.value;
    todoArr[id].task = task.value;
    todoArr[id].description = description.value;
    todoArr[id].date = dateTask.value;
    todoArr[id].priority = (priorityTaskChecked) ? priorityTaskChecked : '0';
    resetAllField();
    addBtn.style.display = "block";
    saveBtn.style.display = "none";
    localStorage.setItem("todolist", JSON.stringify(todoArr));
    render(todoArr);
});

function del(ind) {
    let todo = localStorage.getItem("todolist");
    todoArr = JSON.parse(todo);
    todoArr.splice(ind, 1);
    localStorage.setItem("todolist", JSON.stringify(todoArr));
    event.stopPropagation();
    paginationFunk(todoArr);
}

function reset(e) {
    (e.target == resetBtn) ?
    document.querySelectorAll('select').forEach(v => v.options[0].selected = 'selected'):
    (sortTask.options[0].selected = 'selected');

    document.querySelectorAll('.filter').forEach(v => {
        (!(v.type == 'radio')) ? (v.value = '') : (v.checked = false);
        (e.target == resetBtn) ? v.removeAttribute("disabled"): null;
    });

    let todo = localStorage.getItem("todolist");
    todoArr = JSON.parse(todo);
    paginationFunk(todoArr);
};


function filterTaskFunc(e) {
    document.querySelectorAll('.filter').forEach(v => v.setAttribute("disabled", "disabled"));
    let key = e.target.value;
    let actionsByFilter = (tag) => {
        tag.removeAttribute("disabled");
        tag.addEventListener('input', filterFunc);
        filterTask.addEventListener("change", reset);
    };

    switch (key) {
        case 'task':
            actionsByFilter(task);
            break;

        case "date":
            actionsByFilter(dateTask);
            break;

        case "priority":
            priorityTask.forEach(v => v.addEventListener('click', filterFunc));
            priorityTask.forEach(v => v.removeAttribute("disabled"));
            document.querySelectorAll('label').forEach(v => v.removeAttribute("disabled"));
            break;

        case "description":
            actionsByFilter(description);
            break;
    };

};

function filterFunc(e) {
    if (filterTask.value) {
        let text = e.target.value;
        let key = filterTask.value;
        todoArrCopyForFilter = todoArr.slice(); // плоская копия массива
        todoArrCopyForFilter = todoArrCopyForFilter.filter(v => v[key].includes(text));
        paginationFunk(todoArrCopyForFilter);
    }
}

function sortTaskFunc(arr) {
    (!filterTask.value) ? (arr = todoArr) : (arr = todoArrCopyForFilter);

    if (sortTask.value == '1') {
        arr.sort((a, b) => b.date.localeCompare(a.date));
        render(arr);
    } else {
        arr.sort((a, b) => b.priority.localeCompare(a.priority));
        render(arr);
    }
};

function resetAllField(){
    document.querySelectorAll('.filter').forEach(v => {
        (!(v.type == 'radio')) ? (v.value = '') : (v.checked = false);
    });
};

function setLang(lang) {
    var key;
    if (!txt.hasOwnProperty(lang)) return;
    if (window.hasOwnProperty('localStorage'))
        window.localStorage.setItem('lang', lang);
    for (key in txt[lang]) {
        document.getElementById(key).innerText = txt[lang][key];
    }
    for (key in placeholdertxt[lang]) {
        document.getElementById(key).setAttribute("placeholder", placeholdertxt[lang][key])
    }
}

function changeTheme(e) {
    let styleTodo = document.getElementById("styleTodo");
    if (e.target.classList == "fas fa-moon") {
        styleTodo.href = "todoDark.css";
        darkThemeBtn.style.display = "none";
        lightThemeBtn.style.display = "block";
    } else {
        styleTodo.href = "todoLight.css";
        lightThemeBtn.style.display = "none";
        darkThemeBtn.style.display = "block";
    }
}