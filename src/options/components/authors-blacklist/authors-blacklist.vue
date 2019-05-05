<template>
  <div class="form-group option-list">
    <div class="row row__no-padding">
      <OptionBoolean name="useAuthorsBlackList"
                     v-model="config.useAuthorsBlackList"
                     @change="updateBooleanOptions('useAuthorsBlackList', $event)">
        <span v-html="labelText"></span>
      </OptionBoolean>
    </div>
    <div class="column row__no-padding"
         v-if="showList">
      <div class="row row__no-padding">
        <OptionBoolean name="useAuthorsBlackListForAnswersAndComments"
                       v-model="config.useAuthorsBlackListForAnswersAndComments"
                       @change="updateBooleanOptions('useAuthorsBlackListForAnswersAndComments', $event)">
          <span v-html="labelAnswersAndCommentsText"></span>
        </OptionBoolean>
      </div>

      <div class="row row__no-padding">
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
                     selectLabel="Нажми Enter чтобы выбрать имя автора"
                     tagPlaceholder="Нажми Enter чтобы добавить имя в список"
                     @tag="addAuthor">
          <template slot="option"
                    slot-scope="{option}">
            <div class="option"
                 v-if="option.name">
              <span class="option__name">{{ getName(option.name) }}</span>
              <span class="option__nick">{{ getNick(option.name) }}</span>
            </div>
          </template>
        </Multiselect>

        <button class="btn btn-error"
                type="button"
                :disabled="!value.length"
                @click="cleanBlacklist">{{ cleanButtonText }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>

<style scoped>
.option >>> .option__name {
    font-weight: 700;
}
.option >>> .option__nick {
    font-style: italic;
}
</style>
