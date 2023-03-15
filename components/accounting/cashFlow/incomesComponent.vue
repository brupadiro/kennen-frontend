<template>
    <div>
      <GeneralCardTitleComponent class="primary white--text">
        Ingresos
      </GeneralCardTitleComponent>
      <v-card-text>
        <generalGraphComponent type="bar" :labels="labels"
          :data="[{ values: incomeData, chartType: 'line', name: 'Ingresos' }]" :colors="['#ff6240']">
        </generalGraphComponent>
      </v-card-text>
    </div>
  </template>

<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  import moment from 'moment';
  import qs from 'qs';
  import _ from 'lodash';
  export default {
    props:{
      paymentsModal:{
        type:Boolean,
        required:true
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
        paymentsModal:false,
        labels: [],
        labelsPayments: [],
        headers: [{
            text: 'Fecha',
            value: 'createdAt'
          },
          {
            text: 'Tipo',
            value: 'type'
          },
          {
            text: 'Tienda',
            value: 'webservice.name'
          },
          {
            text: 'Valor',
            value: 'amount'
          },
          {
            text: 'Estado',
            value: 'status'
          },
          {
            text: 'Comentarios',
            value: 'comments'
          }
        ],
        periods: ["día", "semana", "mes"],
        selectedPeriod: "mes",
        incomeData: [],
        payments: {
          data: []
        },
        paymentsGraph: [],
      };
    },
    mounted() {
      this.getIncome();
      this.getPayments();
      this.$root.$on('refresh',(data)=>{
        this.getIncome();
        this.getPayments();
      })
    },
    methods: {
      async getPayments() {
        this.$axios.get('/payments/', {
          params: {
            filters: {
              webservice:{
                name:this.search.store.name
              },
              createdAt:{
                $lte:this.search.end_date,
                $gte:this.search.start_date
              }
            },
            populate: '*'
          },
          paramsSerializer: params => {
        return qs.stringify(params, {
          arrayFormat: 'brackets'
        })
      }

        }).then((data) => {
          this.payments = data.data
          const grouped = _.groupBy(this.payments.data, obj => moment(obj.publishedAt).format('DD/MM/YYYY'));
          this.paymentsGraph = _.mapValues(grouped, group => {
            const total = _.reduce(group, (sum, obj) => sum + obj.amount, 0);
            return total;
          });
          this.labelsPayments = Object.keys(this.paymentsGraph);
          this.paymentsGraph = Object.values(this.paymentsGraph);
        })
      },
      async getIncome() {
        await this.$axios.get(`/webservices/payments/${this.search.store}`, {
          params: {
            ...this.search,
            method: 'day'
          }
        }).then((data) => {
          this.incomeData = Object.values(data.data)
          for (let i in data.data) {
            this.labels.push(i)
          }
          this.labels = this.labels.reverse()
        })
      },
    },
    watch: {
      search: {
        handler(){
          this.getIncome()
          this.getPayments()
        },
        deep:true
      },
      "search.start_date": function () {
        this.getIncome()
      },
      "search.end_date": function () {
        this.getIncome()
      },
    }
  };

</script>

<style>
</style>
