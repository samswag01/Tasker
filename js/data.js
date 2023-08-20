export class DB {
  constructor(name = 'todos') {
    this.name = name;
    this.setDefault();
  }
  
  setDefault () {
    if (!this.load().current) {
      this.createProject('Inbox');
      this.setCurrent('Inbox');
    }
  }

  load() {
    return JSON.parse(localStorage.getItem(this.name)) || { current: null, projects: [] };
  }

  save(data) {
    localStorage.setItem(this.name, JSON.stringify(data));
  }

  getCurrent() {
    const data = this.load();
    return data.current;
  }

  setCurrent(projectName) {
    const data = this.load();
    const project = data.projects.find(project => project.name === projectName);
    if (project) {
      data.current = project;
      this.save(data);
    }
  }
  
  addTodo(projectName, todo) {
    const data = this.load();
    const project = data.projects.find(project => project.name === projectName);
  
    if (project) {
      project.todos.push({ todo, status: false, ID: Date.now() });
      this.save(data);
    }
  }
  
  createProject(projectName) {
    const data = this.load();
    const existingProject = data.projects.find(project => project.name === projectName);
  
    if (existingProject) {
      throw new Error('Duplicate');
    }
  
    const newProject = {
      name: projectName,
      todos: []
    };
  
    data.projects.push(newProject);
    data.current = newProject;
    this.save(data);
  }
  
  getProjectNames() {
    const data = this.load();
    return data.projects.map(project => project.name);
  }
  
  getTodos(projectName) {
    const data = this.load();
    const project = data.projects.find(project => project.name === projectName);
    return project ? project.todos : [];
  }
  
  deleteProject(projectName) {
    const data = this.load();
    const projectIndex = data.projects.findIndex(project => project.name === projectName);
  
    if (projectIndex !== -1) {
      data.projects.splice(projectIndex, 1);
      this.save(data);
    }
  }
  
  newCurrent() {
    const data = this.load();
    const lastCreatedTodo = data.projects[data.projects.length - 1];
    data.current = lastCreatedTodo;
    this.save(data);
  }
  
  toggleTodoStatus(pname, todoId) {
      const todos = this.load();
      const project = todos.projects.find((project) => project.name === pname);
      if (project) {
        const todo = project.todos.find((todo) => todo.ID === todoId);
        if (todo) {
          todo.status = !todo.status;
          this.save(todos);
          return true;
        }
      }
      return false
  }
  
  deleteTodo(pname, todoId) {
    const todos = this.load();
    const project = todos.projects.find((project) => project.name === pname);
  
    if (project) {
      const todoIndex = project.todos.findIndex((todo) => todo.ID === todoId);
  
      if (todoIndex !== -1) {
        project.todos.splice(todoIndex, 1);
        this.save(todos);
        return true;
      }
  }
    return false;
  }

  renameProject(oldName, newName) {
    if (!newName.trim()) throw new Error("Invalid name");
    const todos = this.load();
  
    const projectIndex = todos.projects.findIndex((project) => project.name === oldName);
  
    if (projectIndex !== -1) {
      const nameExists = todos.projects.some((project) => project.name === newName);
  
      if (!nameExists) {
        todos.projects[projectIndex].name = newName;
        this.save(todos);
        return true;
      } else {
        throw new Error('Duplicate project name');
      }
    }
  
    throw new Error('Project not found');
  }
  
  renameTodo(todoId, newName) {
    const todos = this.load();
    let todoFound = false;
  
    todos.projects.forEach((project) => {
      const todo = project.todos.find((todo) => todo.ID == todoId);
      
      if (todo) {
        todo.todo = newName;
        todoFound = true;
      }
    });
  
    if (todoFound) {
      this.save(todos);
      return true;
    }
  
    return false;
  }
  
  clearCompleted (projectName) {
    const todos = this.load();
    const project = todos.projects.find((project) => project.name === projectName);
  
    if (project) {
      project.todos = project.todos.filter((todo) => !todo.status);
      this.save(todos);
      return true;
    }
  
    return false;
  }

}


const sample = {
  "projects": [
    {
      "name": "SamsoN",
      "todos": [
        {
          "todo": "Smeagol",
          "status": true,
          "ID": 1692544911659
        },
        {
          "todo": "Tuva",
          "status": true,
          "ID": 1692544916682
        },
        {
          "todo": "Guva",
          "status": false,
          "ID": 1692544921397
        }
      ]
    },
    {
      "name": "Nanana",
      "todos": [
        {
          "todo": "Deficit",
          "status": false,
          "ID": 1692544930130
        },
        {
          "todo": "Procure",
          "status": false,
          "ID": 1692544936646
        },
        {
          "todo": "Dentine",
          "status": true,
          "ID": 1692544944554
        }
      ]
    }
  ],
  "current": {
    "name": "SamsoN",
    "todos": [
      {
        "todo": "Smeagol",
        "status": true,
        "ID": 1692544911659
      },
      {
        "todo": "Tuva",
        "status": true,
        "ID": 1692544916682
      },
      {
        "todo": "Guva",
        "status": false,
        "ID": 1692544921397
      }
    ]
  }
}