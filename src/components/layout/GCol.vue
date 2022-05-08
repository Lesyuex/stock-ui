<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    span: [String, Number],
    sm: [String, Number],
    md: [String, Number],
    lg: [String, Number]
  },
  name: 'GCol',
  watch: {
    span: function (){
      this.initClass()
    },
    sm: function () {
      this.initClass()
    },
    md:  function () {
      this.initClass()
    },
    lg: function () {
      this.initClass()
    }
  },
  data () {
    return {
      classList: ['g-col']
    }
  },
  created () {
    this.initClass()
  },
  methods: {
    initClass () {
      if (this.$props.span) {
        const span = this.$props.span
        this.classList.push(`g-col-${span}`)
      }
      if (this.$props.sm) {
        const span = this.$props.sm
        this.classList.push(`col-sm-${span}`)
      }
      if (this.$props.md) {
        const span = this.$props.md
        this.classList.push(`col-md-${span}`)
      }
      if (this.$props.lg) {
        const span = this.$props.lg
        this.classList.push(`col-lg-${span}`)
      }
    }
  }
}
</script>

<style scoped lang="less">
@unit-width: 100%/24;
@green: #21bf74;
@red: red;
@blue: skyblue;
/*默认布局*/
.g-col{
  width: (@unit-width)*24;
  min-height: 1px;
}
.g-col-1 {
  width: (@unit-width)*1;
}
.g-col-2 {
  width: (@unit-width)*2;
}
.g-col-3 {
  width: (@unit-width)*3;
}
.g-col-4 {
  width: (@unit-width)*4;
}
.g-col-5 {
  width: (@unit-width)*5;
}
.g-col-6 {
  width: (@unit-width)*6;
}
.g-col-7 {
  width: (@unit-width)*7;
}
.g-col-8 {
  width: (@unit-width)*8;
}
.g-col-9 {
  width: (@unit-width)*9;
}
.g-col-10 {
  width: (@unit-width)*10;
}
.g-col-11 {
  width: (@unit-width)*11;
}
.g-col-12 {
  width: (@unit-width)*12;
}
.g-col-13 {
  width: (@unit-width)*13;
}
.g-col-14 {
  width: (@unit-width)*14;
}
.g-col-15 {
  width: (@unit-width)*15;
}
.g-col-16 {
  width: (@unit-width)*16;
}
.g-col-17 {
  width: (@unit-width)*17;
}
.g-col-18 {
  width: (@unit-width)*18;
}
.g-col-19 {
  width: (@unit-width)*19;
}
.g-col-20 {
  width: (@unit-width)*20;
}
.g-col-21 {
  width: (@unit-width)*21;
}
.g-col-22 {
  width: (@unit-width)*22;
}
.g-col-23 {
  width: (@unit-width)*23;
}
.g-col-24 {
  width: (@unit-width)*24;
}
/*小屏 把中屏大屏隐藏*/
@media screen and (max-width: 1920px) {
  .g-col {
   // background-color: pink;
    width: 1280px;
  }

  .col-sm-1 {
    width: (@unit-width)*1;
  }

  .col-sm-2 {
    width: (@unit-width)*2;
  }

  .col-sm-3 {
    width: (@unit-width)*3;
  }

  .col-sm-4 {
    width: (@unit-width)*4;
  }

  .col-sm-5 {
    width: (@unit-width)*5;
  }

  .col-sm-6 {
    width: (@unit-width)*6;
  }

  .col-sm-7 {
    width: (@unit-width)*7;
  }

  .col-sm-8 {
    width: (@unit-width)*8;
  }

  .col-sm-9 {
    width: (@unit-width)*9;
  }

  .col-sm-10 {
    width: (@unit-width)*10;
  }

  .col-sm-11 {
    width: (@unit-width)*11;
  }

  .col-sm-12 {
    width: (@unit-width)*12;
  }

  .col-sm-13 {
    width: (@unit-width)*13;
  }

  .col-sm-14 {
    width: (@unit-width)*14;
  }

  .col-sm-15 {
    width: (@unit-width)*15;
  }

  .col-sm-16 {
    width: (@unit-width)*16;
  }

  .col-sm-17 {
    width: (@unit-width)*17;
  }

  .col-sm-18 {
    width: (@unit-width)*18;
  }

  .col-sm-19 {
    width: (@unit-width)*19;
  }

  .col-sm-20 {
    width: (@unit-width)*20;
  }

  .col-sm-21 {
    width: (@unit-width)*21;
  }

  .col-sm-22 {
    width: (@unit-width)*22;
  }

  .col-sm-23 {
    width: (@unit-width)*23;
  }

  .col-sm-24 {
    width: (@unit-width)*24;
  }
}

/*中屏*/
@media screen and (min-width: 1920px) {
  .g-col {
    //background-color: #21bf74;
  }
  .col-md-1 {
    width: (@unit-width)*1;
  }

  .col-md-2 {
    width: (@unit-width)*2;
  }

  .col-md-3 {
    width: (@unit-width)*3;
  }

  .col-md-4 {
    width: (@unit-width)*4;
  }

  .col-md-5 {
    width: (@unit-width)*5;
  }

  .col-md-6 {
    width: (@unit-width)*6;
  }

  .col-md-7 {
    width: (@unit-width)*7;
  }

  .col-md-8 {
    width: (@unit-width)*8;
  }

  .col-md-9 {
    width: (@unit-width)*9;
  }

  .col-md-10 {
    width: (@unit-width)*10;
  }

  .col-md-11 {
    width: (@unit-width)*11;
  }

  .col-md-12 {
    width: (@unit-width)*12;
  }

  .col-md-13 {
    width: (@unit-width)*13;
  }

  .col-md-14 {
    width: (@unit-width)*14;
  }

  .col-md-15 {
    width: (@unit-width)*15;
  }

  .col-md-16 {
    width: (@unit-width)*16;
  }

  .col-md-17 {
    width: (@unit-width)*17;
  }

  .col-md-18 {
    width: (@unit-width)*18;
  }

  .col-md-19 {
    width: (@unit-width)*19;
  }

  .col-md-20 {
    width: (@unit-width)*20;
  }

  .col-md-21 {
    width: (@unit-width)*21;
  }

  .col-md-22 {
    width: (@unit-width)*22;
  }

  .col-md-23 {
    width: (@unit-width)*23;
  }

  .col-md-24 {
    width: (@unit-width)*24;
  }
}

/*大屏*/
@media screen and (min-width: 1920px) {
  .g-col {
    //background-color: @red;
  }

  .col-lg-1 {
    width: (@unit-width)*1;
  }

  .col-lg-2 {
    width: (@unit-width)*2;
  }

  .col-lg-3 {
    width: (@unit-width)*3;
  }

  .col-lg-4 {
    width: (@unit-width)*4;
  }

  .col-lg-5 {
    width: (@unit-width)*5;
  }

  .col-lg-6 {
    width: (@unit-width)*6;
  }

  .col-lg-7 {
    width: (@unit-width)*7;
  }

  .col-lg-8 {
    width: (@unit-width)*8;
  }

  .col-lg-9 {
    width: (@unit-width)*9;
  }

  .col-lg-10 {
    width: (@unit-width)*10;
  }

  .col-lg-11 {
    width: (@unit-width)*11;
  }

  .col-lg-12 {
    width: (@unit-width)*12;
  }

  .col-lg-13 {
    width: (@unit-width)*13;
  }

  .col-lg-14 {
    width: (@unit-width)*14;
  }

  .col-lg-15 {
    width: (@unit-width)*15;
  }

  .col-lg-16 {
    width: (@unit-width)*16;
  }

  .col-lg-17 {
    width: (@unit-width)*17;
  }

  .col-lg-18 {
    width: (@unit-width)*18;
  }

  .col-lg-19 {
    width: (@unit-width)*19;
  }

  .col-lg-20 {
    width: (@unit-width)*20;
  }

  .col-lg-21 {
    width: (@unit-width)*21;
  }

  .col-lg-22 {
    width: (@unit-width)*22;
  }

  .col-lg-23 {
    width: (@unit-width)*23;
  }

  .col-lg-24 {
    width: (@unit-width)*24;
  }
}

</style>
