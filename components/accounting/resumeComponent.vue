<template>
  <GeneralCardComponent>
    <GeneralCardTitleComponent class="primary white--text">
      Resumen
    </GeneralCardTitleComponent>
    <v-card-title>
      <formsFieldsSelectMonthComponent label="Seleccione el rango de fechas" @dateUpdated="selectedMonth = $event">
      </formsFieldsSelectMonthComponent>
    </v-card-title>
    <v-data-table :headers="headers" :items="data" hide-default-footer>
    </v-data-table>
  </GeneralCardComponent>

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
        data: []
      }
    },
    created() {
      this.getPayments()
      this.$root.$on('refresh', (data) => {
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
            EXTRAS: 0
          }]
        } else {
          this.data = await this.groupedByType(data.data, incomes);
          console.log(this.data)
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
          EXTRAS: 0
        };

        return [Object.values(groupedData).reduce((acc, group) => {
          group.forEach(item => {
            acc[item.type] += item.amount;
          });
          return acc;
        }, initialRow)];
      }
    },
    watch: {
      "selectedMonth": function () {
        this.getPayments()
      },

    }
  }

</script>

<style>

</style>
