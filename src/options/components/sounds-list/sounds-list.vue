<template>
  <div class="form-group option-list">
    <div class="row row__no-padding">
      <OptionBoolean name="useNotificationSound"
                     v-model="config.useNotificationSound"
                     @change="updateBooleanOptions">
        <span v-html="labelText"></span>
      </OptionBoolean>
    </div>
    <div class="row row__no-padding"
         v-if="showList">
      <Multiselect v-model="value"
                   :options="options"
                   :searchable="false"
                   :closeOnSelect="true"
                   :preselectFirst="true"
                   :clearOnSelect="false"
                   :showLabels="false">
      </Multiselect>
      <button v-if="value"
              class="btn btn-success"
              @click="play"
              v-html="playSoundText"></button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>

<style scoped>
.row {
    align-items: center;
}

.option-list >>> .multiselect {
    width: max-content !important;
    padding-left: 10px !important;
}

.btn {
    margin-left: 10px;
}
</style>
