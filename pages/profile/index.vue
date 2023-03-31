<template>
  <v-container>
    <headersGeneralComponent>
      <template v-slot:title>
        Mi perfil
      </template>

    </headersGeneralComponent>

    <v-row>
      <v-col class="col-12 col-md-12">
        <generalCardComponent>
          <generalCardTitleComponent class="primary white--text">Mis datos</generalCardTitleComponent>
          <v-form ref="formUsers">
            <v-card-text>
              <v-row>
                <v-col class="col-12">
                  <formsFieldsTextComponent v-model="user.username" label="Nombre de usuario">
                  </formsFieldsTextComponent>
                </v-col>
                <v-col class="col-12">
                  <formsFieldsTextComponent v-model="user.email" label="Email"></formsFieldsTextComponent>
                </v-col>
                <v-col class="col-12">
                  <formsFieldsTextComponent v-model="user.password" label="Contraseña"></formsFieldsTextComponent>
                </v-col>
              </v-row>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" class="secondary black--text rounded-lg font-weight-regular" @click="updateUser()"
              large>
              Actualizar
            </v-btn>
          </v-card-actions>
        </generalCardComponent>

      </v-col>

      <v-col class="col-12 col-md-12">
        <generalCardComponent>
          <generalCardTitleComponent class="primary white--text">Mi empresa</generalCardTitleComponent>
          <v-form ref="formCompany">
            <v-card-text>
              <v-row>
                <v-col class="col-12">
                  <FormsFieldsTextComponent label="Nombre" v-model="company.name" :rules="rules.required"
                    label-color="white--text">
                  </FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-12">
                  <FormsFieldsTextComponent label="Direccion (Opcional)" v-model="company.address"
                    label-color="white--text"></FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-12">
                  <FormsFieldsTextComponent label="Ciudad (Opcional)" v-model="company.city" label-color="white--text">
                  </FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-12">
                  <FormsFieldsSelectComponent label="Pais" v-model="company.country" label-color="white--text"
                    :items="['Espana']"></FormsFieldsSelectComponent>
                </v-col>
                <v-col class="col-12">
                  <FormsFieldsTextComponent label="Aftership API KEY" v-model="company.aftership_api_key"></FormsFieldsTextComponent>
                </v-col>

              </v-row>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" class="secondary black--text rounded-lg font-weight-regular" @click="updateCompany()"
              large>
              Actualizar
            </v-btn>
          </v-card-actions>
        </generalCardComponent>

      </v-col>


    </v-row>
    <v-snackbar v-model="successUpdateUser">Perfil actualizado con exito!</v-snackbar>
    <v-snackbar v-model="successUpdateCompany">Compania actualizada con exito!</v-snackbar>
  </v-container>
</template>


<script>
  export default {
    name: 'profileIndexComponent',
    data() {
      return {
        user: {} ,
        company: {},
        rules: {
          required: [value => !!value || 'Campo requerido'],
          min: [v => v.length >= 8 || 'Minimo 8 caracteres'],
          email: [v => /.+@.+\..+/.test(v) || 'Email invalido'],
          phone: [v => /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$/.test(v) || 'Telefono invalido']
        },
        successUpdateCompany:false, 
        successUpdateUser:false

      }
    },
    created() {
        this.user = {...this.$auth.user}
        this.company = {...this.$auth.user.company}
    },
    methods: {
      updateUser() {
        if(!this.$refs.formUsers.validate()) return
        this.$store.dispatch('users/update', this.user)
            .then(()=>{
                this.successUpdateUser = true
            })
      },
      updateCompany() {
        if(!this.$refs.formCompany.validate()) return
        this.$axios.put(`/companies/${this.company.id}`, {data:this.company})
            .then(()=>{
                this.successUpdateCompany = true
            })
      }
    }
  }

</script>
