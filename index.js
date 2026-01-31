// variables
const form = document.querySelector("form");
const allTag = document.querySelector(".all-tag");
const doneTag = document.querySelector(".done-tag");
const placeHolder = document.querySelector(".no-tasks");
const prioritySelection = document.querySelector(".priority-selection");
let textInput = document.querySelector(".text-input");

// Code for priority selection to work
prioritySelection.addEventListener("change", () => {
  if (prioritySelection.value === "high") {
    prioritySelection.classList.add("high");
    prioritySelection.classList.remove("low", "normal");
  } else if (prioritySelection.value === "normal") {
    prioritySelection.classList.add("normal");
    prioritySelection.classList.remove("low", "high");
  } else {
    prioritySelection.classList.add("low");
    prioritySelection.classList.remove("normal", "high");
  }
});

// tags toggles
let toggleList = [allTag, doneTag];

// flagging for sections (all sama done)
let isAllActive = true;
let isDoneActive = false;

function toggler(buttons) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("done-tag")) {
        isDoneActive = true;
        isAllActive = false;
        allTag.classList.remove("tag-active");
        doneTag.classList.add("tag-active");
      } else {
        isAllActive = true;
        isDoneActive = false;
        doneTag.classList.remove("tag-active");
        allTag.classList.add("tag-active");
      }
      render();
    });
  });
}

toggler(toggleList);
allTag.classList.add("tag-active");

// get data from local storage
function getData() {
  return JSON.parse(localStorage.getItem("todoLists"));
}

// add to-do list from user's input to the user's loc-storage
let storedItems = getData();

// Just Making sure the local storage is hehe :D
if (!Array.isArray(storedItems)) {
  storedItems = [];
  localStorage.setItem("todoLists", JSON.stringify(storedItems));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let todoTask = {
    text: textInput.value,
    priority: prioritySelection.value,
    date: new Date().toString(),
    completed: false,
  };

  if (!textInput.value || textInput.value.trim() === "") {
    alert("Are you sure? It seems like you'll be doing nothing");
    textInput.value = "";
    return;
  }

  storedItems.push(todoTask);
  localStorage.setItem("todoLists", JSON.stringify(storedItems));
  textInput.value = "";
  render();
});

// date display function
function formatDate(dateString) {
  const d = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[d.getDay()];
  const date = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${dayName} ${date}/${month}/${year}`;
}

function render() {
  const parentContainer = document.querySelector(".list-parent-container");
  if (!parentContainer) return;

  // remove all rendered parent elements first then rerender it again
  const taskList = document.querySelectorAll(".tasks-container");
  if (taskList) {
    taskList.forEach((el) => el.remove());
  }

  if (storedItems.length > 0) {
    placeHolder.classList.add("hide-element");
  } else {
    placeHolder.classList.remove("hide-element");
  }

  storedItems.forEach((item, idx) => {
    if (isDoneActive && !item.completed) return;

    const li = document.createElement("li");
    li.classList.add("tasks-container");

    const leftCol = document.createElement("div");
    leftCol.classList.add("left-col");

    const tasksListDiv = document.createElement("div");
    tasksListDiv.classList.add("tasks-list");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("checkbox");

    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("task-title");

    const p = document.createElement("p");
    p.innerText = item.text;

    titleWrapper.appendChild(p);
    tasksListDiv.appendChild(input);
    tasksListDiv.appendChild(titleWrapper);

    const metaRow = document.createElement("div");
    metaRow.classList.add("task-meta");

    const priorityBadge = document.createElement("span");
    priorityBadge.classList.add("priority-badge", item.priority);
    priorityBadge.innerText =
      item.priority.charAt(0).toUpperCase() + item.priority.slice(1);

    const createdAt = document.createElement("span");
    createdAt.classList.add("created-at");
    createdAt.innerText = formatDate(item.date);

    metaRow.appendChild(priorityBadge);
    metaRow.appendChild(createdAt);

    leftCol.appendChild(tasksListDiv);
    leftCol.appendChild(metaRow);

    const delbtn = document.createElement("button");
    delbtn.classList.add("delete");
    delbtn.innerText = "Delete";
    delbtn.setAttribute("data-index", idx);

    input.checked = !!item.completed;
    if (input.checked) {
      titleWrapper.classList.add("done");
    } else {
      titleWrapper.classList.remove("done");
    }

    li.appendChild(leftCol);
    li.appendChild(delbtn);

    parentContainer.appendChild(li);

    input.addEventListener("change", () => {
      storedItems[idx].completed = input.checked;
      localStorage.setItem("todoLists", JSON.stringify(storedItems));
      render();
    });
  });
}

render();

// function to deleteAll to-do list data
function deleteAll() {
  localStorage.setItem("todoLists", JSON.stringify([]));
  storedItems = getData();
  if (!Array.isArray(storedItems)) storedItems = [];
  render();
}

// function delete one button
document
  .querySelector(".list-parent-container")
  .addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
      let index = event.target.dataset.index;
      storedItems.splice(index, 1);
      localStorage.setItem("todoLists", JSON.stringify(storedItems));
      render();
    }
  });
