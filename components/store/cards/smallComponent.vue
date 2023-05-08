<template>
    <GeneralCardComponent class="mx-auto">
      <generalCardTitleComponent class="primary white--text">{{ store.name }}</generalCardTitleComponent>
      <v-divider></v-divider>
      <v-card-text class="small-card-container">
        <v-data-table item-key="id" show-expand single-expand :loading="loading" loading-text="Cargando ordenes"
          disable-pagination disable-sort calculate-widths disable-filtering :items="data.orders"
          :headers="filteredColumns" hide-default-footer :items-per-page="10">
          <template v-slot:item.creation_date="{ item }">
            {{ item.creation_date | formatDate }}
          </template>
          <template v-slot:item.cost="{ item }">
            € {{ item.cost }}
          </template>
          <template v-slot:item.product.image_url="{ item }">
            <img :src="item.product.image_url" width="100%" height="80">
          </template>
  
          <!--
            <template v-slot:item.tracking_number="{ item }">
              {{ item.extra.tracking_number }}
          </template>
          <template v-slot:item.net_price="{ item }">
              {{ item.extra.net_price }}
          </template>
  
            -->
  
          <template v-slot:item.products="{ item }">
            <div class="full-width d-flex flex-column">
              <v-chip small label outlined v-for="product in item.products" :key="product.id" class="mr-2 my-2">
                {{ product.name }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.order.status="{ item }">
            <storeChipsStatusComponent :status="item.order.status"></storeChipsStatusComponent>
          </template>
          <template v-slot:item.product.tracking_number="{ item }">
  
            <v-edit-dialog @close="updateTrackingOrder(item)" save-text="Guardar" cancel-text="Guardar"
              @save="updateTrackingOrder(item)">
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
  
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="pa-4">
              <ordersIncidencesComponent :store="store.id" :order="item" @refresh="getStore()">
              </ordersIncidencesComponent>
            </td>
          </template>
        </v-data-table>
  
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-pagination v-model="search.page" :length="data.total_pages" circle></v-pagination>
      </v-card-actions>
  
    </GeneralCardComponent>
  </template>
  
  <script>
    import dateFunctions from '~/plugins/mixins/dateFunctions';
    import moment from 'moment'
    export default {
      mixins: [dateFunctions],
      name: 'storeCardComponent',
      props: {
        store: {
          type: Object,
          required: true
        }
      },
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
            state: "2",
            pageSize: 10,
          },
          stateItems: [{
              value: "0",
              text: "En espera de pago"
            },
            {
              value: "2",
              text: "Pago aceptado"
            },
            {
              value: "1",
              text: "Preparación en curso"
            },
            {
              value: "3",
              text: "En espera de envío"
            },
            {
              value: "4",
              text: "Enviado"
            },
            {
              value: "5",
              text: "Entregado"
            },
            {
              value: "6",
              text: "Cancelado por el cliente"
            },
            {
              value: "7",
              text: "Cancelado por el administrador"
            },
            {
              value: "8",
              text: "Producto(s) pendiente(s)"
            },
            {
              value: "9",
              text: "Devolución"
            },
            {
              value: "10",
              text: "Cambio"
            },
            {
              value: "",
              text: "Estado desconocido"
            }
          ],
  
          columns: [{
              text: 'Order ID',
              value: 'order.id',
              align: 'left',
              visible: true,
            },
            {
              align: 'left',
              text: 'Date',
              value: 'order.date_add',
              align: 'left',
              visible: true,
            },
            {
              text: 'Status',
              value: 'order.status',
              align: 'left',
              visible: true,
            },
            {
              text: 'TotalPrice',
              value: 'product.price',
              align: 'left',
              visible: true,
            },
  
          ],
          loading: false,
          data: {
            orders: [],
            total_pages: 0,
            total_count: 0
          },
          order: {},
          showOrderModal: false,
  
        }
      },
      mounted() {
        this.search.startDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
        this.search.endDate = moment().format('YYYY-MM-DD')
        this.getStore()
      },
      methods: {
        showOrder(item) {
          this.order = item
          this.showOrderModal = true
        },
        getStore() {
          this.loading = true
          this.$axios.get(`/webservices/orderList/${this.store.id}`, {
              params: this.search
            })
            .then((response) => {
              this.loading = false
              this.data = response.data
            }).catch(() => {
              this.loading = false
            })
        },
        setValue(symbol, value) {
          if (!value) return 'Not setted'
          return `${symbol} ${value}`
        },
        async updateTrackingOrder(order) {
          const data = {
            product_id: order.product.id,
            store_id: this.store.id,
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
          this.getStore()
        }
      }
    }
  
  </script>
  <style scoped>
  .small-card-container{
    height: 500px;
    overflow-x: auto;

  }
  </style>