<template>
  <v-container>
    <headersGeneralComponent>
      <template v-slot:title>
        Contabilidad
      </template>
      <template v-slot:subtitle>
        <v-btn large color="secondary black--text rounded-lg font-weight-regular" @click="paymentsModal = true">
          NUEVO MOVIMIENTO
        </v-btn>
      </template>

    </headersGeneralComponent>
    <v-row>
      <v-col class="col-12">
        <GeneralCardComponent>
          <GeneralCardTitleComponent class="primary white--text">
            Filtros
          </GeneralCardTitleComponent>
          <v-card-text>
            <v-row>
              <v-col class="col-md-12 col-12">
            <FormsFieldsSelectComponent  v-model="search.store" :items="storeList.data" item-value="id" item-text="name" label="Tienda">
            </FormsFieldsSelectComponent>
          </v-col>

          <v-col class="col-md-6 col-12">
            <FormsFieldsTextComponent type="date" v-model="search.start_date" label="Fecha desde">
            </FormsFieldsTextComponent>
          </v-col>
          <v-col class="col-md-6 col-12">
            <FormsFieldsTextComponent type="date" v-model="search.end_date" label="Fecha hasta">
            </FormsFieldsTextComponent>
          </v-col>
        </v-row>

          </v-card-text>
        </GeneralCardComponent>
      </v-col>
      <v-col class="col-12">
        <accountingCashFlowComponent :search="search"></accountingCashFlowComponent>
      </v-col>
    </v-row>
    <accountingCreatePaymentsComponent v-model="paymentsModal"></accountingCreatePaymentsComponent>
  </v-container>
</template>

<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions.js'
  import moment from 'moment'
  export default {
    mixins: [dateFunctions],
    data() {
      return {
        headers: [{
          text: 'Fecha',
          value: 'createdAt'
        }, {
          text: 'Tipo',
          value: 'type'
        }, {
          text: 'Nombre / Razon social',
          value: 'name'
        }, {
          text: 'Moneda',
          value: 'currency'
        }, {
          text: 'Monto',
          value: 'amount'
        }, {
          text: 'Cambiar estado',
          value: 'change_status'
        }, {
          text: 'Generar factura',
          value: 'invoice'
        }],
        search:{
          store:{
            name:''
          }
        },
        paymentsModal:false,
        storeList:{
          data:[]
        }
      }
    },
    created(){
      this.search.start_date = moment().subtract(7, "days").format("YYYY-MM-DD")
      this.search.end_date = moment().add(1,'days').format("YYYY-MM-DD")
      this.getStores()
    },
    methods:{
      async getStores() {
        this.storeList = await this.$store.dispatch('store/findAll', {
          company: this.$auth.user.company.id
        })
        this.search.store = this.storeList.data[0]?.id
      },
    }
  }

</script>

<style>

</style>
