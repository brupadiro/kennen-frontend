<template>
  <GeneralCardComponent class="mx-auto">
    <generalCardTitleComponent class="primary white--text">{{ store.name }}
    <v-spacer></v-spacer>
    <slot></slot>
    </generalCardTitleComponent>
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
              <v-btn fab class="primary white--text mt-4" @click="getStore()">
                <v-icon>mdi-filter</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </v-card-title>
    <v-card-title>
      <v-card outlined class="rounded-lg">
        <v-card-title>
          <v-row no-gutters>
            <v-switch v-model="col.visible" :label="col.text" class="mr-2 my-2" v-for="col in columns" :key="col.value">
            </v-switch>
          </v-row>
        </v-card-title>
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
        <template v-slot:item.copy="{ item }">
          <v-btn rounded color="primary" @click="copyToClipboard(item)">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.profit="{ item }">
           {{ calcProfit(item) }}
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
  import stateMixin from '~/plugins/mixins/stateMixins';
  import columnsMixin from '~/plugins/mixins/columnsMixin';
  import storeMixin from '~/plugins/mixins/storeMixin';
  export default {
    mixins: [dateFunctions, stateMixin,columnsMixin,storeMixin],
    name: 'storeCardComponent',
    props:{
      store:{
        type:Object,
        required:true
      }
    },
    data() {
      return {
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        search: {
          page: 1,
          state: "2",
        },
        loading: false,
        order: {},
        showOrderModal: false,
        data: {
          orders: [],
          total_pages: 0,
          total_count: 0
        }
      }
    },
    created() {
      this.data = JSON.parse(JSON.stringify(this.$store.getters['orderstore/get']))
      
      this.search = JSON.parse(JSON.stringify(this.$store.getters['orderstore/getSearchParams']))
    },
    methods: {
      showOrder(item) {
        this.order = item
        this.showOrderModal = true
      },
      setValue(symbol, value) {
        if (!value) return 'Not setted'
        return `${symbol} ${value}`
      },
      async getStore() {
        this.data = 
          this.loading = true
          this.data = await this.$store.dispatch('orderstore/findAll',{
            storeId: this.store.id,
            search:this.search
          })
          console.log(this.data)
          this.loading = false
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
