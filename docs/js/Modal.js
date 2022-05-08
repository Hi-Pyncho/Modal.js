import 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.6/purify.min.js'

export default class Modal {
  constructor({
    zIndex = 100,
    type,
    target,
    trigger,
    modalWidth = '90%',
    modalHeight = 'auto',
    needFindTriggers = true,
    context,
    emptyInit = false,
    openNow = false,
    display = 'block',
  }) {
    this.zIndex = zIndex
    this.type = type
    this.target = target
    this.prefix = 'm-modal'
    this.trigger = trigger
    this.wrapper = this.createOuterWrapper()
    this.innerWrapper = this.createInnerWrapper()
    this.closeElement = this.createCloseElement()
    this.overlay = this.createOverlay()
    this.modalWidth = modalWidth
    this.modalHeight = modalHeight
    this.needFindTriggers = needFindTriggers
    this.context = context
    this.contentAdded = false
    this.emptyInit = emptyInit
    this.openNow = openNow
    this.display = display
    if(this.needFindTriggers) {
      this.findTriggers()
    }
    if(!this.emptyInit) {
      this.triggerHandler()
    }
    if(this.openNow) {
      this.justOpen()
    }
  }

  async justOpen() {
    await this.setOptions()
    await this.createModal()
    await this.openModal()
    await this.addListeners()
  }

  static init() {
    return new this({emptyInit: true})
  }
  createOverlay() {
    const overlay = document.createElement('div')
    overlay.classList.add(`${this.prefix}-overlay`)

    return overlay
  }
  async findTriggers(context = document) {
    const triggers = context.querySelectorAll('[data-m-modal]')
    if(triggers.length === 0) return

    triggers.forEach(trigger => {
      const type = trigger.dataset.type
      const target = trigger.dataset.target
      const modalWidth = trigger.dataset.width
      const modalHeight = trigger.dataset.height
      const zIndex = trigger.dataset.zIndex
      const display = trigger.dataset.display
      trigger.removeAttribute('data-m-modal')
      
      new Modal({trigger,target,type,needFindTriggers: false, context, modalWidth, modalHeight, zIndex, display})
    })
  }
  createCloseElement() {
    const close = document.createElement('button')
    close.setAttribute('type', 'button')
    close.classList.add(`${this.prefix}-close`)
    
    return close
  }
  blockHTML() {
    document.documentElement.style.overflow = 'hidden'
  }
  unblockHTML() {
    document.documentElement.style.overflow = 'initial'
  }
  createOuterWrapper() {
    const wrapper = document.createElement('div')
    wrapper.classList.add(`${this.prefix}-wrapper`)

    return wrapper
  }
  createInnerWrapper() {
    const wrapper = document.createElement('div')
    wrapper.classList.add(`${this.prefix}-inner-wrapper`)

    return wrapper
  }
  async createModal() {
    this.wrapper.append(this.closeElement)
    this.wrapper.append(this.innerWrapper)
    this.overlay.append(this.wrapper)

    if(!this.contentAdded) {
      await this.putContent(this.innerWrapper)
    }

    document.body.append(this.overlay)
    this.contentAdded = true
  }
  async putContent(container) {
    switch (this.type) {
      case 'ajax':
        const data = await this.fetchData()
        const cleanData = DOMPurify.sanitize(data)
        container.innerHTML = cleanData
        return
      case 'selector':
        container.append(this.getNodeBySelector())
        return
      case 'image':
        container.append(this.createImage())
        break;
      case 'node':
        container.append(this.target)
        break;
      case 'text':
        container.append(this.createTextNode(this.target))
        break;
    }
  }
  createTextNode(text) {
    const paragraph = document.createElement('p')
    paragraph.classList.add(`${this.prefix}-text`)
    paragraph.textContent = text

    return paragraph
  }
  getNodeBySelector() {
    const node = document.querySelector(this.target).cloneNode(true)
    node.style.display = this.display

    return node
  }
  createImage() {
    const image = document.createElement('img')
    image.src = this.target
    image.style.maxWidth = '100%'
    image.style.display = 'block'

    return image
  }
  closeModal() {
    this.unblockHTML()
    this.overlay.classList.remove(`${this.prefix}-overlay--active`)
    setTimeout(() => {
      this.overlay.remove()
      delete this
    }, 500);
  }
  async openModal() {
    this.blockHTML()
    this.overlay.classList.add(`${this.prefix}-overlay--active`)
  }
  closeButtonHandler() {
    this.closeElement.addEventListener('click', () => this.closeModal())
  }
  overlayHandler() {
    this.overlay.addEventListener('click', (event) => {
      if(!event.target.matches(`.${this.prefix}-overlay`)) return
      this.closeModal()
    })
  }
  escButtonHandler() {
    document.onkeydown = (evt) => {
      evt = evt || window.event;
      let isEscape = false;
    
      if ("key" in evt) {
          isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
          isEscape = (evt.keyCode === 27);
      }
      
      if (isEscape) {
         this.closeModal()
      }
    };
  }
  async setOptions() {
    document.documentElement.style = `--m-modal-z-index: ${this.zIndex}`
    document.documentElement.style = `--m-modal-width: ${this.modalWidth}`
    document.documentElement.style = `--m-modal-height: ${this.modalHeight}`
  }
  triggerHandler() {
    this.trigger.addEventListener('click', async () => {
      await this.setOptions()
      await this.createModal()
      await this.openModal()
      await this.addListeners()
      await this.findTriggers(this.wrapper)
      await this.triggerCustomEvent()
    })
  }

  triggerCustomEvent() { 
    const event = new CustomEvent('m-modal', {
      detail: {
        wrapper: this.wrapper
      }
    })
  
    document.dispatchEvent(event)
  }

  async addListeners() {
    this.overlayHandler()
    this.closeButtonHandler()
    this.triggerHandler()
    this.escButtonHandler()
  }

  async fetchData() {
    const request = await fetch(this.target)
    const response = await request.text()

    return response
  }
}



