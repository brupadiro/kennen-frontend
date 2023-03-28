<template>
  <GeneralCardComponent class="mx-auto">
    <generalCardTitleComponent class="primary white--text">Todos los pedidos</generalCardTitleComponent>
    <v-divider></v-divider>
    <v-card-title>
      <v-row>
        <v-col class="col-md-11 col-12">
          <v-row>
            <v-col cols="12" md="6">
              <FormsFieldsTextComponent v-model="search.customer" placeholder="Cliente"></FormsFieldsTextComponent>
            </v-col>
            <v-col cols="12" md="6">
              <FormsFieldsTextComponent v-model="search.product" placeholder="Producto"></FormsFieldsTextComponent>
            </v-col>
            <v-col cols="12" md="6">
              <FormsFieldsTextComponent v-model="search.startDate" type="date" placeholder="Fecha inicio">
              </FormsFieldsTextComponent>
            </v-col>
            <v-col cols="12" md="6">
              <FormsFieldsTextComponent v-model="search.endDate" type="date" placeholder="Fecha fin">
              </FormsFieldsTextComponent>
            </v-col>
            <v-col cols="12" md="12">
              <FormsFieldsSelectComponent :items="stateItems" v-model=search.state label="Estado">
              </FormsFieldsSelectComponent>
            </v-col>

          </v-row>


        </v-col>
        <v-col class="col-md-1 col-12 d-flex justify-center align-center">
          <v-btn fab class="primary white--text" @click="getAllOrders()">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-4">
            <v-card outlined width="100%">
              <v-card-title>
                <v-row>
                  <v-col class="col-md-4 col-12">Incidencias</v-col>
                  <v-col class="col-md-8 col-12">
                    <FormsFieldsTextButtonComponent dense notification-text="Incidencia agregada"
                      @click="addIncidences($event,item)" label="Agregar incidencia"></FormsFieldsTextButtonComponent>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-divider></v-divider>
              <v-data-table dense hide-default-footer :items="item.product.incidences" :headers="headerIncidences">
              </v-data-table>
            </v-card>
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
          }, {
            text: 'Store',
            value: 'storeName',
            align: 'left',
            visible: true,
          }, {
            text: 'Reference',
            value: 'order.reference',
            align: 'left',
            visible: false,
          },
          {
            align: 'left',
            text: 'Name',
            value: 'customer.name',
            align: 'left',
            visible: true,
          },
          {
            align: 'left',
            text: 'Email',
            value: 'customer.email',
            align: 'left',
            visible: false,
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
            text: 'City',
            value: 'delivery_address.city',
            align: 'left',
            visible: false,
          },
          {
            text: 'State',
            value: 'delivery_address.state',
            align: 'left',
            visible: false,
          },
          {
            text: 'Country',
            value: 'delivery_address.country',
            align: 'left',
            visible: false,
          },


          {
            align: 'left',
            text: 'Producto',
            value: 'product.name',
            align: 'left',
            visible: true,
          },
          {
            align: 'left',
            text: 'Product IMG',
            value: 'product.image_url',
            align: 'left',
            visible: true,
          },

          {
            text: 'Tracking',
            value: 'product.tracking_number',
            align: 'left',
            visible: true,
          },
          {
            text: 'Wholesale Price',
            value: 'product.net_price',
            align: 'left',
            visible: true,
          },


          {
            text: 'Payment',
            value: 'order.payment',
            align: 'left',
            visible: false,
          },
          {
            text: 'TotalPrice',
            value: 'order.total_paid',
            align: 'left',
            visible: true,
          },

        ],
        headerIncidences: [{
          text: 'Contenido',
          value: 'incidence',
          align: 'left',
        }, ],
        loading: false,
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
      setValue(symbol, value) {
        if (!value) return 'Not setted'
        return `${symbol} ${value}`
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
        this.updateTrackingProduct = {}
      },
      async addIncidences(incidence, order) {
        console.log(order)
        try {
          if (order.product.extra_id) {
            await this.$axios.put(`/orders/${order.product.extra_id}`, {
              params: {
                populate: '*'
              },
              data: {
                product_id: order.product.id,
                store_id: order.storeId,
                order_id: order.order.id,
                incidences: [
                  ...order.product.incidences,
                  {
                    incidence: incidence
                  }
                ]
              }
            })
          } else {
            await this.$axios.post(`/orders/`, {
              params: {
                populate: '*'
              },
              data: {
                product_id: order.product.id,
                store_id: this.store.id,
                order_id: order.order.id,
                incidences: [{
                  incidence: incidence
                }]
              }
            })

          }
          this.getAllOrders()
        } catch (e) {
          console.log(e)
        }
        this.updateTrackingProduct = {}
      },



      cleanProduct() {
        this.updateTrackingProduct = {}
      },
      checkSelectedProduct(order, product) {
        if (this.updateTrackingProduct.order_id === order.order.id && this.updateTrackingProduct.product_id === product
          .item.id) {
          return true
        } else {
          return false
        }
      },
      exportTable() {
        // naive encoding to csv format
        const content = [this.columns.map(col => wrapCsvValue(col.text))].concat(
          this.data.map(row => this.columns.map(col => wrapCsvValue(
            typeof col.value === 'function' ?
            col.value(row) :
            row[col.value === void 0 ? col.text : col.value],
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
