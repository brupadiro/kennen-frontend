<template>
  <div>
    <GeneralCardComponent>
      <GeneralCardTitleComponent class="primary white--text">
        Resumen
        <v-spacer></v-spacer>
        <v-btn icon outlined @click="toggleFullScreen = !toggleFullScreen">
          <v-icon v-if="toggleFullScreen" color="white">mdi-window-minimize</v-icon>
          <v-icon v-else color="white">mdi-window-maximize</v-icon>
        </v-btn>
      </GeneralCardTitleComponent>
      <v-card-title>
        <formsFieldsSelectMonthComponent label="Seleccione el rango de fechas" @dateUpdated="selectedMonth = $event">
        </formsFieldsSelectMonthComponent>
      </v-card-title>
      <v-data-table :headers="headers" :items="data" hide-default-footer>
        <template v-slot:item.FACTURACION="{ item }">
          {{ item.FACTURACION.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.COMISION="{ item }">
          {{ item.COMISION.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.PUBLI="{ item }">
          {{ item.PUBLI.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.SERVER="{ item }">
          {{ item.SERVER.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.REEMBOLSOS="{ item }">
          {{ item.REEMBOLSOS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.PAGOS_CHINO="{ item }">
          {{ item.PAGOS_CHINO.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.AT_CLIENTE="{ item }">
          {{ item.AT_CLIENTE.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.ABOGADA="{ item }">
          {{ item.ABOGADA.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.EXTRAS="{ item }">
          {{ item.EXTRAS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
        <template v-slot:item.TOTAL_GASTOS="{ item }">
          {{ item.TOTAL_GASTOS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
        </template>
      </v-data-table>
      <v-card-subtitle class="primary py-0">
        <v-list dense color="transparent">
          <v-list-item>
            <v-list-item-avatar color="secondary">
              <v-icon color="black">mdi-bank</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle class="font-weight-bold white--text">Total</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action-text class="font-weight-bold text-subtitle-2 white--text">
              € {{resumeIncomes}}
            </v-list-item-action-text>
          </v-list-item>
        </v-list>
      </v-card-subtitle>
    </GeneralCardComponent>

    <v-dialog v-model="toggleFullScreen" persistent>
      <GeneralCardComponent>
        <GeneralCardTitleComponent class="primary white--text">
          Detalles
          <v-spacer></v-spacer>
          <v-btn icon outlined @click="toggleFullScreen = !toggleFullScreen">
            <v-icon v-if="toggleFullScreen" color="white">mdi-window-minimize</v-icon>
            <v-icon v-else color="white">mdi-window-maximize</v-icon>
          </v-btn>
        </GeneralCardTitleComponent>
        <v-data-table :headers="headersExpanded" :items="paymentsExpandData" :items-per-page="-1" hide-default-footer>
          <template v-slot:item.FACTURACION="{ item }">
            {{ item.FACTURACION.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.COMISION="{ item }">
            {{ item.COMISION.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.PUBLI="{ item }">
            {{ item.PUBLI.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.SERVER="{ item }">
            {{ item.SERVER.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.REEMBOLSOS="{ item }">
            {{ item.REEMBOLSOS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.PAGOS_CHINO="{ item }">
            {{ item.PAGOS_CHINO.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.AT_CLIENTE="{ item }">
            {{ item.AT_CLIENTE.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.ABOGADA="{ item }">
            {{ item.ABOGADA.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.EXTRAS="{ item }">
            {{ item.EXTRAS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.TOTAL_GASTOS="{ item }">
            {{ item.TOTAL_GASTOS.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) }}
          </template>
          <template v-slot:item.id="{ item }">
            <v-btn fab small rounded color="red" elevation="3" @click="deletePayment(item.id)" class="my-3">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
          </template>


        </v-data-table>
        <v-card-subtitle class="primary py-0">
          <v-list dense color="transparent">
            <v-list-item>
              <v-list-item-avatar color="secondary">
                <v-icon color="black">mdi-bank</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle class="font-weight-bold white--text">Total</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action-text class="font-weight-bold text-subtitle-2 white--text">
                € {{resumeIncomes}}
              </v-list-item-action-text>
            </v-list-item>
          </v-list>
        </v-card-subtitle>
      </GeneralCardComponent>

    </v-dialog>
    <v-snackbar color="success" class="black--text" v-model="paymentSnack">
      Pago eliminado correctamente
    </v-snackbar>
  </div>

</template>

<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  import moment from 'moment';
  import qs from 'qs';
  export default {
    props: {
      search: {
        type: Object,
        required: true
      }
    },
    mixins: [dateFunctions],
    data() {
      return {
        selectedMonth: {
          start: moment().startOf('month').format('YYYY-MM-DD'),
          end: moment().endOf('month').format('YYYY-MM-DD')
        },
        paymentSnack: false,
        headersExpanded: [{
          text:'Fecha',
          value:'date'
        },{
            text: 'FACTURACION',
            value: 'FACTURACION'
          },
          {
            text: 'COMISION',
            value: 'COMISION'
          },
          {
            text: 'PUBLI',
            value: 'PUBLI'
          },
          {
            text: 'SERVER',
            value: 'SERVER'
          },
          {
            text: 'REEMBOLSOS',
            value: 'REEMBOLSOS'
          },
          {
            text: 'PAGOS CHINO',
            value: 'PAGOS_CHINO'
          },

          {
            text: 'AT.CLIENTE',
            value: 'AT_CLIENTE'
          },
          {
            text: 'ABOGADA',
            value: 'ABOGADA'
          },
          {
            text: 'EXTRAS',
            value: 'EXTRAS'
          },
          {
            text: 'ELIMINAR',
            value: 'id'
          },


        ],

        headers: [{
            text: 'FACTURACION',
            value: 'FACTURACION'
          },
          {
            text: 'COMISION',
            value: 'COMISION'
          },
          {
            text: 'PUBLI',
            value: 'PUBLI'
          },
          {
            text: 'SERVER',
            value: 'SERVER'
          },
          {
            text: 'REEMBOLSOS',
            value: 'REEMBOLSOS'
          },
          {
            text: 'PAGOS CHINO',
            value: 'PAGOS_CHINO'
          },

          {
            text: 'AT.CLIENTE',
            value: 'AT_CLIENTE'
          },
          {
            text: 'ABOGADA',
            value: 'ABOGADA'
          },
          {
            text: 'EXTRAS',
            value: 'EXTRAS'
          },


        ],
        data: [{
          FACTURACION: 0,
          TOTAL_GASTOS: 0,
          COMISION: 0,
          PUBLI: 0,
          SERVER: 0,
          REEMBOLSOS: 0,
          PAGOS_CHINO: 0,
          AT_CLIENTE: 0,
          ABOGADA: 0,
          EXTRAS: 0,

        }],
        paymentsExpandData: [],
        toggleFullScreen: false,
      }
    },
    created() {
      this.$root.$on('refresh', (data) => {
        console.log(this.search)
        this.getPayments();
      })

    },
    methods: {
      async getIncomeData() {
        const {
          data: data
        } = await this.$axios.get(`/webservices/payments/${this.search.store}`, {
          params: {
            ...this.selectedMonth,
            method: 'month'
          }
        })
        return data
      },
      async getPayments() {

        // Axios GET request with query parameters for populating fields
        const {
          data
        } = await this.$axios.get('/payments/', {
          params: {
            filters: {
              store: this.search.store,
              createdAt: {
                $gte: this.selectedMonth.start_date,
                $lte: this.selectedMonth.end_date
              }
            },
            populate: '*'
          },
          // Params serializer to format query parameters
          paramsSerializer: params => {
            return qs.stringify(params, {
              arrayFormat: 'brackets'
            });
          }
        });
        var incomes = await this.getIncomeData()
        incomes = Object.values(incomes).reduce((acc, item) => {
          acc = item;
          return acc;
        }, {})


        // Extracting only the relevant payment data from the response object
        if (data.data.length == 0) {
          this.data = [{
            FACTURACION: incomes,
            COMISION: 0,
            PUBLI: 0,
            SERVER: 0,
            REEMBOLSOS: 0,
            PAGOS_CHINO: 0,
            AT_CLIENTE: 0,
            ABOGADA: 0,
            EXTRAS: 0,
            TOTAL_GASTOS: 0
          }]
        } else {
          this.data = await this.groupedByType(data.data, incomes);
          this.paymentsExpandData = this.groupedByTypeExpanded(data.data);
        }
      },
      async groupedByType(values, incomes) {
        const groupedData = _.groupBy(values, 'type');

        const initialRow = {
          FACTURACION: incomes,
          COMISION: 0,
          PUBLI: 0,
          SERVER: 0,
          REEMBOLSOS: 0,
          PAGOS_CHINO: 0,
          AT_CLIENTE: 0,
          ABOGADA: 0,
          EXTRAS: 0,
          TOTAL_GASTOS: 0
        };

        const result = Object.values(groupedData).reduce((acc, group) => {
          group.forEach(item => {
            acc[item.type] += item.amount;
          });
          return acc;
        }, initialRow);

        result.TOTAL_GASTOS = values.reduce((acc, item) => acc + item.amount, 0);

        // Formatear las cantidades con el símbolo de euros

        return [result];


      },
      groupedByTypeExpanded(values) {
        // Crear un objeto vacío para almacenar los datos formateados
        const formattedData = values.map(item => {
          return {
            id: item.id,
            date: item.date,
            FACTURACION: item.type === 'FACTURACION' ? item.amount : 0,
            COMISION: item.type === 'COMISION' ? item.amount : 0,
            PUBLI: item.type === 'PUBLI' ? item.amount : 0,
            SERVER: item.type === 'SERVER' ? item.amount : 0,
            REEMBOLSOS: item.type === 'REEMBOLSOS' ? item.amount : 0,
            PAGOS_CHINO: item.type === 'PAGOS_CHINO' ? item.amount : 0,
            AT_CLIENTE: item.type === 'AT_CLIENTE' ? item.amount : 0,
            ABOGADA: item.type === 'ABOGADA' ? item.amount : 0,
            EXTRAS: item.type === 'EXTRAS' ? item.amount : 0,
            TOTAL_GASTOS: item.amount
          };
        });

        // Devolver los datos formateados
        return formattedData;
      },
      deletePayment(id) {
        this.$axios.delete(`/payments/${id}`)
          .then(() => {
            this.paymentSnack = true;
            this.paymentsExpandData = this.paymentsExpandData.filter(item => item.id !== id);
            this.$root.$emit('refresh');
          })
          .catch(err => {
            console.log(err);
          });
      },

    },
    computed: {
      resumeIncomes() {
        return this.data[0].FACTURACION - this.data[0].TOTAL_GASTOS
      }
    },
    watch: {
      "selectedMonth": function () {
        if (this.search.store)
          this.getPayments()
      },

    }
  }

</script>

<style>

</style>
