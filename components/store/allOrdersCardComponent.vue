<template>
  <GeneralCardComponent>
    <v-card-text class="primary white--text">
      <GeneralCardComponent color="transparent" outlined>
        <v-card-text>
          <v-row no-gutters>
            <v-col class="col-md-10">
              <v-row>
                <v-col class="col-md-6">
                  <FormsFieldsTextComponent hide-details type="date"></FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-md-6">
                  <FormsFieldsTextComponent hide-details type="date"></FormsFieldsTextComponent>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="col-md-2 d-flex justify-center align-center">
              <v-btn x-large height="80" color="secondary" rounded>
                <v-icon color="black">mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </GeneralCardComponent>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table :loading="loading" loading-text="Cargando ordenes" disable-pagination disable-sort calculate-widths disable-filtering :items="data" :headers="columns"
        hide-default-footer :items-per-page="10">
        <template v-slot:item.regarding="{ item }">
          <storeChipsStatusComponent :status="item.regarding"></storeChipsStatusComponent>
        </template>
        <template v-slot:item.creation_date="{ item }">
          {{ item.creation_date | formatDate }}
        </template>
        <template v-slot:item.products="{ item }">
          <div class="full-width d-flex flex-column">
            <v-chip small label outlined v-for="product in item.products" :key="product.id" class="mr-2 my-2">
              {{ product.product_name }}
            </v-chip>
          </div>
        </template>
        <template v-slot:item.storeName="{ item }">
          <v-chip label small color="primary" class="elevation-1">
            {{ item.storeName }}
          </v-chip>
        </template>
        <template v-slot:item.show="{ item }">
          <v-btn color="secondary" fab small elevation="3" @click="showOrder(item)">
            <v-icon color="BLACK">mdi-eye</v-icon>
          </v-btn>
        </template>

      </v-data-table>
    </v-card-text>
    <v-card-actions class="d-flex justify-center">
      <v-btn-toggle rounded>
        <v-btn color="secondary" :disabled="search.page ==1" @click="search.pagination.page--">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn color="secondary" @click="search.pagination.page++">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-actions>
    <storeOrderViewComponent :orderData="order" v-model="showOrderModal"></storeOrderViewComponent>
  </GeneralCardComponent>
</template>


<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  import qs from 'qs';
  export default {
    mixins:[dateFunctions],
    name: 'storeCardComponent',
    data() {
      return {
        store: {},
        mode: 'list',
        search:{
          pagination:{
            page:1
          }
        },
        columns: [{
            align: 'left',
            text: 'Id Pedido',
            value: 'id',
          },
          {
            align: 'left',
            text: 'Total',
            value: 'cost',
          },
          {
            align: 'center',
            text: 'Estado',
            value: 'regarding',
          },
          {
            align: 'left',
            text: 'Metodo de pago',
            value: 'payment',
          },
          /*                     {name: 'owner', align: 'left', label: 'Owner', field: 'owner', sortable: true}, */
          {
            align: 'left',
            text: 'Fecha',
            value: 'creation_date',
          },
          {
            align: 'left',
            text: 'Productos',
            value: 'products',
          },
          {
            align: 'left',
            text: 'Tienda',
            value: 'storeName',
          },
          {
            text: 'Ver',
            value: 'show',
          },


        ],
        loading:false,
        data: [],
          order:{},
          showOrderModal: false

      }
    },
    mounted() {
      this.getAllOrders()
    },
    methods: {
      showOrder(item){
        this.order = item
        this.showOrderModal = true
        console.log(this.showOrderModal)
      },
      getAllOrders() {
        this.loading = true
        this.data = []
        this.$axios.get(`/webservices/orderListallstores/`,{
          params:{
            ...this.search,
            company:this.$auth.user.company.id
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'brackets' });
        },

        })
          .then((response) => {
            this.loading = false
            console.log(this.loading)
            this.data = response.data.map((order) => {
              return {
                id: order.id,
                cost: `€ ${parseInt(order.total_paid).toFixed(2)}`,
                regarding: order.current_state,
                creation_date: order.date_add,
                storeName: order.storeName,
                payment: order.payment,
                products: order.associations.order_rows,
              }
            })
          }).catch(()=>{
              this.loading = false
            })
      },
      exportTable() {
        // naive encoding to csv format
        const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
          this.data.map(row => this.columns.map(col => wrapCsvValue(
            typeof col.field === 'function' ?
            col.field(row) :
            row[col.field === void 0 ? col.name : col.field],
            col.format
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'activity.csv',
          content,
          'text/csv'
        )

        if (status !== true) {
          this.$q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          })
        }
      },

    },
    watch:{
      search:{
        handler(){
          this.getAllOrders()
        },
        deep:true
      }
    }
  }

</script>

<style>

</style>
