<template>
  <div class="form-group option-boolean">
    <label class="form-switch">
      <input type="checkbox"
             :name="name"
             :checked="checked"
             @change="change" />
      <i class="form-icon"></i>
      <slot />
    </label>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
