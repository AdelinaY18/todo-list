//DOM
const inputEl = document.getElementById("taskInput");
const listEl = document.querySelector(".task-list");
const messageEl = document.querySelector(".form-error");
const addBtn = document.querySelector(".btn-primary");
const categoryEl = document.querySelectorAll(".category-btn");
const filterEl = document.querySelectorAll(".filter-btn");
const searchEl = document.getElementById("searchInput");
const formEl = document.querySelector('.todo-form');

//STATE
const state = {
  message: "",
  tasks: [],
  category: "work",
  search: "",
  filter: "all",
  editedId: null,
};

//RENDER
function render() {
  messageEl.textContent = state.message;
  listEl.innerHTML = "";

  const filteredTask = filteredTasks();

  filteredTask.forEach((task) => {
    const item = document.createElement("li");
    //const titleEl = document.createElement("h3");
    const deleteBtn = document.createElement("button");
    //const categoryEl = document.createElement("span");

    let titleEl
    let categoryEl

    if (state.editedId == task.id) {
      const inputEl = document.createElement("input");
      inputEl.value = task.title;
      inputEl.type = "text";

      inputEl.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishEdit(task.id, inputEl.value, select.value);
        }

        if (e.key === 'Escape') {
          cancelEdit();
        }
      })

      titleEl = inputEl;

      const select = document.createElement('select');

      ['work', 'study', 'home'].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });

      select.value = task.category || 'work';

      select.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      select.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishEdit(task.id, inputEl.value, select.value);
        }

        if (e.key === 'Escape') {
          cancelEdit();
        }
      });

      categoryEl = select;

    } else {
      const h3 = document.createElement("h3");
      h3.classList.add("task-title");
      h3.textContent = task.title;
      titleEl = h3;

      const span = document.createElement("span");
      span.classList.add("task-category");
      span.textContent = task.category;
      categoryEl = span;
    }

    const editBtn = document.createElement("button");
    editBtn.classList.add("icon-btn", "edit");
    editBtn.textContent = "Редагувати";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startEdit(task.id);
    });

    item.classList.add("task-item");

    deleteBtn.classList.add("icon-btn", "delete");
    deleteBtn.textContent = "Видалити";

    item.appendChild(titleEl);
    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    item.appendChild(categoryEl);

    listEl.appendChild(item);

    if (task.completed) {
      item.classList.add("completed");
    }

    deleteBtn.addEventListener("click", () => deleteTask(task.id));
    item.addEventListener("click", () => toggleTask(task.id));
  });
}

// початкова функція редагування
function startEdit(id) {
  state.editedId = id;
  render();
}

// функція скасування редагування
function cancelEdit() {
  state.editedId = null;
  render();
}

// функція завершення редагування
function finishEdit(id, newTitle, newCategory) {
  const item = state.tasks.find((task) => task.id === id);

  if (!item) {
    return;
  }

  const trimmed = newTitle.trim();

  if (trimmed === "") {
    state.message = "Title can not be empty";
    render();
    return;
  }

  const isDublicate = state.tasks.some((task) => task.id !== id && task.title === trimmed);

  if (isDublicate) {
    state.message = "Task already exists";
    render();
    return;
  }

  item.title = trimmed;

  item.category = newCategory || item.category;
  state.editedId = null;
  state.message = "";
  render();
}


//LOGIC
function addTask() {
  const value = inputEl.value.trim();
  const isDublicate = state.tasks.some((task) => task.title === value);
  if (value === "") {
    state.message = "Can not be empty";
    render();
    return;
  }

  if (isDublicate) {
    state.message = "Task already exists";
    render();
    return;
  }

  const task = {
    id: Date.now(),
    title: value,
    completed: false,
    category: state.category,
    filter: state.filter,
  };

  state.tasks.push(task);
  state.message = "";
  inputEl.value = "";
  render();
}

function deleteTask(id) {
  const index = state.tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return;
  }

  state.tasks.splice(index, 1);
  render();
}

function toggleTask(id) {
  const task = state.tasks.find((task) => task.id === id);

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  render();
}

function filteredTasks() {
  let filteredTasks = state.tasks;

  if (state.search !== "") {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(state.search.toLowerCase())
    );
  }

  if (state.filter != "all") {
    if (state.filter == "done") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (state.filter == "undone") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else {
      filteredTasks = filteredTasks.filter((task) => task.category === state.filter);
    }
  }

  return filteredTasks;
}


//EVENTS
//addBtn.addEventListener("click", addTask);

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});

categoryEl.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryEl.forEach((otherBtn) => {
      otherBtn.classList.remove("active");
    });
    btn.classList.add("active");

    state.category = btn.dataset.category;
    render();
  });
});

filterEl.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterEl.forEach((otherBtn) => {
      otherBtn.classList.remove("active");
    });
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    render();
  });
});

searchEl.addEventListener("input", (e) => {
  state.search = searchEl.value.trim();
  render();
});