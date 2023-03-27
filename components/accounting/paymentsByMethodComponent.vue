<template>
    <generalCardComponent elevation="6">
      <GeneralCardTitleComponent class="primary white--text">
        Ingresos segun metodo de pago
      </GeneralCardTitleComponent>
      <v-card-text>
        <generalGraphComponent type="bar" :labels="labels" :data="incomeData" :colors="['#ff6240']">
        </generalGraphComponent>


      </v-card-text>
    </generalCardComponent>
  </template>
  
  <script>
  
  export default {
    props:{
        search: {
            type: Object,
            required: true
        }
    },
    data() {
      return {
        labels: [],
        incomeData:[]
      };
    },
    created() {
      this.getIncome();
    },
    methods: {
      async getIncome() {
        console.log(this.search.store)
        await this.$axios.get(`/webservices/payments/${this.search.store.name}`, {
          params: {
            ...this.search,
            method:'dayAndMethod'
          }
        }).then((data) => {
          this.incomeData = Object.values(data.data).reduce((acc, payments) => {
  Object.entries(payments).forEach(([paymentMethod, amount]) => {
    let dataItem = acc.find(item => item.name === paymentMethod);
    if (!dataItem) {
      dataItem = {
        chartType: 'bar',
        name: paymentMethod,
        values: 0
      };
      acc.push(dataItem);
    }
    dataItem.values += amount;
  });
  return acc;
}, []);
        this.incomeData = this.incomeData.map((item)=>{
            return {
                chartType: 'bar',
                name: item.name,
                values: [item.values]
            }
        })
        this.labels = ['Valor en Euros']
      })

    }
},
  };
  
  </script>
  