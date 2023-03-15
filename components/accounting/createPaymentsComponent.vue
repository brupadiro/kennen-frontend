<template>
  <v-dialog persistent :value="value" width="700">
    <GeneralCardComponent width="100%">
      <GeneralCardTitleComponent class="primary white--text">
        Nuevo movimiento
        <v-spacer></v-spacer>
        <generalCloseButtonComponent @input="$emit('input',false)"></generalCloseButtonComponent>
      </GeneralCardTitleComponent>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col class="col-12">
              <FormsFieldsSelectComponent v-model="payment.type" label="Tipo" :rules="rules.required" :items="[
                        {text:'Impuestos',value:'Impuestos',},
                        {text:'Facturas',value:'Facturas'},
                        {text:'Pago a proveedores',value:'suppliers'},
                        {text:'Sueldos',value:'sueldos'}
                        ]">
              </FormsFieldsSelectComponent>
            </v-col>
            <v-col class="col-12">
              <formsFieldsSelectComponent v-model="payment.store" item-text="name" item-value="id"
                :items="storeList.data" type="number" label="Tienda">
              </formsFieldsSelectComponent>
            </v-col>
            <v-col class="col-12">
              <FormsFieldsSelectComponent v-model="payment.status" label="Estado" :items="[
                {text:'Pagado',value:'payed',},
                {text:'Pendiente',value:'pending'}
            ]">
              </FormsFieldsSelectComponent>
            </v-col>
            <v-col class="col-md-12 col-12">
              <formsFieldsTextComponent prepend-inner-icon="mdi-currency-usd" type="number" v-model="payment.amount"
                label="Valor">
              </formsFieldsTextComponent>
            </v-col>
            <v-col class="col-md-12">
              <formsFieldsTextComponent v-model="payment.comments" label="Comentarios">
              </formsFieldsTextComponent>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary black--text rounded-lg font-weight-regular" class="rounded-lg" @click="addPayment()">
          Agregar movimiento&nbsp;&nbsp;<v-icon>mdi-content-save</v-icon>
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
        payment: {
          type: 'Impuestos',
          amount: null,
          comments: null,
          status: 'payed',
          store: null
        },
        storeList:{
          data:[]
        },
        rules: {
          required: [(value) => !!value || 'Este campo es requerido'],
          number: (value) => value.match(/^[0-9]*$/) || 'Este campo solo acepta numeros'
        },
      }
    },
    created() {
      this.getStores()
    },
    methods: {
      async getStores() {
        this.storeList = await this.$store.dispatch('store/findAll', {
          company: this.$auth.user.company.id
        })
        this.payment.store = this.storeList.data[0]?.id
      },

       addPayment() {
        if (!this.$refs.form.validate()) {
          this.snackErrorForm = true
          setTimeout(() => {
            this.snackErrorForm = false
          }, 3000)
          return
        }
        this.$axios.post('/payments',{
          data:this.payment
        })
          .then(()=>{
            this.payment = {}
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
