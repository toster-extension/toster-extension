<style lang="scss" src="./styles.scss" scoped></style>
<script lang="ts" src="./tabs.ts"></script>

<template>
  <div class="tabs">
    <ul role="tablist"
        class="tabs-tabs">
      <li class="tabs-tab"
          :class="{ 'is-active': tab.isActive, 'is-disabled': tab.isDisabled }"
          role="presentation"
          v-for="(tab, i) in tabs"
          :key="i"
          @click="selectTab(tab.hash, $event)"
          v-show="tab.isVisible">
        <p class="tabs-tab-text"
           role="tab"
           :aria-controls="tab.hash"
           :aria-selected="tab.isActive"
           v-html="tab.header"></p>
      </li>
    </ul>
    <div class="tabs-panels">
      <slot />
    </div>
  </div>
</template>
