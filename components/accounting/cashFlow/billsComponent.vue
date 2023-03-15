<template>
  <div>
    <GeneralCardTitleComponent class="primary white--text">
      Gastos
    </GeneralCardTitleComponent>
    <v-card-text>
      <generalGraphComponent type="bar" :labels="labelsPayments"
        :data="[{ values: paymentsGraph, chartType: 'line', name: 'Gastos' }]" :colors="['#ff6240']">
      </generalGraphComponent>
    </v-card-text>
    <v-card-text>
      <v-data-table :headers="headers" :items="payments.data" hide-default-footer>
        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | formatDate  }}
        </template>

        <template v-slot:item.amount="{ item }">
          {{ item.amount  }} EUR
        </template>
      </v-data-table>
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

// Axios GET request with query parameters for populating fields
const { data } = await this.$axios.get('/payments/', {
  params: {
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
