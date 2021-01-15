<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon>
        <v-icon large>mdi-file-document-edit</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        {{ appName }}
      </v-toolbar-title>
    </v-app-bar>

    <v-main class="cat-background">
      <v-container
        class="fill-height pt-6 width-900"
        fluid
      >
        <v-row>
          <v-col cols="12">
            <h3>Template File</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10">
            <v-text-field
              :value="settings.inputFile"
              @click="selectFile"
              label="Template File"
              hint="Choose template file"
              filled
            />
          </v-col>
          <v-col cols="2" />
        </v-row>

        <v-row>
          <v-col cols="12">
            <h3>Replacement Fields</h3>
          </v-col>
        </v-row>
        <v-row
          v-for="field in fields" :key="field.id"
          class=""
        >
          <v-col cols="4" class="py-1">
            <v-text-field
              v-model="field.name"
              @input="updateField({
                id: field.id,
                name: field.name,
                value: field.value,
              })"
              :disabled="field.readOnly"
              label="Field Name"
              hint="example: Company Name"
              filled
            />
          </v-col>
          <v-col cols="6" class="py-1">
            <v-text-field
              v-model="field.value"
              @input="updateField({
                id: field.id,
                name: field.name,
                value: field.value,
              })"
              :label="labelName(field.name)"
              :hint="hintName(field.machineName)"
              persistent-hint
              filled
            />
          </v-col>

          <v-col cols="2" class="py-1">
            <v-btn
              v-if="!field.readOnly"
              @click="deleteField({
                fieldId: field.id,
              })"
              fab
              dark
            >
              <v-icon dark>
                mdi-trash-can-outline
              </v-icon>
            </v-btn>

            <v-tooltip v-else bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  fab
                  dark
                >
                  <v-icon dark>
                    mdi-block-helper
                  </v-icon>
                </v-btn>
              </template>
              <span>Required Field: Can't Delete</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <v-row
          align="center"
          justify="center"
          class="width-900"
        >
          <v-col cols="10" class="d-flex justify-end">
            <v-btn
              @click="createField"
              large
              color="deep-purple darken-1"
              class="mt-4"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              Add Field
            </v-btn>
          </v-col>
          <v-col cols="2" />
        </v-row>

        <v-row>
          <v-col cols="12">
            <h3>Save to Folder</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10">
            <v-text-field
              :value="settings.exportFolder"
              @click="selectFolder"
              label="Save to Folder"
              hint="Choose folder"
              filled
            />
          </v-col>
          <v-col cols="2" />
        </v-row>

        <v-row class="mb-8">
          <v-col cols="10" class="d-flex justify-center">
            <v-btn x-large color="deep-purple darken-1" @click="generateFile">
              <v-icon left>
                mdi-file-word-outline
              </v-icon>
              Generate Cover Letter
            </v-btn>
          </v-col>
          <v-col cold="2" />
        </v-row>
      </v-container>

      <v-snackbar
        color="deep-purple darken-2"
        v-model="snackbar"
        timeout="6000"
        multi-line
        top
      >
        <span>CV Created: </span>
        <strong>
          {{ getFieldValueByMachineName('name') }}
          -
          {{ getFieldValueByMachineName('companyName').replace(/[^\w\s]/gi, '') }}.docx
        </strong>
        <template v-slot:action="{ attrs }">
          <v-btn
            color="#877C99"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            {{ snackbarLabel }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>

    <v-footer app>
      <span>Camila Ossandon Espana &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { docxGenerator } from './lib/docx-generator'
const { dialog } = require('electron').remote
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    appName: "Camila's Future - CV Generation Tool",
    snackbar: false,
    snackbarLabel: 'Ok',
    snackbarLabels: [
      'Got It',
      "H'ok",
      'Yis'
    ]
  }),

  computed: {
    ...mapState([
      'settings',
      'fields',
    ]),
    ...mapGetters([
      'getFieldValueByMachineName',
      'getFieldsAsKeyValue',
    ]),
  },

  created () {
    document.title = this.appName
    this.$vuetify.theme.dark = true
  },

  methods: {
    ...mapActions([
      'createField',
      'updateField',
      'deleteField',
      'updateSetting',
    ]),

    generateFile () {
      this.snackbarLabel = this.randomArrayValue(this.snackbarLabels)
      this.snackbar = true
      docxGenerator(this.getFieldsAsKeyValue)
    },

    hintName (machineName) {
      return machineName
        ? `Add {${machineName}} to template document`
        : 'Fill Name'
    },

    labelName (name) {
      return name
        ? `${name}'s Value`
        : ''
    },

    randomArrayValue (arr) {
      let randomIndex = Math.floor(Math.random() * arr.length)
      return arr[randomIndex]
    },

    selectFile () {
      dialog.showOpenDialog({
        title: 'Select Template File',
        properties: [ 'openFile' ]
      }).then(result => {
        if (result.canceled || result.filePaths === []) {
          console.log('No template file selected')
        } else {
          this.updateSetting({
            settingName: 'inputFile',
            value: result.filePaths[0],
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    selectFolder () {
      dialog.showOpenDialog({
        title: 'Select a folder',
        properties: [ 'openDirectory' ]
      }).then(result => {
        if (result.canceled || result.filePaths === []) {
          console.log('No invoice folder selected')
        } else {
          this.updateSetting({
            settingName: 'exportFolder',
            value: result.filePaths[0],
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style>
.cat-background {
  background: linear-gradient(to bottom, rgba(88, 89, 91, 0.72), rgba(21, 21, 22, 0.85)),
    url("/kitty-bg.jpg") no-repeat top center fixed;
}
.width-900 {
  width: 900px !important;
  max-width: 900px !important;
}
</style>
