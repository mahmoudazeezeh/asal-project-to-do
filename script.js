// Play sound function
const playSound = (soundId) => {
  const sound = document.getElementById(soundId)
  if (sound) {
    sound.currentTime = 0
    sound.play().catch((error) => {
      console.log("Could not play sound:", error)
    })
  }
}

// Close alert function
const closeAlert = (alertId) => {
  const alertElement = document.getElementById(alertId)
  if (alertElement) {
    alertElement.classList.remove("show")
  }
}

// Show alert function
const showAlert = (message, type = "success") => {
  const alertElement = document.getElementById(type === "success" ? "successAlert" : "errorAlert")
  const messageElement = alertElement.querySelector(".alert-message")

  messageElement.textContent = message
  alertElement.classList.add("show")

  // Auto hide alert after 5 seconds
  setTimeout(() => {
    alertElement.classList.remove("show")
  }, 5000)
}

// Local storage handler
const setLocalStorage = (key, value) => {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    return JSON.parse(localStorage.getItem(key)) || []
  }
}

// Display data function
const showData = (todos) => {
  const deleteActions = document.querySelectorAll(".todoList .container .DeleteActions li")

  // Enable or disable delete buttons
  deleteActions.forEach((action) => {
    if (todosArray.length > 0) {
      action.classList.remove("disabled")
    } else {
      action.classList.add("disabled")
    }
  })

  const TasksContainer = document.querySelector("#Tasks")
  TasksContainer.innerHTML = ""

  // Display each task
  todos.forEach((todo, index) => {
    const taskClass = todo.isDone ? "task done" : "task"
    const checkboxStatus = todo.isDone ? "checked" : ""
    const taskIcon = todo.isDone ? "fas fa-check-square" : "far fa-square"

    const Task = `
      <div class="${taskClass}" data-index="${index}">
        <div class="task-content">
          <i class="${taskIcon} task-checkbox" onclick="setDone(${index})"></i>
          <p class="description">${todo.description}</p>
        </div>
        <div class="actions">
          <button class="action-btn edit-btn" onclick="renameTaskFun(${index})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" onclick="removeTask(${index})" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `
    TasksContainer.insertAdjacentHTML("beforeend", Task)
  })

  // Add message if no tasks exist
  if (todos.length === 0) {
    TasksContainer.innerHTML = `
      <div class="no-tasks">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks available</p>
        <small>Add a new task to get started</small>
      </div>
    `
  }
}

// Initialize todos array from local storage
let todosArray = setLocalStorage("todos_array", null)

// Basic DOM elements
const descriptionInput = document.getElementById("todoField")
const createNewTodoBtn = document.getElementById("createNewTodo")
const errorsContainer = document.querySelector("#violations")

// Validate todo function
const validateTodo = (todo) => {
  const regex = /^[0-9]/

  if (todo === "") {
    return "Task cannot be empty!"
  } else if (regex.test(todo)) {
    return "Numbers are not allowed at the beginning of task description."
  } else if (todo.length < 3) {
    return "Task description must be more than 3 characters."
  }

  return null
}

// Rename task function
const renameTaskFun = (index) => {
  const renameTask = document.querySelector(".renameTask")
  const newTaskInput = renameTask.querySelector(".newTaskInput")
  const RenamTaskErrorsContainer = renameTask.querySelector("#violations")
  const saveBtn = renameTask.querySelector(".saveBtn")
  const cancelBtn = renameTask.querySelector(".cancelBtn")

  RenamTaskErrorsContainer.textContent = ""
  const TargetTask = todosArray[index]
  newTaskInput.value = TargetTask.description
  renameTask.classList.add("active")

  // Focus on input field
  setTimeout(() => {
    newTaskInput.focus()
    newTaskInput.select()
  }, 100)

  // Cancel edit function
  const cancelEdit = () => {
    renameTask.classList.remove("active")
    RenamTaskErrorsContainer.textContent = ""
  }

  // Save edit function
  const saveEdit = () => {
    const error = validateTodo(newTaskInput.value.trim())

    if (error) {
      RenamTaskErrorsContainer.textContent = error
    } else {
      RenamTaskErrorsContainer.textContent = ""
      TargetTask.description = newTaskInput.value.trim()
      todosArray[index] = TargetTask
      showData(todosArray)
      renameTask.classList.remove("active")
      setLocalStorage("todos_array", todosArray)
      playSound("editSound")
      showAlert("Task updated successfully!", "success")
    }
  }

  // Bind events
  cancelBtn.onclick = cancelEdit
  saveBtn.onclick = saveEdit

  // Add Enter to save and Escape to cancel
  newTaskInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }
}

// Remove single task function
const removeTask = (targetIndex) => {
  const deleteAction = document.querySelector(".deleteAction")
  const deleteActionH2 = deleteAction.querySelector("h2")
  const deleteActionP = deleteAction.querySelector("p")
  const confirmBtn = deleteAction.querySelector(".confirm")
  const cancelBtn = deleteAction.querySelector(".cancel")

  deleteActionH2.textContent = "Delete Task"
  deleteActionP.textContent = "Are you sure you want to delete this task?"
  deleteAction.classList.add("active")

  // Confirm delete function
  const confirmDelete = () => {
    todosArray = todosArray.filter((todo, index) => index !== targetIndex)
    showData(todosArray)
    setLocalStorage("todos_array", todosArray)
    deleteAction.classList.remove("active")
    playSound("deleteSound")
    showAlert("Task deleted successfully!", "error")
  }

  // Cancel delete function
  const cancelDelete = () => {
    deleteAction.classList.remove("active")
  }

  // Bind events
  confirmBtn.onclick = confirmDelete
  cancelBtn.onclick = cancelDelete
}

// Toggle task completion status
const setDone = (index) => {
  const categories = document.querySelectorAll(".todoList .container .pagination li")

  // Reset active category to "All"
  categories.forEach((cat) => cat.classList.remove("active"))
  categories[0].classList.add("active")

  // Toggle task status
  todosArray[index].isDone = !todosArray[index].isDone
  showData(todosArray)
  setLocalStorage("todos_array", todosArray)

  const status = todosArray[index].isDone ? "completed" : "pending"
  playSound("completeSound")
  showAlert(`Task marked as ${status}!`, "success")
}

// Check for errors while typing
descriptionInput.oninput = () => {
  const value = descriptionInput.value.trim()
  const error = validateTodo(value)

  if (error) {
    errorsContainer.textContent = error
    errorsContainer.classList.add("show")
  } else {
    errorsContainer.textContent = ""
    errorsContainer.classList.remove("show")
  }
}

// Add new todo function
const addNewTodo = () => {
  const newTodo = {
    description: descriptionInput.value.trim(),
    isDone: false,
    createdAt: new Date().toISOString(),
  }

  const error = validateTodo(newTodo.description)

  if (!error) {
    todosArray.push(newTodo)
    showData(todosArray)
    descriptionInput.value = ""
    errorsContainer.textContent = ""
    errorsContainer.classList.remove("show")
    setLocalStorage("todos_array", todosArray)
    playSound("addSound")
    showAlert("New task added successfully!", "success")
  }
}

// Bind click event to add button
createNewTodoBtn.onclick = addNewTodo

// Add Enter event to input field
descriptionInput.onkeydown = (e) => {
  if (e.key === "Enter") {
    addNewTodo()
  }
}

// Display data on page load
showData(todosArray)

// Category filter function
const handleCategoryFilter = () => {
  const categories = document.querySelectorAll(".todoList .container .pagination li")

  categories.forEach((cat) => {
    cat.onclick = () => {
      categories.forEach((c) => c.classList.remove("active"))
      cat.classList.add("active")

      const category = cat.getAttribute("data-category")
      let filteredTodos = []

      switch (category) {
        case "all":
          filteredTodos = todosArray
          break
        case "done":
          filteredTodos = todosArray.filter((todo) => todo.isDone === true)
          break
        case "todo":
          filteredTodos = todosArray.filter((todo) => todo.isDone === false)
          break
        default:
          showAlert("Category not found!", "error")
          return
      }

      showData(filteredTodos)
    }
  })
}

// Enable category filtering
handleCategoryFilter()

// Handle bulk delete actions
const handleDeleteAction = (actionType) => {
  let deletedCount = 0
  let newTodosArray = []

  switch (actionType) {
    case "DeleteDone":
      const doneTasks = todosArray.filter((todo) => todo.isDone === true)
      deletedCount = doneTasks.length
      newTodosArray = todosArray.filter((todo) => todo.isDone === false)
      break

    case "DeleteAll":
      deletedCount = todosArray.length
      newTodosArray = []
      break

    default:
      console.error("Delete action type not found!")
      return
  }

  if (deletedCount === 0) {
    showAlert("No tasks to delete!", "error")
    return
  }

  todosArray = newTodosArray
  setLocalStorage("todos_array", todosArray)
  showData(todosArray)
  playSound("deleteSound")
  showAlert(`${deletedCount} task(s) deleted successfully!`, "error")
}

// Setup bulk delete actions
const setupDeleteActions = () => {
  const deleteActions = document.querySelectorAll(".todoList .container .DeleteActions li")
  const deleteActionAlert = document.querySelector(".deleteAction")
  const deleteActionH2 = deleteActionAlert.querySelector("h2")
  const deleteActionP = deleteActionAlert.querySelector("p")
  const confirmBtn = deleteActionAlert.querySelector(".confirm")
  const cancelBtn = deleteActionAlert.querySelector(".cancel")

  deleteActions.forEach((action) => {
    action.addEventListener("click", () => {
      if (action.classList.contains("disabled")) return

      const deleteType = action.getAttribute("data-deleteType")

      switch (deleteType) {
        case "DeleteDone":
          deleteActionH2.textContent = "Delete Completed Tasks"
          deleteActionP.textContent = "Are you sure you want to delete all completed tasks?"
          break
        case "DeleteAll":
          deleteActionH2.textContent = "Delete All Tasks"
          deleteActionP.textContent = "Are you sure you want to delete all tasks? This action cannot be undone!"
          break
      }

      deleteActionAlert.classList.add("active")

      confirmBtn.onclick = () => {
        handleDeleteAction(deleteType)
        deleteActionAlert.classList.remove("active")
      }

      cancelBtn.onclick = () => {
        deleteActionAlert.classList.remove("active")
      }
    })
  })
}

// Enable bulk delete actions
setupDeleteActions()

// Add global keyboard events
document.addEventListener("keydown", (e) => {
  // Close modals with Escape key
  if (e.key === "Escape") {
    const activeModals = document.querySelectorAll(".renameTask.active, .deleteAction.active")
    activeModals.forEach((modal) => {
      modal.classList.remove("active")
    })
  }
})
