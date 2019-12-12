<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vuejs-dialog/dist/vuejs-dialog.min.css"></style>
<style src="spectre.css/dist/spectre.min.css"></style>

<script lang="ts" src="./app.ts"></script>

<template>
  <div class="container column">
    <h1>{{ title }} <span>v{{ version }}</span></h1>
    <main>
      <div class="row toolbar">
        <div class="column info">
          <div class="tags-count"
               v-html="tagsCountText"></div>
          <div class="questions-count"
               v-html="questionsCountText"></div>
        </div>

        <div class="float-left buttons">
          <a class="btn btn-success"
             target="_blank"
             :href="tosterUrl">Тостер</a>
          <button class="btn btn-error"
                  type="button"
                  @click="cleanQuestions">{{ cleanQuestionsButtonText }}</button>
          <button class="btn btn-info"
                  type="button"
                  @click="saveBackup">{{ saveBackupButtonText }}</button>
          <button class="btn btn-primary"
                  type="button"
                  @click="loadBackup">{{ loadBackupButtonText }}</button>

          <input type="file"
                 name="backup"
                 accept=".json"
                 @change="handleFileSelect" />
        </div>
      </div>

      <div class="row">
        <Tabs :options="{ useUrlFragment: false }">
          <Tab :name="tabs.tabQuestionPage">
            <OptionBoolean v-for="option in questionPageBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabQuestionsList">
            <OptionBoolean v-for="option in questionsListBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabQuestionsTop24List">
            <OptionBoolean v-for="option in questionsTop24ListBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabHideExcess">
            <OptionBoolean v-for="option in hideExcessBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabNotifications">
            <OptionBooleanNumber booleanName="checkNotifications"
                                 numberName="checkNotificationsInterval"
                                 numberLabel="msInterval"
                                 @change="updatePrimitiveOption($event, 'checkNotificationsInterval')" />
            <SoundsList @change="updateListOptions($event, 'sound')" />
            <OptionBoolean v-for="option in notificationsBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabPreview">
            <OptionBooleanNumber booleanName="questionPreview"
                                 numberName="questionPreviewLoadingDelay"
                                 numberLabel="msDelay"
                                 @change="updatePrimitiveOption($event, 'questionPreviewLoadingDelay')" />
            <OptionBooleanNumber booleanName="userProfilePreview"
                                 numberName="userProfilePreviewLoadingDelay"
                                 numberLabel="msDelay"
                                 @change="updatePrimitiveOption($event, 'userProfilePreviewLoadingDelay')" />
            <OptionBoolean v-for="option in previewBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabUser">
            <OptionBoolean v-for="option in userBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>

          <Tab :name="tabs.tabBlackLists">
            <TagsBlackist @change="updateListOptions($event, 'tagsBlacklist')" />

            <AuthorsBlackist @change="updateListOptions($event, 'authorsBlacklist')" />
          </Tab>

          <Tab :name="tabs.tabOthers">
            <OptionList optionKey="iconClickEvent"
                        :options="eventClickOptions"
                        @change="updatePrimitiveOption($event, 'iconClickEvent')">
              <span v-html="optionPhrases('iconClickEvent')"></span>
            </OptionList>
            <OptionBoolean v-for="option in othersBooleanOptions"
                           :key="option"
                           :name="option"
                           v-model="config[option]"
                           @change="updatePrimitiveOption($event, option)">
              <span v-html="optionPhrases(option)"></span>
            </OptionBoolean>
          </Tab>
        </Tabs>
      </div>

      <Social />
    </main>
  </div>
</template>
