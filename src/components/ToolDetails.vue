<template>
  <div class="tool-details__container">
    <close-dialog-button @click="$emit('cancel')"></close-dialog-button>

    <div class="tool-details__edit-delete" v-if="loggedIn">
      <button @click="toggleEditMode" v-if="!editMode" class="tool-details__edit-delete-button">
        <edit-icon class="borderless" style="width: 24px; height: 24px;"></edit-icon>
      </button>
      <button @click="deleteTool" v-if="!editMode" class="tool-details__edit-delete-button">
        <delete-icon class="borderless" style="width: 24px; height: 24px;"></delete-icon>
      </button>
    </div>

    <div style="position: relative;">
      <div
        class="tool-details__text-input tool-details__text-input--tool-name"
        style="opacity: 0; margin-right: 2rem; height: 4.5rem;"
      >{{ toolWithHistory.name }}</div>
      <input
        id="toolName"
        type="text"
        v-model="toolWithHistory.name"
        placeholder="tool name"
        :disabled="!editMode"
        class="tool-details__text-input tool-details__text-input--tool-name"
        style="top: -5.5rem; margin-bottom: -5.5rem;"
        required
      />
    </div>
    <div class="tool-details__details-history-container">
      <div class="tool-details__details">
        <div class="tool-details__label-and-input">
          <label class="tool-details__field-label" for="toolDomain">Domain</label>
          <select
            id="toolDomain"
            class="tool-details__select"
            v-model="toolWithHistory.domain"
            :disabled="!editMode"
          >
            <option>woodshop</option>
            <option>cold metal shop</option>
            <option>electronics</option>
            <option>hot metal shed</option>
          </select>
        </div>
        <div class="tool-details__label-and-input">
          <label class="tool-details__field-label" for="toolCategory">Category</label>
          <input
            id="toolCategory"
            type="text"
            v-model="toolWithHistory.category"
            placeholder="category"
            list="tool-categories"
            :disabled="!editMode"
            class="tool-details__text-input"
          />
          <datalist id="tool-categories">
            <option v-for="(cat, index) in availableCategories" :key="index" :value="cat" />
          </datalist>
        </div>
        <div class="tool-details__label-and-input">
          <label class="tool-details__field-label" for="toolLocation">Usual Location</label>
          <input
            id="toolLocation"
            type="text"
            v-model="toolWithHistory.homeLocation"
            placeholder="Where can it be found?"
            :disabled="!editMode"
            class="tool-details__text-input"
          />
        </div>
        <div class="tool-details__label-and-input">
          <label class="tool-details__field-label" for="toolDescription">Description/Notes</label>
          <textarea
            id="toolDescription"
            v-model="toolWithHistory.description"
            placeholder="No description so far."
            :disabled="!editMode"
            class="tool-details__text-input"
            style="height: 8rem;"
          />
        </div>
        <div class="tool-details__control-buttons">
          <button
            @click="cancelChanges"
            :style="{visibility: editMode ? 'visible' : 'hidden'}"
            class="tool-details__control-buttons--cancel"
          >Cancel</button>
          <button
            @click="saveChanges"
            :disabled="toolWithHistory.name === ''"
            :style="{visibility: editMode ? 'visible' : 'hidden'}"
            class="tool-details__control-buttons--save"
          >Save Changes</button>
        </div>
      </div>

      <div v-if="sortedHistory.length > 0" class="tool-details__history">
        <div class="tool-details__transition-line"></div>
        <div class="tool-details__history-title">Recent History</div>
        <template v-for="s in sortedHistory">
          <div
            :class="['tool-details__state-marker', 'tool-details__state-marker--' + s.state]"
            :key="s.id"
          >{{ s.state.substring(0, 2) }}</div>
          <div style="grid-column: 2" :key="s.id">
            <div class="tool-details__state-changed-time">
              {{ s.whenChanged | moment("calendar") }} according to {{ s.whoChanged }} this tool was
              <span
                :class="['tool-details__state--' + s.state]"
              >{{ s.state }}</span>
            </div>
            <div class="tool-details__state-note">{{ s.note }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CloseDialogButton from "./CloseDialogButton";
import EditIcon from "../assets/edit.svg";
import DeleteIcon from "../assets/trash.svg";

export default {
  name: "ToolDetails",
  components: { CloseDialogButton, EditIcon, DeleteIcon },
  props: ["tool", "availableCategories"],
  data() {
    return {
      toolWithHistory: this.tool,
      editMode: false
    };
  },
  mounted() {
    if (!this.tool.id) {
      this.editMode = true;
    } else {
      this.$http.get("tools/" + this.tool.id).then(response => {
        this.toolWithHistory = response.data;
      });
    }
  },
  methods: {
    toggleEditMode: function() {
      this.editMode = !this.editMode;
    },
    saveChanges: function() {
      if (!this.toolWithHistory.id) {
        this.$http.post("tools/", this.toolWithHistory).then(response => {
          this.toolWithHistory = response.data;
          this.$emit("tool-added", this.toolWithHistory);
        });
      } else {
        this.$http
          .put("tools/" + this.toolWithHistory.id, this.toolWithHistory)
          .then(() => {
            this.$emit("tool-updated", this.toolWithHistory);
          });
      }
    },
    cancelChanges: function() {
      // if it's a brand new new tool, might as well cancel the "edit"
      if (!this.toolWithHistory.id) {
        this.$emit("cancel");
        return;
      }

      this.editMode = false;

      this.$http.get("tools/" + this.tool.id).then(response => {
        this.toolWithHistory = response.data;
      });
    },
    deleteTool: function() {
      if (
        confirm(
          "This tool (and its history) will be gone for good. Are you sure you want to delete?"
        )
      ) {
        this.$http.delete("tools/" + this.toolWithHistory.id);
        this.$emit("tool-deleted", this.toolWithHistory);
      }
    },
    reverseArray: function(arr) {
      var newArray = [];
      for (var i = arr.length - 1; i >= 0; i--) {
        newArray.push(arr[i]);
      }
      return newArray;
    }
  },
  computed: {
    sortedHistory() {
      return this.reverseArray(this.toolWithHistory.stateHistory);
    },
    loggedIn () {
      return this.$store.getters['authentication/loggedIn'];
    }
  }
};
</script>

<style scoped lang="scss">
input,
select {
  display: block;
}

.tool-details {
  &__container {
    margin: 3rem 3rem 3rem 4rem;
    position: relative;
  }

  &__details-history-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
  }

  &__details {
    flex-grow: 1;
  }

  &__history {
    display: grid;
    padding: 0.6rem;
    margin: 0.4rem;
    border-radius: $border-radius-medium;
    background-color: get-color(base, 1);
    grid-template-columns: 4.2rem 24rem;
    grid-template-rows: auto auto auto auto auto auto auto 1fr;
    position: relative;
    flex-grow: 1;
  }

  &__history-title {
    font-size: 1.4rem;
    text-transform: uppercase;
    margin: 0 0 0.5rem 0;
    grid-column: 2;
  }

  &__label-and-input {
    position: relative;
    margin: 0.5rem 0;
  }

  &__field-label {
    position: absolute;
    padding: 0.25rem 1rem;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  &__text-input {
    border-radius: $border-radius-medium;
    transition: all 0.5s;
    padding: 1.8rem 0 0.5rem 1rem;
    font-size: 1.6rem;
    border: 1px solid get-color(base, 6);
    // border: 1px solid transparent;
    background-color: get-color(base, 0);    
    width: 100%;
    box-shadow: inset 0.2rem 0.5rem 1rem #00000011;
    resize: vertical;

    &--tool-name {
      // white-space: nowrap;
      border-bottom: 1px solid get-color(base, 6);
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0.5rem 0;
      padding: 1rem;
      padding-right: 0;
      font-size: 2.4rem;
      position: relative;
    }

    &:disabled {
      border: 1px solid transparent;
      background-color: get-color(base, 0);  
      opacity: 1;
      outline: none;
      box-shadow: none;
      resize: none;
    }
  }

  &__select {
    border-radius: $border-radius-medium;
    display: block;
    font-size: 1.6rem;
    color: get-color(base, 16);
    line-height: 1.3;
    padding: 1.8rem 4rem 0.5rem 1rem;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid get-color(base, 6);
    // box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
    // border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    //  linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
    transition: all 0.5s;
    width: 100%;
    box-shadow: inset 0.2rem 0.5rem 1rem #00000011;

    &::-ms-expand {
      display: none;
    }

    &:disabled {
      border: 1px solid transparent;
      background-image: none;
      box-shadow: none;
    }

    & option {
      font-weight: normal;
    }
  }

  &__transition-line {
    position: absolute;
    left: calc(2rem - 1px);
    height: 100%;
    width: 1px;
    background-color: get-color(base, 4);
    grid-column: 1;
  }

  &__state-marker {
    width: 3rem;
    height: 3rem;
    border-radius: 1.5rem;
    margin: 0.5rem;
    background-color: get-color(base, 12);
    color: get-color(base, 0);
    text-align: center;
    line-height: 3rem;
    font-size: 1.3rem;
    text-transform: uppercase;
    grid-column: 1;
    z-index: 100;

    &--broken {
      background-color: $color-state-broken;
    }

    &--working {
      background-color: $color-state-working;
    }

    &--partial {
      background-color: $color-state-partial;
    }

    &--missing {
      background-color: $color-state-missing;
    }

    &--wanted {
      background-color: $color-state-wanted;
    }
  }

  &__state-changed-time {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  &__state-note {
    font-size: 1.2rem;
  }

  &__state {
    &--broken {
      color: $color-state-broken;
    }
    &--wanted {
      color: $color-state-wanted;
    }
    &--working {
      color: $color-state-working;
    }
    &--partial {
      color: $color-state-partial;
    }
  }

  &__control-buttons {
    border-bottom: 1px solid get-color(base, 6);
    padding-bottom: 1rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  &__edit-delete {
    position: absolute;
    left: -3rem;
    top: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  &__edit-delete-button {
    padding: 0.8rem 0.2rem;
    border: none;
    background-image: none;
  }
}
</style>