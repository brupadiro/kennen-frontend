<template>
  <v-row>
    <v-col class="col-12">
      <generalCardComponent elevation="6">
      <GeneralCardTitleComponent class="primary white--text">
        Ingresos
      </GeneralCardTitleComponent>
      <v-card-title>
        <FormsFieldsSelectComponent label="Filtrar por..." v-model="type" :items="itemsFilters">
        </FormsFieldsSelectComponent>
      </v-card-title>
      <v-card-text>
        <generalGraphComponent type="bar" :labels="labels"
          :data="[{ values: incomeData, chartType: graphType, name: 'Ingresos' }]" :colors="['#ff6240']">
        </generalGraphComponent>
      </v-card-text>
    </generalCardComponent>

    </v-col>
    <v-col class="col-12">
      <GeneralCardComponent>
      <GeneralCardTitleComponent class="primary white--text">
        Gastos
      </GeneralCardTitleComponent>
      <v-card-text>
        <generalGraphComponent type="bar" :labels="labelsPayments"
          :data="[{ values: paymentsGraph, chartType: 'line', name: 'Gastos' }]" :colors="['#ff6240']">
        </generalGraphComponent>
      </v-card-text>
    </GeneralCardComponent>
    </v-col>
    <v-col class="col-12">


    </v-col>
    <accountingCreatePaymentsComponent v-model="paymentsModal"></accountingCreatePaymentsComponent>
  </v-row>

</template>

<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  import moment from 'moment';
  import qs from 'qs';
  import _ from 'lodash';
  export default {
    props: {
      paymentsModal: {
        type: Boolean,
        required: true
      }
    },
    mixins: [dateFunctions],
    props: {
      search: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        itemsFilters: [{
            text: 'Dia',
            value: 'day'
          },
          {
            text: 'Mes',
            value: 'month'
          },
          {
            text: 'Año',
            value: 'year'
          }, {
            text: 'Producto',
            value: 'product'
          }
        ],
        type: 'day',
        paymentsModal: false,
        labels: [],
        labelsPayments: [],
        periods: ["día", "semana", "mes"],
        selectedPeriod: "mes",
        incomeData: [],
        groupedData:[],
        payments: {
          data: []
        },
        selectedMonth:{},
        paymentsGraph: [],
      };
    },
    mounted() {
      this.$root.$on('refresh', (data) => {
        this.getIncome();
        this.getPayments();
      })
    },
    methods: {
      // This function fetches payment data from the API endpoint
      async getPayments() {

        // Axios GET request with query parameters for populating fields
        const {
          data
        } = await this.$axios.get('/payments/', {
          params: {
            filters: {
              store: this.search.store,
              createdAt: {
                $gte: this.search.start_date,
                $lte: this.search.end_date
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

        // Extracting only the relevant payment data from the response object
        const paymentsData = data.data;
        console.log(paymentsData)
        // Grouping payment data by date using reduce function
        const grouped = paymentsData.reduce((acc, obj) => {
          const date = moment(obj.publishedAt).format('DD/MM/YYYY');
          (acc[date] || (acc[date] = [])).push(obj);
          return acc;
        }, {});

        // Calculating total amount for each group and storing it in a new variable
        const paymentsGraph = {};
        for (const [key, group] of Object.entries(grouped)) {
          paymentsGraph[key] = group.reduce((sum, obj) => sum + obj.amount, 0);
        }

        // Storing the dates as labels and the payment totals as values for graph display
        this.labelsPayments = Object.keys(paymentsGraph);
        this.paymentsGraph = Object.values(paymentsGraph);
      },

      async getIncome() {
        if(!this.search.store){
          return
        }

        const data = await this.getIncomeData(this.type, this.search)
        this.incomeData = Object.values(data)
          for (let i in data.data) {
            this.labels.push(i)
          }
          this.labels = Object.keys(data)

      },
      async getIncomeData(type, search) {
        const {data:data} = await this.$axios.get(`/webservices/payments/${search.store}`, {
          params: {
            ...search,
            method: type
          }
        })
        return data
      },
    },
    computed:{
      graphType(){
        switch(this.type){
          case 'day':
            return 'line'
          case 'month':
            return 'bar'
          case 'year':
            return 'bar'
          case 'product':
            return 'bar'
        }
      }
    },
    watch:{
      type() {
        this.getIncome()
      }
    }
  };

</script>

<style>
</style>
