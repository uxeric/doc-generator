import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuid } from 'uuid'
import { createPersistedState } from 'vuex-electron'
import { deepCopy } from '@/lib/objectManipulation'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settings: {
      inputFile: '',
      exportFolder: './output/',
    },

    fields: [
      {
        id: uuid(),
        name: 'Name',
        machineName: 'name',
        value: 'Camila Ossandon Espana',
        readOnly: true,
      },
      {
        id: uuid(),
        name: 'Address',
        machineName: 'address',
        value: 'B-206 Thames St, Chatham, ON N7L 2Y9',
        readOnly: false,
      },
      {
        id: uuid(),
        name: 'Position',
        machineName: 'position',
        value: 'Social Woker',
        readOnly: false,
      },
      {
        id: uuid(),
        name: 'Company Name',
        machineName: 'companyName',
        value: '',
        readOnly: true,
      },
      {
        id: uuid(),
        name: 'Company Address One',
        machineName: 'companyAddressOne',
        value: '',
        readOnly: false,
      },
      {
        id: uuid(),
        name: 'Company Address Two',
        machineName: 'companyAddressTwo',
        value: '',
        readOnly: false,
      }
    ],

    reservedFieldNames: [
      'settings'
    ],
  },

  getters: {
    getFieldValueByMachineName: (state) => (machineName) => {
      return state.fields
        .find(f => f.machineName === machineName)
        .value ?? ''
    },

    getFieldsAsKeyValue: (state) => {
      let fields = deepCopy(
        state.fields
          .reduce((acc, val) => {
            acc[val.machineName] = val.value
            return acc
          }, {})
      )
      fields.settings = deepCopy(state.settings)

      return fields
    },
  },

  mutations: {
    createField (state) {
      const field = {
        id: uuid(),
        name: '',
        machineName: '',
        value: '',
      }

      state.fields.push(field)
    },

    updateField (state, { id, name, value }) {
      const field = state.fields
        .find(f => f.id === id)

      Vue.set(field, 'name', name)
      Vue.set(field, 'machineName', machineName(name, state.reservedFieldNames))
      Vue.set(field, 'value', value)
    },

    deleteField (state, { fieldId }) {
      state.fields =
        state.fields
          .filter(f => f.id !== fieldId)
    },

    updateSetting(state, { settingName, value }) {
      Vue.set(
        state.settings,
        settingName,
        value,
      )
    },
  },

  actions: {
    createField (store) {
      store.commit('createField')
    },
    updateField (store, { id, name, value }) {
      store.commit('updateField', { id, name, value })
    },
    deleteField (store, { fieldId }) {
      store.commit('deleteField', { fieldId })
    },

    updateSetting(store, { settingName, value }) {
      store.commit('updateSetting', { settingName, value })
    },
  },

  plugins: [
    createPersistedState(),
  ],
})

function machineName (str, reservedFieldNames) {
  let finalString = str
    .replace(/[^a-zA-Z]/g, '')
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase() })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) { return $1.toLowerCase() })

  if (reservedFieldNames.includes(finalString)) {
    finalString = finalString.concat('Field')
  }

  return finalString
}
