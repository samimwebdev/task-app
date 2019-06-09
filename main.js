//Storage controller
const StorageCtrl = (function() {
  return {
    storeTask(task) {
      let tasks;
      if (localStorage.getItem('tasks') === null) {
        tasks = [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        //push new item
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    },
    getTasks() {
      let tasks;
      if (localStorage.getItem('tasks') === null) {
        tasks = [];
      } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
      }
      return tasks;
    },
    updateItemStorage(updatedItem) {
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.forEach((task, index) => {
        if (updatedItem.id === task.id) {
          tasks.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    deleteItemFromStorage({ id }) {
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      tasks.forEach((task, index) => {
        if (id === task.id) {
          tasks.splice(index, 1);
        }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    clearItemFromStorage() {
      localStorage.removeItem('tasks');
    }
  };
})();
//Task controller
const TaskCtrl = (function() {
  const Task = function(id, taskTitle, completed) {
    this.id = id;
    this.taskTitle = taskTitle;
    this.completed = completed;
  };
  const data = {
    tasks: StorageCtrl.getTasks(),
    currentTask: null,
    totalTask: 0
  };
  return {
    getTasks() {
      return data.tasks;
    },
    addTask(taskTitle) {
      let id;
      if (data.tasks.length > 0) {
        id = data.tasks[data.tasks.length - 1].id + 1;
      } else {
        id = 0;
      }
      // data.tasks.push({
      //   id: 3,
      //   title: taskTitle
      // });
      const newTask = new Task(id, taskTitle, false);
      data.tasks.push(newTask);
      console.log(newTask);
      return newTask;
    },
    updateItem(title) {
      let found = null;
      const updatedTask = data.tasks.map(task => {
        if (task.id === data.currentTask.id) {
          task.taskTitle = title;
          found = task;
          return task;
        } else {
          return task;
        }
      });
      data.tasks = updatedTask;
      return found;
    },
    deleteTask(currentTask) {
      const taskAfterDelete = data.tasks.filter(
        task => task.id != currentTask.id
      );
      data.tasks = taskAfterDelete;
    },
    completedTask(id) {
      const tasksAfterComplete = data.tasks.map(task => {
        if (task.id === id) {
          task.completed = !task.completed;
          return task;
        } else {
          return task;
        }
      });
      data.tasks = tasksAfterComplete;
    },
    getTotalTask() {
      return data.tasks.length;
    },
    getCompletedTask() {
      return data.tasks.reduce((acc, currentItem) => {
        if (currentItem.completed) {
          acc += 1;
          return acc;
        } else {
          return acc;
        }
      }, 0);
    },
    getById(id) {
      return data.tasks.find(task => task.id == id);
    },
    setCurrentTask(item) {
      console.log(item);
      data.currentTask = item;
    },
    getCurrentTask() {
      return data.currentTask;
    },
    logData() {
      console.log(data);
    }
  };
})();

//UI Controller
const UICtrl = (function() {
  const uiSelectors = {
    taskContainer: '.task-container',
    addTask: '#add-task',
    editTask: '.edit-task',
    completedTask: '.complete-task',
    taskTitle: '#task-title',
    updateTask: '#update-task',
    deleteTask: '#delete-task',
    backBtn: '#back-btn',
    completedTask: '.completed-task',
    totalTask: '.total-task'
  };
  return {
    populateItemList(tasks) {
      if (tasks.length === 0) {
        document.querySelector(uiSelectors.taskContainer).style.display =
          'none';
      } else {
        document.querySelector(uiSelectors.taskContainer).style.display =
          'block';
        let output = '';
        tasks.forEach(task => {
          output += `
            <div class="task-item" id="task-${task.id}">
              <div class="row">
                <div class="col-sm-6">
                  <h5 class=${task.completed ? 'completedTask' : null}>${
            task.taskTitle
          }</h4>
                </div>
                <div class="col-sm-6">
                  <a href="#" class="float-right ml-3">
                    <span class="fas fa-pencil-alt edit-task"></span>
                  </a>
                  <a href="#" class="btn- float-right">
                    <span class="fas fa-check float-right mt-1 complete-task "></span>
                  </a>
                </div>
              </div>
            </div>
        `;
        });

        document.querySelector(uiSelectors.taskContainer).innerHTML = output;
      }
    },
    populateForm(task) {
      document.querySelector(
        uiSelectors.taskTitle
      ).value = TaskCtrl.getCurrentTask().taskTitle;
      UICtrl.showEditState();
    },
    showEditState() {
      document.querySelector(uiSelectors.addTask).style.display = 'none';
      document.querySelector(uiSelectors.updateTask).style.display =
        'inline-block';
      document.querySelector(uiSelectors.deleteTask).style.display =
        'inline-block';
      document.querySelector(uiSelectors.backBtn).style.display =
        'inline-block';
    },
    //clear from edit state
    clearEditState() {
      UICtrl.clearFields();
      document.querySelector(uiSelectors.addTask).style.display = 'block';
      document.querySelector(uiSelectors.updateTask).style.display = 'none';
      document.querySelector(uiSelectors.deleteTask).style.display = 'none';
      document.querySelector(uiSelectors.backBtn).style.display = 'none';
    },
    hideCard() {
      document.querySelector(uiSelectors.taskContainer).style.display = 'none';
    },
    getItemInput() {
      return document.querySelector(uiSelectors.taskTitle).value;
    },
    getSelectors() {
      return uiSelectors;
    },
    showAlert(msg, className) {
      console.log(msg, className);
    },
    clearFields() {
      document.querySelector(uiSelectors.taskTitle).value = '';
    },
    totalTask(total) {
      document.querySelector(uiSelectors.totalTask).textContent = total;
    },
    completedTask(completedTotal) {
      document.querySelector(
        uiSelectors.completedTask
      ).textContent = completedTotal;
    }
  };
})();

//App controller
const AppCtrl = (function(TaskCtrl, UICtrl, StorageCtrl) {
  const loadEventListener = function() {
    //getting selectors
    const selectors = UICtrl.getSelectors();
    //Handling form input
    document
      .querySelector(selectors.addTask)
      .addEventListener('click', addTaskSubmit);
    //Handling edit task submit
    document
      .querySelector(selectors.taskContainer)
      .addEventListener('click', editTaskSubmit);
    //Handling completed task submit
    document
      .querySelector(selectors.taskContainer)
      .addEventListener('click', completedTask);
    //update task submit
    document
      .querySelector(selectors.updateTask)
      .addEventListener('click', updateTask);
    //Delete Task
    document
      .querySelector(selectors.deleteTask)
      .addEventListener('click', deleteTask);
    //Back Btn
    document
      .querySelector(selectors.backBtn)
      .addEventListener('click', backToTask);
  };

  function editTaskSubmit(e) {
    if (e.target.classList.contains('edit-task')) {
      const id = e.target.parentElement.parentElement.parentElement.parentElement.id.split(
        '-'
      )[1];
      const taskToEdit = TaskCtrl.getById(id);
      console.log(taskToEdit);
      TaskCtrl.setCurrentTask(taskToEdit);
      UICtrl.populateForm();
      e.preventDefault();
    }
  }

  function updateTask(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();
    //update item
    const updatedTask = TaskCtrl.updateItem(input);
    console.log(updatedTask);
    //setting updated item to localStorage
    StorageCtrl.updateItemStorage(updatedTask);
    //clearing form
    UICtrl.clearFields();
    //clear Edit State
    UICtrl.clearEditState();
    //get total task count
    const totalTaskCount = TaskCtrl.getTotalTask();
    //get completed task count
    const totalCompletedTaskCount = TaskCtrl.getCompletedTask();
    //updating total task count to UI
    UICtrl.totalTask(totalTaskCount);
    //updating completed task count to UI
    UICtrl.completedTask(totalCompletedTaskCount);
    //Getting tasks
    const tasks = TaskCtrl.getTasks();
    //populate form in edit state
    UICtrl.populateItemList(tasks);
  }

  function addTaskSubmit(e) {
    e.preventDefault();
    const taskTitle = UICtrl.getItemInput();
    if (taskTitle === '') {
      UICtrl.showAlert('please provide necessary field', 'alert alert-warning');
    } else {
      //Adding Item to state
      const newTask = TaskCtrl.addTask(taskTitle);
      //Adding item to localStorage
      StorageCtrl.storeTask(newTask);
      //clear form field
      UICtrl.clearFields();
      //get total task count
      const totalTaskCount = TaskCtrl.getTotalTask();
      //get completed task count
      const totalCompletedTaskCount = TaskCtrl.getCompletedTask();
      //updating total task count to UI
      UICtrl.totalTask(totalTaskCount);
      //updating completed task count to UI
      UICtrl.completedTask(totalCompletedTaskCount);
      //Getting tasks
      const tasks = TaskCtrl.getTasks();
      //populate form in edit state
      UICtrl.populateItemList(tasks);
    }
  }

  function deleteTask(e) {
    //get current task
    const currentTask = TaskCtrl.getCurrentTask();
    //delete task from TaskCtrl
    TaskCtrl.deleteTask(currentTask);
    //delete task from localStorage
    StorageCtrl.deleteItemFromStorage(currentTask);
    //clear State
    UICtrl.clearEditState();
    //get total task count
    const totalTaskCount = TaskCtrl.getTotalTask();
    //get completed task count
    const totalCompletedTaskCount = TaskCtrl.getCompletedTask();
    //updating total task count to UI
    UICtrl.totalTask(totalTaskCount);
    //updating completed task count to UI
    UICtrl.completedTask(totalCompletedTaskCount);
    //Getting tasks
    const tasks = TaskCtrl.getTasks();
    //populate form in edit state
    UICtrl.populateItemList(tasks);
    e.preventDefault();
  }
  //Back to Task
  function backToTask(e) {
    UICtrl.clearEditState();
    e.preventDefault();
  }
  function completedTask(e) {
    if (e.target.classList.contains('complete-task')) {
      const id = parseInt(
        e.target.parentElement.parentElement.parentElement.parentElement.id.split(
          '-'
        )[1]
      );
      TaskCtrl.completedTask(id);
      //get completed Task
      const completedTask = TaskCtrl.getById(id);
      //update completed item to localStorage
      StorageCtrl.updateItemStorage(completedTask);

      //get total task count
      const totalTaskCount = TaskCtrl.getTotalTask();
      //get completed task count
      const totalCompletedTaskCount = TaskCtrl.getCompletedTask();
      //updating total task count to UI
      UICtrl.totalTask(totalTaskCount);
      //updating completed task count to UI
      UICtrl.completedTask(totalCompletedTaskCount);
      //Getting tasks
      const tasks = TaskCtrl.getTasks();
      //populate form in edit state
      UICtrl.populateItemList(tasks);
      // UICtrl.completedTask();
    }
  }
  return {
    init() {
      const totalTaskCount = TaskCtrl.getTotalTask();
      const totalCompletedTaskCount = TaskCtrl.getCompletedTask();
      //clearEditState
      UICtrl.clearEditState();
      //getting task
      const tasks = TaskCtrl.getTasks();
      //Hiding card
      if (tasks.length == 0) {
        UICtrl.hideCard();
      } else {
        //populating Task in UI
        UICtrl.populateItemList(tasks);
      }

      UICtrl.totalTask(totalTaskCount);
      UICtrl.completedTask(totalCompletedTaskCount);

      loadEventListener();
    }
  };
})(TaskCtrl, UICtrl, StorageCtrl);

AppCtrl.init();
