<template>
  <GeneralCardComponent class="mx-auto">
    <generalCardTitleComponent class="primary white--text">Todos los pedidos</generalCardTitleComponent>
    <v-divider></v-divider>
    <v-card-title>
      <v-card outlined class="rounded-lg">
        <v-card-title>

          <v-row>
            <v-col class="col-md-11 col-12">
              <v-row>
                <v-col class="col-md-2 col-12">
                  <FormsFieldsTextComponent v-model="search.customer" label="Cliente"></FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <FormsFieldsTextComponent v-model="search.product" label="Producto"></FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <FormsFieldsTextComponent v-model="search.reference" label="Referencia">
                  </FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <FormsFieldsTextComponent v-model="search.startDate" type="date" label="Fecha inicio">
                  </FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <FormsFieldsTextComponent v-model="search.endDate" type="date" label="Fecha fin">
                  </FormsFieldsTextComponent>
                </v-col>
                <v-col class="col-md-2 col-12">
                  <FormsFieldsSelectComponent :items="stateItems" v-model=search.state label="Estado">
                  </FormsFieldsSelectComponent>
                </v-col>

              </v-row>

            </v-col>
            <v-col class="col-md-1 col-12 d-flex justify-center align-center">
              <v-btn fab class="primary white--text mt-4" @click="getAllOrders()">
                <v-icon>mdi-filter</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </v-card-title>
    <v-card-title>
      <v-card outlined>
        <v-row no-gutters>
          <v-switch v-model="col.visible" :label="col.text" class="mr-2 my-2" v-for="col in columns" :key="col.value">
          </v-switch>
        </v-row>
      </v-card>

    </v-card-title>
    <v-card-text>
      <v-data-table item-key="id" show-expand single-expand :loading="loading" loading-text="Cargando ordenes"
        disable-pagination disable-sort calculate-widths disable-filtering :items="data.orders"
        :headers="filteredColumns" hide-default-footer :items-per-page="10">
        <template v-slot:item.creation_date="{ item }">
          {{ item.creation_date | formatDate }}
        </template>
        <template v-slot:item.cost="{ item }">
          € {{ item.cost }}
        </template>
        <template v-slot:item.delivery_address.address1="{ item }">
           {{ item.delivery_address | delivery_address }}
        </template>
        <template v-slot:item.profit="{ item }">
           {{ calcProfit(item) }}
        </template>

        <template v-slot:item.order.status="{ item }">
          <storeChipsStatusComponent :status="item.order.status"></storeChipsStatusComponent>
        </template>
        <template v-slot:item.product.tracking_number="{ item }">
          <v-edit-dialog @close="updateTrackingOrder(item)" save-text="Guardar" cancel-text="Guardar">
            <v-text-field hide-details outlined dense height="20" readonly
              :value="setValue('#',item.product.tracking_number)"></v-text-field>
            <template v-slot:input>
              <v-text-field v-model="item.product.tracking_number" label="Edit"></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.product.net_price="{ item }">
          <v-edit-dialog @close="updateTrackingOrder(item)">
            <v-text-field hide-details outlined dense height="20" readonly
              :value="setValue('€',item.product.net_price)"></v-text-field>
            <template v-slot:input>
              <v-text-field v-model="item.product.net_price" label="Edit" counter></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.product.image_url="{ item }">
          <img :src="item.product.image_url" width="100%" height="80">
        </template>
        <template v-slot:item.copy="{ item }">
          <v-btn rounded color="primary" @click="copyToClipboard(item)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-4">
            <ordersIncidencesComponent :store="item.storeId" :order="item" @refresh="getAllOrders()"></ordersIncidencesComponent>
          </td>
        </template>
      </v-data-table>

    </v-card-text>
    <v-card-actions class="d-flex justify-center">
      <v-pagination v-model="search.page" :length="data.total_pages" circle></v-pagination>
    </v-card-actions>
    <v-snackbar v-model="copyOrderSnackbar">Success to copy!</v-snackbar>
  </GeneralCardComponent>
</template>

<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  import moment from 'moment'
  import columnsMixin from '~/plugins/mixins/columnsMixin';
  import stateMixin from '~/plugins/mixins/stateMixins';
import storeMixin from '~/plugins/mixins/storeMixin';
export default {
    filters:{
      delivery_address: function (value) {
        return (value.address1 !=" ") ? value.address1 : value.address2 
      }
    },
    mixins: [dateFunctions,columnsMixin,stateMixin,storeMixin],
    name: 'storeCardComponent',
    data() {
      return {
        expanded: [],
        mode: 'list',
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        search: {
          page: 1,
          state: "2"
        },
        loading: false,
        copyOrderSnackbar: false,
        data: {
          orders: [],
          total_pages: 0,
          total_count: 0
        },
        order: {},
        showOrderModal: false,
        updateTrackingProduct: {},

      }
    },
    mounted() {
      this.search.startDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
      this.search.endDate = moment().format('YYYY-MM-DD')
      this.getAllOrders()
    },
    methods: {
      showOrder(item) {
        this.order = item
        this.showOrderModal = true
        console.log(this.order)
      },
      getAllOrders() {
        this.loading = true
        this.$axios.get(`/webservices/orderListallstores/`, {
            params: {
              ...this.search,
              company: this.$auth.user.company.id
            },
          })
          .then((response) => {
            this.loading = false
            console.log(this.loading)
            this.data = response.data
          }).catch(() => {
            this.loading = false
          })
      },
      setProduct(order, product) {
        this.updateTrackingProduct = {
          order_id: order.order.id,
          product_id: product.item.id,
        }
      },
      async updateTrackingOrder(order) {
        const data = {
          product_id: order.product.id,
          store_id: order.storeId,
          order_id: order.order.id,
          net_price: order.product.net_price,
          tracking_number: order.product.tracking_number,
          complete_order_data: order
        }
        try {
          if (order.product.extra_id) {
            await this.$axios.put(`/orders/${order.product.extra_id}`, {
              data: data
            })
          } else {
            const {
              data: response
            } = await this.$axios.post(`/orders/`, {
              data: data
            })
            const index = this.data.orders.findIndex((item) => item.id == order.id)
            this.$set(this.data.orders, index, {
              ...this.data.orders[index],
              product: {
                ...this.data.orders[index].product,
                extra_id: response.data.id
              }
            })
          }
          if (order.product.tracking_number && order.product.tracking_number.length > 6)
            this.$axios.post('/orders/tracking', data)

        } catch (e) {
          console.log(e)
        }
      },

    },
    computed: {
      filteredColumns() {
        return this.columns.filter(col => col.visible)
      },
    },
    watch: {
      "search.page": function () {
        this.getAllOrders()
      }
    }
  }

</script>
