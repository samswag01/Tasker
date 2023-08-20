import { Util, Templates, modalT } from './utils.js';
import { DB } from './data.js';

const { projectCard, taskCard, getModal } = Templates;
const { confirm, prepareModal } = Util;

let isDet = true, isPro = false;

const dB = new DB();

// Task
const Tk = {
  $: {
    content: document.querySelector('.content.detail'),
    clearButton: document.querySelector('.logo p'),
  },
  createTask (projectName, task) {
    if (!projectName) {
      alert('Error, Unknown Project');
    } else {
      dB.addTodo(projectName.name, task);
      dB.setCurrent(projectName.name);
    }
    Tk.displayProject();
  },
  requestCreate(name) {
    name = name.trim();
    if (name) {
      let project = dB.getCurrent();
      Tk.createTask(project, name);
      P.dismissNew();
    } else alert('Task cannot be empty');
  },
  toggleStatus (event, task, pName) {
    let node = event.currentTarget;
    status = dB.toggleTodoStatus(pName, task.ID)
    status ? node.classList.toggle('done') : null;
  },
  addStatusListener (taskNode, task, curTasks) {
    let pName = curTasks.name;
    taskNode.addEventListener('click', (event) => {
      Tk.toggleStatus(event, task, pName);
    });
  },
  addDeleteListener (taskNode, task, curTasks) {
    let delIcon = taskNode.querySelector('.delete');
    delIcon.addEventListener('click', (event) => {
      if (confirm(`Are you sure you want to delete ${task.todo}`)) {
        dB.deleteTodo(curTasks.name, task.ID);
        App.changeCurrent(curTasks.name);
        Tk.displayProject();
      }
      event.stopPropagation();
    });
  },
  displayProject () {
    let curTasks = dB.getCurrent();
    let node;
    Tk.$.content.innerHTML = '';
    curTasks?.todos?.map(task => {
      node = taskCard(task);
      Tk.addStatusListener(node, task, curTasks);
      Tk.addDeleteListener(node, task, curTasks);
      Tk.addEditListener(node);
      Tk.$.content.appendChild(node);
    });
  },
  editTodo(old, newName, todoID) {
    try {
      dB.renameTodo(todoID, newName);
      App.changeCurrent(dB.getCurrent().name);
      Tk.displayProject();
    } catch (err) {
      alert(err.message);
    }
  },
  addEditListener(card) {
    const editIcon = card.querySelector('.edit');

    editIcon.addEventListener('click', (event) => {
      const projectName = dB.getCurrent().name;
      const taskName = card.firstElementChild.textContent;
      let modal = new modalT('Edit Task', Tk.editTodo, taskName);
      modal.activateModal(card.id);
      event.stopPropagation();
    });
  },
  init () {
    Tk.displayProject();
    
    Tk.$.clearButton.addEventListener('click', (event) => {
      if (!isDet) return;
      let current = dB.getCurrent().name;
      dB.clearCompleted(current);
      App.changeCurrent(current);
      Tk.displayProject();
    });
  }
}

// Projects
const P = {
  $: {
    proPage: document.querySelector('.pList'),
    modalOverlay: document.querySelector('.modal-overlay'),
    cancelP: document.querySelector('.new-project .cancel'),
    okP: document.querySelector('.new-project .ok'),
    addProject: document.querySelector('nav .add'),
    newPInput: document.querySelector('.new-project input'),
  },
  
  createProject (name) {
    const errMsg = {
      Duplicate: "Project already exists!",
    }
  
    try {
      dB.createProject(name);
      App.openProject(name);
    } catch (err) {
      alert(errMsg[err.message] || "Unknown Error!");
    }
  },
  showProjects () {
    let pNames = dB.getProjectNames().reverse();
    P.$.proPage.innerHTML = '';
    pNames.forEach(name => {
      let card = projectCard(name);
      P.addDeleteListeners(card);
      P.addProjectListener(card);
      P.addEditListener(card);
      P.setCurrentBG(card);
      P.$.proPage.appendChild(card);
    });
  },
  editProject (old, newName) {
    try {
      dB.renameProject(old, newName);
      if (old === dB.getCurrent().name) {
        dB.setCurrent(newName);
      }
      P.showProjects();
    } catch (err) {
      alert(err.message);
    }
  },
  addEditListener (card) {
    const editIcon = card.querySelector('.edit');
    
    editIcon.addEventListener('click', (event) => {
      const projectName = card.firstElementChild.textContent;
      let modal = new modalT('Edit Project', P.editProject, projectName);
      modal.activateModal();
      event.stopPropagation();
    });
  },
  addDeleteListeners (card) {
    const deleteIcon = card.querySelector('.delete');
  
    deleteIcon.addEventListener('click', (event) => {
      const projectName = card.firstElementChild.textContent;
      P.deleteProject(projectName);
      event.stopPropagation();
    });
  },
  deleteProject (name) {
    if (confirm(`Are you sure you want to delete ${name}`)) {
      dB.deleteProject(name);
      if (name === dB.getCurrent().name) {
        dB.newCurrent();
      }
      dB.setDefault();
      P.showProjects();
    }
  },
  addProjectListener (project) {
    project.addEventListener('click', (event) => {
      let name = event.currentTarget.querySelector('.project-name').textContent;
      App.openProject(name);
    });
  },
  setCurrentBG (card) {
    let currentName = dB.getCurrent().name;
    if (card.querySelector('.project-name').textContent === currentName) {
      card.classList.add('current');
    }
  },
  activateNew () {
    if (isDet) {
      P.$.modalOverlay.querySelector('p').innerText = 'Create Task';
      P.$.newPInput.placeholder = 'Enter Task';
    } else {
      P.$.modalOverlay.querySelector('p').innerText = 'Create New Project';
      P.$.newPInput.placeholder = 'Enter Name';
    }
    
    P.$.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    P.$.newPInput.focus();
  },
  dismissNew () {
    P.$.modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    P.$.newPInput.value = "";
  },
  requestCreate (name) {
    name = name.trim();
    if (name) {
        P.createProject(name);
        P.dismissNew();
    } else alert('Project name cannot be empty');
  },

  init () {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && P.$.modalOverlay.classList.contains('active')) {
        P.dismissNew();
      }
    });
    
    P.$.modalOverlay.addEventListener('click', (event) => {
      if (event.target === P.$.modalOverlay) {
        P.dismissNew();
      }
    });
    
    P.$.cancelP.addEventListener('click', () => {
      P.dismissNew();
    });
    
  },
}

const App = {
  $: {
    curProject: document.querySelector('.bnav .tab1'),
    projectList: document.querySelector('.bnav .tab2'),
    proPage: document.querySelector('.pList'),
    detPage: document.querySelector('.detail'),
    todoTitle: document.querySelector('.logo p'),
  },
  changeTitle(title = "MyTodos") {
      App.$.todoTitle.innerText = title;
      document.title = title;
  },
  changeCurrent(to) {
    dB.setCurrent(to);
    App.changeTitle(to);
  },
  openProject(name) {
    App.$.curProject.classList.add('active');
    App.$.projectList.classList.remove('active');
    App.$.detPage.classList.add('active');
    App.$.proPage.classList.remove('active');
    App.changeCurrent(name);
    Tk.displayProject();
    isDet = true, isPro = false;
  },
  openCurrent () {
    let current = dB.getCurrent();
    App.openProject(current?.name);
  },
  listProjects() {
    App.$.projectList.classList.add('active');
    App.$.curProject.classList.remove('active');
    App.$.detPage.classList.remove('active');
    App.$.proPage.classList.add('active');
    P.showProjects();
    App.changeTitle();
    isDet = false, isPro = true;
  },
  init () {
    App.$.curProject.addEventListener('click', () => {
      App.openProject(dB.getCurrent()?.name);
    });
    
    App.$.projectList.addEventListener('click', () => {
      App.listProjects();
    });
    
    P.$.addProject.addEventListener('click', () => {
      P.activateNew();
    });
    
    P.$.okP.addEventListener('click', () => {
      let name = P.$.newPInput.value;
      isDet ? Tk.requestCreate(name) : P.requestCreate(name);
    });
    
    P.$.newPInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        let name = event.currentTarget.value;
        isDet ? Tk.requestCreate(name) : P.requestCreate(name);
      }
    });
    
    App.openCurrent();
    Tk.init();
    P.init();
  }
  
}

App.init();
