<template>
  <v-container>
    <HeadersGeneralComponent>
      <template v-slot:title>
        Usuarios
      </template>
      <template v-slot:subtitle>
        <v-btn color="secondary" class="font-weight-bold black--text rounded-lg" @click="modalUsers=true">Agregar
          usuario</v-btn>
      </template>
    </HeadersGeneralComponent>


    <v-row>
      <v-col class="col-12">
        <generalCardComponent elevation="6">
          <v-card-text>
            <v-data-table loading-text="Buscando clientes..." :loading="loading" :headers="headers" :items="users"
              hide-default-footer>
              <template v-slot:item.firstname="{ item }">
                {{ item.firstname  }} {{ item.lastname  }}
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate  }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
        </generalCardComponent>
      </v-col>
    </v-row>
    <v-dialog persistent :value="modalUsers" width="700">
      <GeneralCardComponent width="100%">
        <GeneralCardTitleComponent class="primary white--text">
          Nuevo usuario
          <v-spacer></v-spacer>
          <generalCloseButtonComponent @input="modalUsers = false"></generalCloseButtonComponent>
        </GeneralCardTitleComponent>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col class="col-12">
                <formsFieldsTextComponent v-model="user.username" :rules="rules.required" label="Nombre de usuario">
                </formsFieldsTextComponent>
              </v-col>
              <v-col class="col-md-12">
                <formsFieldsTextComponent v-model="user.email" :rules="rules.required" label="Email">
                </formsFieldsTextComponent>
              </v-col>
              <v-col class="col-md-12">
                <FormsFieldsSelectComponent v-model="user.type" :rules="rules.required" label="Tipo" :items="itemsUserType">
                </FormsFieldsSelectComponent>
              </v-col>

              <v-col class="col-md-12">
                <formsFieldsTextComponent v-model="user.password" type="password" :rules="rules.required"
                  label="Contraseña">
                </formsFieldsTextComponent>
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary black--text rounded-lg font-weight-regular" class="rounded-lg" @click="addUser()">
            Agregar usuario&nbsp;&nbsp;<v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </GeneralCardComponent>
      <v-snackbar color="warning" v-model="snackErrorForm">
        Hay campos requeridos incompletos
      </v-snackbar>
    </v-dialog>
  </v-container>
</template>

<script>
  import qs from 'qs';
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  export default {
    mixins: [dateFunctions],
    data() {
      return {
        headers: [{
          text: 'Nombre de usuario',
          value: 'username'
        }, {
          text: 'Email',
          value: 'email'
        }, {
          text: 'Tipo',
          value: 'type',
        }, {
          text: 'Fecha de alta',
          value: 'createdAt',
          align: 'center'
        }],
        itemsUserType: [{
          text: 'Administrador',
          value: 'admin'
        }, {
          text: 'Proveedor',
          value: 'Provider'
        }],
        search: {
          pagination: {
            page: 1
          }
        },
        rules: {
          required: [(value) => !!value || 'Este campo es requerido'],
          number: (value) => value.match(/^[0-9]*$/) || 'Este campo solo acepta numeros'
        },
        snackErrorForm: false,
        user:{
          type:'Admin'
        },
        loading: false,
        users: [],
        modalUsers: false,
      }
    },
    created() {
      this.getUsers();
    },
    methods: {
      addUser() {
        if (this.$refs.form.validate()) {
            this.user.company = this.$auth.user.company.id
            this.user.type = 'Employee'
            this.$store.dispatch('users/create', this.user)
                .then(()=>{
                    this.modalUsers = false
                    this.getUsers()
                })
        } else {
          this.snackErrorForm = true
        }
      },
      getUsers() {
        this.loading = true
        this.users = []
        this.$axios.get('/users/', {
          params: {
            filters: {
              company: this.$auth.user.company.id,
            }
          },
          paramsSerializer: params => {
            return qs.stringify(params, {
              arrayFormat: 'repeat'
            })
          }
        }).then((response) => {
          this.users = response.data;
          this.loading = false
        })
      }
    },
    watch: {
      search: {
        handler() {
          this.getUsers();
        },
        deep: true
      }
    }
  }

</script>

<style>

</style>
