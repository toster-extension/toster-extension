<template>
  <div class="form-group option-boolean-number">
    <div class="row row__no-padding">
      <OptionBoolean :name="booleanName"
                     v-model="config[booleanName]"
                     @change="updateBooleanOptions">
        <span v-html="booleanLabelText"></span>
      </OptionBoolean>
    </div>
    <div class="row row__no-padding"
         v-if="showNumber">
      <OptionNumber :name="numberName"
                    v-model="value">
        <span v-html="numberLabelText"></span>
      </OptionNumber>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
