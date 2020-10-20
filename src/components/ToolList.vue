<template>
  <div class="container">
    <div v-if="changingToolState" class="dialog-overlay">
      <div class="dialog-window">
        <tool-state-change
          :tool="toolToChangeState"
          v-on:state-changed="changingToolState = false"
          v-on:cancel="changingToolState = false"
        ></tool-state-change>
      </div>
    </div>

    <div v-if="showingToolDetails" class="dialog-overlay">
      <div class="dialog-window" style="min-width: 40rem;">
        <tool-details
          :tool="toolToShowDetails"
          :available-categories="availableCategories"
          v-on:cancel="showingToolDetails = false"
          v-on:tool-updated="toolDetailsUpdated($event)"
          v-on:tool-added="toolAdded($event)"
          v-on:tool-deleted="toolDeleted($event)"
        ></tool-details>
      </div>
    </div>

    <div class="controls">
      <div class="controls__group controls__group--add-search">
        <div class="controls__label" style="grid-column: 1">+ new</div>
        <button @click="newTool" style="grid-row: 2; margin-right: .5rem;">
          Add
          <span class="weak">Tool</span>
        </button>

        <div class="controls__label" style="grid-column: 2;">search</div>
        <div class="controls__search" style="grid-row: 2; grid-column: 2;">
          <input
            class="controls__search-input"
            type="text"
            v-model="findFilter"
            style="width: 100%;"
          />
          <button
            :class="['controls__search-clear-button', findFilter === '' ? 'controls__search-clear-button--hidden' : '']"
            @click="findFilter = ''"
          >Clear</button>
        </div>
      </div>

      <div class="controls__group controls__group--sort">
        <div class="controls__label">sort</div>
        <tool-state-toggle
          :state="''"
          :pressed="categorize"
          @click="categorize = !categorize"
          style="grid-row: 2; height: 32px;"
        >
          <span class="weak">show in</span> categories
        </tool-state-toggle>

        <div class="controls__label" style="grid-column: 2"></div>
        <div style="grid-row: 2; grid-column: 2">
          <button
            @click="sorting = 'alpha'; categorize=false;"
            :class="['sort-button', (sorting === 'alpha' ? 'sort-button--active' : '') ]"
          >
            <sort-by-alpha />
          </button>
          <button
            @click="sorting = 'state'; categorize=false;"
            :class="['sort-button', (sorting === 'state' ? 'sort-button--active' : '') ]"
          >
            <sort-by-state />
          </button>
          <button
            @click="sorting = 'time'; categorize=false;"
            :class="['sort-button', (sorting === 'time' ? 'sort-button--active' : '') ]"
          >
            <sort-by-time />
          </button>
          <button
            @click="sorting = 'random'; categorize=false;"
            :class="['sort-button', (sorting === 'random' ? 'sort-button--active' : '') ]"
          >
            <sort-by-random />
          </button>
        </div>
      </div>

      <div class="controls__group controls__group--filters">
        <div class="controls__label">filter</div>
        <div class="controls__filter-buttons">
          <tool-state-toggle
            :state="''"
            :pressed="stateFilter === ''"
            @click="toggleFilter('')"
            class="controls__filter-button"
          >
            <span class="weak">see...</span>everything!
          </tool-state-toggle>
          <tool-state-toggle
            :state="'broken'"
            :pressed="stateFilter.includes('broken')"
            @click="toggleFilter('broken')"
            class="controls__filter-button"
          >
            <span class="weak">what's&nbsp;</span>broken?
          </tool-state-toggle>
          <tool-state-toggle
            :state="'missing'"
            :pressed="stateFilter.includes('missing')"
            @click="toggleFilter('missing')"
            class="controls__filter-button"
          >
            <span class="weak">what's&nbsp;</span>missing?
          </tool-state-toggle>
          <tool-state-toggle
            :state="'wanted'"
            :pressed="stateFilter.includes('wanted')"
            @click="toggleFilter('wanted')"
            class="controls__filter-button"
          >
            <span class="weak">what's&nbsp;</span>wanted?
          </tool-state-toggle>
        </div>
      </div>
    </div>

    <h2 class="nothing-message" v-if="sortedTools.length === 0">{{ nothing }}</h2>

    <ul v-if="!categorize" class="flat-container">
      <tool-list-item
        v-for="t in sortedTools"
        :tool="t"
        :key="t.id"
        v-on:state-change-requested="changeToolState($event)"
        v-on:tool-details-requested="showToolDetails($event)"
      ></tool-list-item>
    </ul>

    <div v-if="categorize" class="categorized-container">
      <div class="domain" v-for="(domain, domainName) in categorizedTools" :key="domainName">
        <h2 class="domain__header">{{ domainName }}</h2>
        <div class="category" v-for="(category, categoryName) in domain" :key="categoryName">
          <h3 class="category__header">{{ categoryName }}</h3>
          <ul>
            <tool-list-item
              v-for="t in category"
              :tool="t"
              :key="t.id"
              v-on:state-change-requested="changeToolState($event)"
              v-on:tool-details-requested="showToolDetails($event)"
            ></tool-list-item>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolListItem from "./ToolListItem";
import ToolStateChange from "./ToolStateChange";
import ToolDetails from "./ToolDetails";
import ToolStateToggle from "./ToolStateToggle";

// svg icons for buttons
import SortByState from "../assets/state.svg";
import SortByAlpha from "../assets/alpha.svg";
import SortByRandom from "../assets/random.svg";
import SortByTime from "../assets/time.svg";

export default {
  name: "ToolList",
  components: {
    ToolListItem,
    ToolStateChange,
    ToolDetails,
    ToolStateToggle,
    SortByState,
    SortByAlpha,
    SortByRandom,
    SortByTime
  },
  data() {
    return {
      tools: [],
      sorting: "alpha",
      categorize: true,
      stateFilter: "",
      nothings: [
        "Absolutely nothing!",
        "Not a thing!",
        "404 Tool Not Found!",
        "Peter No Tool",
        "Zarro Tools Found."
      ],
      nothing: "Nothing",
      changingToolState: false,
      toolToChangeState: null,
      showingToolDetails: false,
      toolToShowDetails: null,
      findFilter: ""
    };
  },
  mounted() {
    this.$http.get("tools", { headers: {"Authorization" : "Bearer " + this.$store.state.authentication.user?.token}}).then(response => {
      this.tools = response.data;
    });
  },
  methods: {
    groupBy(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    toggleFilter: function(state) {
      this.stateFilter = this.stateFilter !== state ? state : "";
    },
    changeToolState: function(tool) {
      this.toolToChangeState = tool;
      this.changingToolState = true;
    },
    showToolDetails: function(tool) {
      this.toolToShowDetails = tool;
      this.showingToolDetails = true;
    },
    newTool: function() {
      this.showToolDetails({
        id: 0,
        name: "",
        description: "",
        category: "",
        domain: "woodshop",
        homeLocation: "",
        currentState: null,
        stateHistory: []
      });
    },
    toolDetailsUpdated: function(tool) {
      this.showingToolDetails = false;
      var toolIndex = this.tools.findIndex(t => {
        return t.id === tool.id;
      });
      this.$set(this.tools, toolIndex, tool);
    },
    toolAdded: function(tool) {
      this.showingToolDetails = false;
      this.tools.push(tool);
    },
    toolDeleted: function(tool) {
      this.showingToolDetails = false;
      var toolIndex = this.tools.findIndex(t => {
        return t.id === tool.id;
      });
      this.$delete(this.tools, toolIndex);
    },
    randomizeNothing() {
      this.nothing = this.nothings[
        Math.floor(Math.random() * this.nothings.length)
      ];
    },
    shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  },
  computed: {
    sortedTools() {
      var sortedAndFilteredTools = this.tools;

      if (this.findFilter) {
        sortedAndFilteredTools = this.tools.filter(t => {
          var searchTerm = this.findFilter.toLowerCase().trim();

          return (
            t.name.toLowerCase().includes(searchTerm) ||
            t.category.toLowerCase().includes(searchTerm) ||
            t.description.toLowerCase().includes(searchTerm)
          );
        });
      }

      if (this.sorting === "alpha") {
        sortedAndFilteredTools = sortedAndFilteredTools
          .concat()
          .sort(function(a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return 0;
          });
      } else if (this.sorting === "time") {
        sortedAndFilteredTools = sortedAndFilteredTools
          .concat()
          .sort(function(a, b) {
            if (a.currentState.whenChanged > b.currentState.whenChanged) {
              return -1;
            }
            if (a.currentState.whenChanged < b.currentState.whenChanged) {
              return 1;
            }
            return 0;
          });
      } else if (this.sorting === "state") {
        sortedAndFilteredTools = sortedAndFilteredTools
          .concat()
          .sort(function(a, b) {
            if (a.currentState.state < b.currentState.state) {
              return -1;
            }
            if (a.currentState.state > b.currentState.state) {
              return 1;
            }
            return 0;
          });
      } else if (this.sorting == "random") {
        sortedAndFilteredTools = this.shuffle(sortedAndFilteredTools);
      }

      if (this.stateFilter) {
        sortedAndFilteredTools = sortedAndFilteredTools.filter(t => {
          return t.currentState.state === this.stateFilter;
        });
        this.randomizeNothing();
      }

      return sortedAndFilteredTools;
    },
    categorizedTools() {
      var resortedTools = this.sortedTools.concat().sort(function(a, b) {
        var aSortString = a.domain + a.category;
        var bSortString = b.domain + b.category;
        if (aSortString < bSortString) {
          return -1;
        }
        if (aSortString > bSortString) {
          return 1;
        }
        return 0;
      });

      var domains = this.groupBy(resortedTools, "domain");

      for (var domain in domains) {
        if (domains.hasOwnProperty(domain)) {
          domains[domain] = this.groupBy(domains[domain], "category");
        }
      }
      return domains;
    },
    availableCategories() {
      return [...new Set(this.tools.map(t => t.category))];
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
  margin: 0 auto;
}

.flat-container {
  @include list-columns($list-column-width, $list-column-gap);
}

.categorized-container {
  @include list-columns($list-column-width, $list-column-gap);
}

.domain {
  margin: 0 0 2rem 0;
  break-inside: avoid-column;

  &__header {
    padding: 0 1rem;
    font-weight: 400;
    text-transform: uppercase;
  }
}

.category {
  border-top: 1px solid get-color(base, 8);
  margin: 0.5rem 1rem 1rem 1rem;
  overflow: hidden;
  // float: left;

  &__header {
    text-align: left;
    text-transform: uppercase;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 4px 0 2px 0;
  }
}

.nothing-message {
  margin: 4rem 0;
  text-align: center;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(get-color(base, 2), 0.7);
  z-index: 100;
}

.dialog-window {
  position: absolute;
  background-color: get-color(base, 0);
  box-shadow: 0 1rem 2rem $box-shadow-color;
  border-radius: 4px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 100vh;
  overflow-y: auto;
}

.controls {
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  width: ($list-column-width);

  @media only screen and (min-width: ($list-column-width * 2)) {
    width: ($list-column-width * 2);
  }

  &__group {
    border-top: 1px solid get-color(base, 8);
    margin: 0.75rem 0;
    padding: 0 0.5rem;

    &--add-search {
      width: $list-column-width;
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto auto;
    }

    &--sort {
      width: $list-column-width;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto;
    }

    &--filters {
      width: $list-column-width;
      display: grid;
      grid-template-rows: auto auto;

      @media only screen and (min-width: ($list-column-width * 2)) {
        width: ($list-column-width * 2);
      }
    }
  }

  &__filter-buttons {
    grid-row: 2;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  &__filter-button {
    // width: (($list-column-width / 2) - 1rem);
    padding: 0.6rem;
    margin: 2px;
    flex-grow: 1;
  }

  &__label {
    font-size: 1rem;
    margin-bottom: 2px;
    text-transform: uppercase;
    display: inline-block;
    text-align: left;
    width: 100%;
  }

  &__search {
    position: relative;
  }

  &__search-input {
  }

  &__search-clear-button {
    font-size: 1.2rem;
    padding: 0.25rem 0.5rem;
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 1;
    transition: all 0.5s;

    &--hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
}

.sort-button {
  border: none;
  width: 32px;
  height: 32px;
  padding: 2px;
  margin-left: 4px;
  background-color: get-color(base, 0);
  background-image: none;
  color: get-color(base, 16);
  border-radius: $border-radius-medium;

  &--active {
    background-color: get-color(base, 16);
    color: get-color(base, 0);
  }
}
</style>