<template>
  <div class="form-group option-list">
    <div class="row row__no-padding">
      <OptionBoolean name="useTagsBlackList"
                     v-model="config.useTagsBlackList"
                     @change="updateBooleanOptions">
        <span v-html="labelText"></span>
      </OptionBoolean>
    </div>
    <div class="row row__no-padding"
         v-if="showList">
      <Multiselect v-model="value"
                   label="name"
                   track-by="name"
                   :placeholder="placeholder"
                   :options="options"
                   :optionsLimit="500"
                   :multiple="true"
                   :taggable="true"
                   :hideSelected="true"
                   :clearOnSelect="true"
                   selectLabel="Нажми Enter чтобы выбрать тег"
                   tagPlaceholder="Нажми Enter чтобы добавить тег в список"
                   @tag="addTag">
        <template slot="option"
                  slot-scope="{option}">
          <div class="option">
            <img class="option__image"
                 :src="option.image">
            <span class="option__name">{{ option.name }}</span>
          </div>
        </template>
      </Multiselect>

      <button class="btn btn-error"
              type="button"
              :disabled="!value.length"
              @click="cleanBlacklist">{{ cleanButonText }}</button>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>

<style scoped>
.option >>> .option__image {
    width: 16px;
    height: 16px;
}

.option >>> .option__name {
    font-weight: 700;
    text-transform: uppercase;
}
</style>
