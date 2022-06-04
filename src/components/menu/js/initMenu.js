
export default function (isTooltipMenu = false) {
  const menuItemList = document.getElementsByClassName('menu-item')
  for (let i = 0; i < menuItemList.length; i++) {
    const menu = menuItemList[i]
    menu.onclick = function () {
      // 点击父菜单
      // if (menu.classList.contains('submenu_title')) return //createMenuStyleSheet 父菜单会覆盖onclick方法
      // 排他
      for (let j = 0; j < menuItemList.length; j++) {
        menuItemList[j].classList.remove('is-active')
      }
      menu.classList.add('is-active')
    }
  }
  createMenuStyleSheet(isTooltipMenu)
}

function createMenuStyleSheet (isTooltipMenu) {
  const styleSheet = document.styleSheets
  // 找到拥有子菜单的父菜单
  const submenuTitleList = document.getElementsByClassName('submenu_title')
  const menuKeyframes = {}
  for (let i = 0; i < submenuTitleList.length; i++) {
    // div.submenu_title
    const submenuTitle = submenuTitleList[i]
    // 获取ul
    const chilMenuUl = getSibing(submenuTitle)
    const li = chilMenuUl.getElementsByTagName('li')
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
      submenuTitle.setAttribute('aria-expanded', 'true')
    }
    const hideMenu = function (menu) {
      menu.style.animation = `${hide} .3s ease-out forwards`
      submenuTitle.setAttribute('aria-expanded', 'false')
    }
    const showTip = function (isOpen) {
      const tip = submenuTitle.querySelector('.tip')
      tip.style.transform = isOpen === 'true' ? 'rotate(-180deg)' : null
    }
    const handle = function (menu, expanded) {
      expanded === 'true' ? showMenu(menu) : hideMenu(menu)
      if (!isTooltipMenu) {
        showTip(expanded)
      }
    }
    const expanded = submenuTitle.getAttribute('aria-expanded')
    handle(chilMenuUl, expanded)
    submenuTitle.onclick = function () {
      const currentOpenStatus = submenuTitle.getAttribute('aria-expanded')
      const expanded = currentOpenStatus === 'true' ? 'false' : 'true'
      handle(chilMenuUl, expanded)
    }
  }
}

function getSibing (element) {
  return element.nextElementSibling
}
