<template>
<li class="item">
  <div class="item__name" @click="$emit('tool-details-requested', tool)">{{ tool.name }}</div>
  <div class="item__state" @click="$emit('state-change-requested', tool)" v-if="loggedIn">
    <div :class="['item__state-side', 'item__state-front', 'item__state--' + tool.currentState.state  ]">
      {{ tool.currentState.state === 'wanted' ? '' : tool.currentState.state }}
      <heart-sparkle v-if="tool.currentState.state === 'wanted'" style="height: 2.2rem; width: 2.2rem;" />
    </div>
    <div :class="['item__state-side', 'item__state-back', 'item__state--' + tool.currentState.state + '-back'  ]">Change</div>
  </div>
</li>
</template>

<script>
import HeartSparkle from '../assets/heart-sparkle.svg';

export default {
  name: 'ToolListItem',
  components: { HeartSparkle },
  props: [ 'tool' ],
  computed: {
    loggedIn () {
      return this.$store.getters['authentication/loggedIn'];
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  display: grid;
  grid-template-columns: 1fr auto;
  // grid-template-rows: auto;
  padding: 4px 0;
  border-top: 1px solid get-color(base, 4);
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid;
  // height: 3.6rem;      

  &__name {
    grid-column: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
    cursor: pointer;
    line-height: 2.6rem;
    // need an explicit height for safari?
    //height: 2.6rem;    
  }    

  &__state {
    grid-column: 2;
    position: relative;
    width: 9rem;
    perspective: 20rem;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 700;
    cursor: pointer;
    //padding: 2px 0;
    text-align: center;
    height: 2.6rem;

    &-side {
      //padding: 2px 2rem;
      border-radius: 4px;
      transition: all .5s;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: calc(2.6rem - 2px);
    }

    &-front {
      color: white;
      background-color: get-color(base, 4);
    }

    &-back {
      border: 1px solid get-color(base, 4);
      background-color: get-color(base, 0);
      transform: rotateX(180deg);
    }

    &:hover &-front {
      transform: rotateX(-180deg);
    }

    &:hover &-back {
      transform: rotateX(0deg);
    }

    &--working {
      @include active-toggle($color-state-working);
    }

    &--working-back {
      @include inactive-toggle($color-state-working);
    }

    &--broken {
      @include active-toggle($color-state-broken);
    }

    &--broken-back {
      @include inactive-toggle($color-state-broken);
    }

    &--partial {
      @include active-toggle($color-state-partial);
    }

    &--partial-back {
      @include inactive-toggle($color-state-partial);
    }

    &--missing {
      @include active-toggle($color-state-missing);
    }

    &--missing-back {
      @include inactive-toggle($color-state-missing);
    }

    &--wanted {
      @include active-toggle(get-color(base, 0));
      color: $color-state-wanted;
      border: 1px dotted $color-state-wanted;
    }

    &--wanted-back {
      @include inactive-toggle($color-state-wanted);
    }


    &--new,&--unknown {
      @include active-toggle(get-color(base, 0));
      color: get-color(base, 12);
      border: 1px dotted get-color(base, 12);
    }

    &--new-back,&--unknown-back {
      @include inactive-toggle(get-color(base, 12));
    }
  }
}
</style>