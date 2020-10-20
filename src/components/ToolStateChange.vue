<template>
<div class="tool-state__container">
  <close-dialog-button @click="$emit('cancel')"></close-dialog-button>
  <h1 class="tool-state__title"><span class="weak">The </span>{{ tool.name }}...</h1>
  <div class="tool-state__current">
    <h2 class="tool-state__current-title">was...</h2>
    <tool-state-toggle :disabled="true" :state="tool.currentState.state" :pressed="newState.state === ''" style="width: 100%; opacity: 1;">
      {{ tool.currentState.state }}
    </tool-state-toggle>
    <div class="tool-state__current-changed-date">
      {{ tool.currentState.whenChanged | moment("calendar") }}
    </div>
    <div class="tool-state__current-changed-date">
      According to {{ tool.currentState.whoChanged }}
    </div>
    <div v-if="tool.currentState.note" class="tool-state__current-note">
      <strong>Note</strong><br />
      {{ tool.currentState.note }}
    </div>
  </div>
  <div class="tool-state__new">
    <h2 class="tool-state__new-title">and is now...</h2>
    <div class="tool-state__possible-state" v-for="state in possibleStates" :key="state.name" @click="setNewState(state.name)" >
      <tool-state-toggle :state="state.name" :pressed="newState.state === state.name" @click="setNewState(state.name)">
        <span class="weak">{{ (tool.currentState.state === state.name ? 'still ' : '') }}</span>
        {{ state.name }}
      </tool-state-toggle>
      <span class="tool-state__description"> - {{ state.description }}</span>
    </div>
    <div class="tool-state__new-note">
      <div class="tool-state__label-and-input">      
        <label class="tool-state__field-label" for="toolDescription">Why the change?</label>
        <textarea
          id="stateNote"
          v-model="newState.note"
          placeholder=""
          class="tool-state__text-input"
          style="height: 10rem;"
        />
      </div>

    </div>
  </div>
  <div class="dialog-buttons">
    <button class="button-cancel" @click="$emit('cancel')">Cancel</button>
    <button class="button-save" @click="submitStateChange" :disabled="newState.state === ''">Save Change</button>
  </div>
</div>
</template>

<script>
import ToolStateToggle from "./ToolStateToggle";
import CloseDialogButton from "./CloseDialogButton";

export default {
  name: 'ToolStateChange',
  components: { ToolStateToggle, CloseDialogButton },
  props: [ 'tool' ],
  data() {
    return {
      possibleStates: [
        {name: 'working', description: 'the tool is fully functional'},
        {name: 'broken', description: 'unusuable and needs repair'},
        {name: 'missing', description: 'misplaced and not (easily) found'},
        {name: 'partial', description: 'works in a limited way with caveats'},
        {name: 'wanted', description: 'we don\'t have on of these...yet'},
        {name: 'unknown', description: 'the state of this tool is a complete mystery'}
      ],
      newState: { state: '', note: '' }
    };
  },
  methods: {
    setNewState: function (state) {
      this.newState.state = state;
    },
    submitStateChange: function () {
      this.$http.post('tools/' + this.tool.id + '/states', this.newState)
        .then(response => {
          this.tool.currentState = response.data;
          this.$emit('state-changed');
        }
      );
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-buttons {
  margin-top: 3rem;
  grid-column: 1 / span 2;
}

.button-cancel {
  float: left;
}

.button-save {
  float: right;
}

.tool-state {
  &__container {
    position: relative;
    margin: 3rem;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
  }

  &__title {
    text-align: left;
    font-size: 2.4rem;    
    font-weight: 400;
    grid-column: 1 / span 2;
    grid-row: 1;
  }

  &__current {
    grid-column: 1;
    grid-row: 2;
    text-align: left;
    width: 14rem;
    margin-right: 1rem;
  }

  &__current-title {
    font-weight: 400;
    font-size: 2rem;
    margin-bottom: .5rem;
  }

  &__current-changed-date {
    margin-top: 0.2rem;
    font-size: 1.2rem;
  }

  &__current-note {
    margin-top: 0.5rem;    
    font-size: 1.4rem;
    overflow-y: auto;
  }    

  &__new {
    grid-column: 2;
    grid-row: 2;
    text-align: left;
  }

  &__new-title {
    font-weight: 400;
    font-size: 2rem;
    margin-bottom: .5rem;    
  }

  &__possible-state {
    white-space: nowrap;
    display: grid;
    margin-bottom: .5rem;
    grid-template-columns: 14rem 1fr;
  }

  &__description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid #ccc;
    font-size: 1.5rem;
    margin: auto 0;
    padding: 5px;
  }

  &__new-note {
    margin-top: 1rem;
  }

  &__note-input {
    width: 100%;
    height: 6rem;
    border: 1px solid get-color(base, 4);
    border-radius: $border-radius-medium;
  }

  &__label-and-input {
    position: relative;
    margin: .5rem 0;
  }

  &__field-label {
    position: absolute;
    padding: .25rem 1rem;
    font-size: 1.2rem;
    text-transform: uppercase;
  }  

  &__text-input {
    border-radius: $border-radius-medium;    
    transition: all 0.5s;
    padding: 1.8rem 0 .5rem 1rem;
    font-size: 1.6rem;
    border: 1px solid get-color(base, 6);
    color: get-color(base, 16);
    width: 100%;
    box-shadow: inset .2rem .5rem 1rem #00000011;
    resize: vertical;

    &--tool-name {
      // white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;    
      margin: .5rem 0;
      padding: 1rem;
      padding-right: 0;
      font-size: 2.4rem;
      position: relative;
    }

    &:disabled {
      border: 1px solid transparent;
      color: get-color(base, 16);
      outline: none;
      box-shadow: none;   
      resize: none;
    }
  } 
}
</style>