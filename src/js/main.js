// import '../../dist/Modal.min.js'
const button = document.querySelector('.ajax')

new Modal({
  trigger: button,
  type: 'text',
  target: 'paragraph',
})
