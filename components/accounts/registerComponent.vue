<template>
  <v-form ref="form">
    <v-card-text>
      <v-row>
        <v-col class="col-12">
          <FormsFieldsTextComponent label="Nombre" label-color="white--text" v-model="user.username"
            :rules="rules.required"></FormsFieldsTextComponent>
        </v-col>
        <v-col class="col-12">
          <FormsFieldsTextComponent type="email" label-color="white--text" v-model="user.email" label="Email"
            :rules="[rules.required,rules.email]">
          </FormsFieldsTextComponent>
        </v-col>
        <v-col class="col-12">
          <FormsFieldsTextComponent type="phone" label-color="white--text" v-model="user.phone" label="Telefono"
            :rules="[rules.required,rules.phone]">
          </FormsFieldsTextComponent>
        </v-col>
        <v-col class="col-12">
          <FormsFieldsTextComponent type="password" label-color="white--text" v-model="user.password" label="Contraseña"
            :rules="rules.required"></FormsFieldsTextComponent>
        </v-col>
        <v-col class="col-12">
          <generalCardComponent elevation="8" color="transparent">
            <GeneralCardTitleComponent class="white--text">Empresa</GeneralCardTitleComponent>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col class="col-12">
                  <FormsFieldsTextComponent label="Nombre" v-model="company.name" :rules="rules.required" label-color="white--text">
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


              </v-row>
            </v-card-text>
          </generalCardComponent>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" class="secondary black--text rounded-lg font-weight-regular" @click="register()"
        :loading="loading" large block>
        Entrar&nbsp;<v-icon>mdi-login</v-icon>
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        loading: false,
        user: {
          username: '',
          password: ''
        },
        company: {
          name: '',
          address: '',
          city: '',
          country: 'Espana'
        },
        rules: {
          required: [value => !!value || 'Campo requerido'],
          min: [v => v.length >= 8 || 'Minimo 8 caracteres'],
          email: [v => /.+@.+\..+/.test(v) || 'Email invalido'],
          phone: [v => /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$/.test(v) || 'Telefono invalido']
        },
        tab: null,
        loading: false
      }
    },
    methods: {
      register() {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.$axios.post('/companies', {
            data:this.company
          })
            .then(response => {
              this.user.company = response.data.data.id
            }).then(() => {
              this.$store.dispatch('users/create', this.user)
                .then(() => {
                  this.$store.dispatch('users/login', this.user)
                })

            })

        }
      }

    }
  }

</script>

<style>

</style>
