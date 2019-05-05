<script lang="ts" src="./tab.ts"></script>

<template>
  <section class="tabs-component-panel"
           role="tabpanel"
           :aria-hidden="!isActive"
           :id="computedId"
           v-show="isActive">
    <slot />
  </section>
</template>
