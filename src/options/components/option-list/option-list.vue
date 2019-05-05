<template>
  <div class="form-group option-list">
    <div class="row">
      <label>
        <slot />
      </label>
      <Multiselect v-model="value"
                   :options="options"
                   label="label"
                   track-by="label"
                   :searchable="false"
                   :closeOnSelect="true"
                   :preselectFirst="true"
                   :clearOnSelect="false"
                   :showLabels="false">
      </Multiselect>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>

<style scoped>
.option-list >>> .multiselect {
    width: max-content !important;
    padding-left: 10px !important;
}

label:after {
    content: ":";
    line-height: 2.2em;
}
</style>
