export const Util = {
  confirm (expr) { return window.confirm(expr) },
  htmlToNode(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.firstChild;
  },
  prepareModal (modal, okFunc) {
    modal.classList.add('active');
    document.body.appendChild(modal);
    const dismiss = () => {
      modal.classList.remove('active');
      modal.remove();
    }
    
    const sendValue = () => {
      okFunc('worked')
      dismiss();
    }
    
    const ok = modal.querySelector('.ok'),
      cancel = modal.querySelector('.cancel');
      
    modal.addEventListener('click', (event) => {
      if (event.target === modal) dismiss();
    })
    ok.addEventListener('click', sendValue);
    cancel.addEventListener('click', dismiss);
  }
}

export const Templates = {
  projectCard (name) {
    return Util.htmlToNode(`
        <div class = "card" >
            <p class="project-name">${name}</p>
            <div class="custom">
              <span class="edit">
                <img src="res/edit.svg" alt="edit">
              </span>
              <span class="delete" >
                <img src="res/delete.svg" alt="delete">
              </span>
            </div>
        </div>`);
  },
  taskCard (current) {
    let status = current.status ? 'done' : '';
    let task = current.todo;
  
    return Util.htmlToNode(`
      <div class="task-card ${status}" id="${current.ID}">
        <p class="task-name">${task}</p>
        <div class="custom">
          <span class="edit">
            <img src="res/edit.svg" alt="edit">
          </span>
          <span class="delete" >
            <img src="res/delete.svg" alt="delete">
          </span>
      </div>
    `);
  },
  getModal (modalHero, placeholder='') {
    return Util.htmlToNode(`
      <div class="modal-overlay">
          <div class="new-project">
            <p>${modalHero}</p>
            <input type="text" placeholder="${placeholder}">
            <div class="btn">
              <button class="cancel">Cancel</button>
              <button class="ok">OK</button>
            </div>
          </div>
        </div>
    `)
  }
    
}


export class modalT {
  constructor (modalHero, okFunc, value='', placeholder='') {
    this.modalHero = modalHero;
    this.placeholder = placeholder;
    this.value = value;
    this.okFunc = okFunc;
  }
  
  getModal () {
      return Util.htmlToNode(`
        <div class="modal-overlay">
            <div class="new-project">
              <p>${this.modalHero}</p>
              <input value="${this.value}"type="text" placeholder="${this.placeholder}">
              <div class="btn">
                <button class="cancel">Cancel</button>
                <button class="ok">OK</button>
              </div>
            </div>
          </div>
      `);
  }
  
  activateModal(cardID) {
    let modal = this.getModal();
    modal.classList.add('active');
    document.body.appendChild(modal);
    
    const dismiss = () => {
      modal.classList.remove('active');
      modal.remove();
    }
  
    const sendValue = () => {
      this.okFunc(this.value, input.value, cardID);
      dismiss();
    }
  
    const ok = modal.querySelector('.ok'),
      cancel = modal.querySelector('.cancel'),
      input = modal.querySelector('input');
  
    input.focus();
    input.setSelectionRange(-1, -1)  // Front of input;
    modal.addEventListener('click', (event) => {
      if (event.target === modal) dismiss();
    });
    
    ok.addEventListener('click', sendValue);
    cancel.addEventListener('click', dismiss);
    input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        sendValue();
      }
    })
  }
}