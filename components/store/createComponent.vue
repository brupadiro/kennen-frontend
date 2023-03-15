<template>
  <v-dialog persistent :value="value" width="700">
    <GeneralCardComponent width="100%">
      <GeneralCardTitleComponent class="primary white--text">
        Nueva tienda
        <v-spacer></v-spacer>
        <generalCloseButtonComponent @input="$emit('input',false)"></generalCloseButtonComponent>
      </GeneralCardTitleComponent>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col class="col-12">
              <formsFieldsTextComponent v-model="store.name" :rules="rules.required" label="Nombre">
              </formsFieldsTextComponent>
            </v-col>
            <v-col class="col-md-12">
              <formsFieldsTextComponent v-model="store.url" :rules="rules.required" label="URL">
              </formsFieldsTextComponent>
            </v-col>
            <v-col class="col-md-12">
              <formsFieldsTextComponent v-model="store.apiKey" :rules="rules.required" label="Api Key">
              </formsFieldsTextComponent>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary black--text rounded-lg font-weight-regular" class="rounded-lg" @click="addStore()">
          Agregar tienda&nbsp;&nbsp;<v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </GeneralCardComponent>
    <v-snackbar color="warning" v-model="snackErrorForm">
      Hay campos requeridos incompletos
    </v-snackbar>
  </v-dialog>

</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        snackErrorForm: false,
        store: {},
        rules: {
          required: [(value) => !!value || 'Este campo es requerido'],
          number: (value) => value.match(/^[0-9]*$/) || 'Este campo solo acepta numeros'
        },
      }
    },
    methods: {
      async addStore() {
        if (!this.$refs.form.validate()) {
          this.snackErrorForm = true
          setTimeout(() => {
            this.snackErrorForm = false
          }, 3000)
          return
        }
         this.$axios.post('/webservices/?populate=*', {
            data: {
                ...this.store,
                company:this.$auth.user.company.id
            }
          })
          .then((data) => {
            this.store = {}
            this.$emit('input', false)
            this.$root.$emit('refresh')
          })
        this.$emit('input', false)
      }
    },
    computed: {}
  }

</script>

<style>

</style>
