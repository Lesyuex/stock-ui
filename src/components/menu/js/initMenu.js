export default function () {
  const styleSheet = document.styleSheets
  const submenuTitleList = document.getElementsByClassName('submenu_title')
  const menuKeyframes = {}
  const height = 56
  Array.from(submenuTitleList).forEach(title => {
    const parentNode = title.parentNode
    const open = title.getAttribute('aria-expanded')
    const menu = parentNode.querySelector('ul.menu')
    const li = menu.querySelectorAll(':scope > li')
    const chilLength = li.length
    const s = `s${chilLength}ChilMenu`
    const h = `h${chilLength}ChilMenu`
    if (!menuKeyframes[s]) {
      const maxHeight = height * chilLength
      console.log(maxHeight)
      menuKeyframes[s] = `@keyframes ${s}{from{height: 0;display:block}to{height: ${maxHeight + 8}px;}}`
      menuKeyframes[h] = `@keyframes ${h}{from{height: ${maxHeight}px;}to{height: 0;}}`
      styleSheet[0].insertRule(menuKeyframes[s])
      styleSheet[0].insertRule(menuKeyframes[h])
    }
    const show = function (menu) {
      menu.style.animation = `${s} .3s ease-in-out`
      menu.setAttribute('aria-expanded', 'true')
    }
    const hide = function (menu) {
      menu.style.animation = `${h} .3s ease-out forwards`
      menu.setAttribute('aria-expanded', 'false')
    }
    const showTip = function (isOpen) {
      const tip = parentNode.querySelectorAll('i.tip')[0]
      tip.style.transform = isOpen === 'true' ? 'rotate(-180deg)' : null
    }
    const handle = function (menu, open) {
      open === 'true' ? show(menu) : hide(menu)
      showTip(open)
    }
    handle(menu, open)
    title.addEventListener('click', function () {
      const currentOpenStatus = menu.getAttribute('aria-expanded')
      const to = currentOpenStatus === 'true' ? 'false' : 'true'
      handle(menu, to)
    })
  })

  const menuItemList = document.getElementsByClassName('menu-item')
  const elements = Array.from(menuItemList)
  elements.forEach((item, index) => {
    item.addEventListener('click', function () {
      if (item.classList.contains('submenu_title')) return
      if (!item.classList.contains('is-active')) {
        item.classList.add('is-active')
      }
      elements.forEach((el, elIndex) => {
        if (elIndex !== index) {
          const active = el.classList.contains('is-active')
          if (active) {
            el.classList.remove('is-active')
          }
        }
      })
    })
  })
}
