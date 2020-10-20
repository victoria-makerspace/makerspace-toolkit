<template>
  <button
    @click="$emit('click')"
    :aria-pressed="pressed"
    :disabled="disabled"
    :class="['tool-state-toggle', ('tool-state-toggle--' + state + (pressed ? '-active' : ''))]"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ToolStateToggle",
  props: {
    state: String,
    pressed: Boolean,
    disabled: { type: Boolean, default: false }
  }
};
</script>

<style scoped lang="scss">
.tool-state-toggle {
  &---active {
    @include active-toggle(get-color(base, 16));
  }

  &-- {
    @include inactive-toggle(get-color(base, 16));
  }

  &--working-active {
    @include active-toggle($color-state-working);
  }

  &--working {
    @include inactive-toggle($color-state-working);
  }

  &--broken-active {
    @include active-toggle($color-state-broken);
  }

  &--broken {
    @include inactive-toggle($color-state-broken);
  }

  &--partial-active {
    @include active-toggle($color-state-partial);
  }

  &--partial {
    @include inactive-toggle($color-state-partial);
  }

  &--missing-active {
    @include active-toggle($color-state-missing);
  }

  &--missing {
    @include inactive-toggle($color-state-missing);
  }

  &--new-active,
  &--unknown-active {
    @include active-toggle(#666);
  }

  &--new,
  &--unknown {
    @include inactive-toggle(#666);
  }

  &--wanted-active {
    @include active-toggle($color-state-wanted);
  }

  &--wanted {
    @include inactive-toggle($color-state-wanted);
  }
}
</style>