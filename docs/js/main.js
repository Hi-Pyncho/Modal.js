import Modal from "./Modal.js"

const button = document.querySelector('.ajax')

new Modal({
  trigger: button,
  type: 'text',
  target: 'paragraph',
})
