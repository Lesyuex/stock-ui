
export default function (isTooltipMenu = false) {
  const styleSheet = document.styleSheets
  // 查询到所有父菜单
  const submenuTitleList = document.getElementsByClassName('submenu_title')
  const menuKeyframes = {}
  Array.from(submenuTitleList).forEach(title => {
    // 父元素submenu
    const parentNode = title.parentNode
    const open = title.getAttribute('aria-expanded')
    const menu = parentNode.querySelector('ul.menu')
    const li = menu.querySelectorAll(':scope > li')
    const height = li[0].offsetHeight
    const chilLength = li.length
    // 展开过度动画
    const show = `smenu${chilLength}`
    // 关闭动画
    const hide = `hmenu${chilLength}`
    // 查询有没有定义动画 没定义则定义动画（每个menu的高度不确定，不能写死height）
    if (!menuKeyframes[show]) {
      // 总高度
      const maxHeight = height * chilLength + 4
      menuKeyframes[show] = `@keyframes ${show}{from{height: 0;display:block}to{height: ${maxHeight}px;}}`
      menuKeyframes[hide] = `@keyframes ${hide}{from{height: ${maxHeight}px;}to{height: 0;}}`
      styleSheet[0].insertRule(menuKeyframes[show])
      styleSheet[0].insertRule(menuKeyframes[hide])
    }
    const showMenu = function (menu) {
      menu.style.animation = `${show} .3s ease-in-out`
      menu.setAttribute('aria-expanded', 'true')
    }
    const hideMenu = function (menu) {
      menu.style.animation = `${hide} .3s ease-out forwards`
      menu.setAttribute('aria-expanded', 'false')
    }
    const showTip = function (isOpen) {
      const tip = parentNode.querySelectorAll('span.tip')[0]
      tip.style.transform = isOpen === 'true' ? 'rotate(-180deg)' : null
    }
    const handle = function (menu, open) {
      open === 'true' ? showMenu(menu) : hideMenu(menu)
      if (!isTooltipMenu) {
        showTip(open)
      }
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
