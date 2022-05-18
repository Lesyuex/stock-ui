<template>
  <ul class="menu">
    <li class="menu-item">
      <i class="el-icon-s-platform"></i>
      <span slot="title">癌股</span>
    </li>
    <li class="menu-item">
      <i class="el-icon-coin"></i>
      <span slot="title">资金</span>
    </li>
    <li class="submenu">
      <div class="menu-item submenu_title">
        <i class="el-icon-s-grid"></i>
        <span>板块</span>
      </div>
      <ul>
        <li class="menu-item">
          <i class="el-icon-place"></i>
          <span>地域</span>
        </li>
        <li class="menu-item">
          <i class="el-icon-office-building"></i>
          <span>行业</span>
        </li>
        <li class="menu-item">
          <i class="el-icon-s-opportunity"></i>
          <span>概念</span>
        </li>
      </ul>
    </li>
    <li class="menu-item">
      <i class="el-icon-star-on"></i>
      <span slot="title">自选</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'LeftMenu',
  mounted () {
    const submenuTitleList = document.getElementsByClassName('submenu_title')
    Array.from(submenuTitleList).forEach(title => {
      title.addEventListener('click', function () {
        const parentNode = title.parentNode
        const ul = parentNode.getElementsByTagName('ul')
        const display = ul[0].style.display === '' ? 'none' : ul[0].style.display
        ul[0].style.display = display === 'none' ? 'block' : 'none'
      })
    })

    const menuItemList = document.getElementsByClassName('menu-item')
    const elements = Array.from(menuItemList)
    elements.forEach((item, index) => {
      item.addEventListener('click', function () {
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
  },
  methods: {
    openSubMenu (e) {
      console.log(e)
      e.target.parentNode.childNodes[3].style.display = 'block'
    },
    activeMenu (e) {
      e.target.classList.add('is-active')
    }
  }
}
</script>

<style scoped lang="less">
ul {

  list-style: none;
  font-size: 18px;
}

.menu {
  width: 140px;

  .menu-item {
    padding: 0 20px;
    line-height: 56px;
    background-color: #142033;
    color: #adb4c2;
    cursor: pointer;
    transition: .5s;

    i {
      width: 24px;
      text-align: center;
      margin-right: 6px;
    }

    &:hover {
      background-color: #000000 !important;
      color: cornflowerblue;
    }
  }

  .is-active {
    color: cornflowerblue;
  }

  .submenu {

    > .menu-item {
      position: relative;
      transition: all 3s;

      &::after {
        content: "";
        position: absolute;
        right: 20px;
        top: 26px;
        width: 6px;
        height: 5px;
        transform: rotate(135deg);
        border-top: 1px solid white;
        border-right: 1px solid white;
      }
    }

    ul {
      display: none;

      .menu-item {
        padding-left: 30px;
        background-color: #121420;
      }
    }
  }
}
</style>
