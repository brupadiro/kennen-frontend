<template>
    <v-dialog max-width="700" :value="value" persistent>
      <generalCardComponent class="order-details-card">
        <GeneralCardTitleComponent class="primary white--text">
            Detalles de la orden
            <v-spacer></v-spacer>
            <v-btn small fab @click="$emit('input', false)">
                <v-icon color="black">mdi-close</v-icon>
            </v-btn>
        </GeneralCardTitleComponent>
        <v-card-text v-if="loading">
          <v-skeleton-loader type="article" />
        </v-card-text>
        <v-card-text v-else>
          <v-row>
            <v-col cols="12" md="6">
              <h4>Order</h4>
              <dl class="order-details-list">
                <dt>Order ID:</dt>
                <dd>{{ order.order.id }}</dd>
                <br>
                <dt>Reference:</dt>
                <dd>{{ order.order.reference }}</dd>
                <br>
                <dt>Date:</dt>
                <dd>{{ order.order.date_add }}</dd>
                <br>
                <dt>Total Paid:</dt>
                <dd>{{ order.order.total_paid }} €</dd>
              </dl>
            </v-col>
            <v-col cols="12" md="6">
              <h4>Customer</h4>
              <dl class="order-details-list">
                <dt>Name:</dt>
                <dd>{{ order.customerData.firstname }} {{ order.customerData.lastname }}</dd>
                <br>
                <dt>Email:</dt>
                <dd>{{ order.customerData.email }}</dd>
                <br>
                <dt>Phone:</dt>
                <dd>{{ order.deliveryAddress.phone }}</dd>
              </dl>
            </v-col>
          </v-row>
          <h4>Shipping Address</h4>
          <dl class="order-details-list">
            <dt>Name:</dt>
            <dd>{{ order.deliveryAddress.firstname }} {{ order.deliveryAddress.lastname }}</dd>
            <br>
            <dt>Address:</dt>
            <dd>
              {{ order.deliveryAddress.address1 }},
              {{ order.deliveryAddress.postcode }} {{ order.deliveryAddress.city }},
              {{ order.deliveryAddress.id_country }}
            </dd>
          </dl>
          <v-card>
            <v-simple-table class="order-items-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.order.associations.order_rows" :key="item.id">
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.product_quantity }}</td>
                    <td>{{ item.product_price }} €</td>
                    <td>
                      <v-img
                        v-if="item.images && item.images[0]"
                        :src="item.images[0]"
                        :alt="item.product_name"
                        max-height="100"
                        max-width="100"
                      ></v-img>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-card-text>
        <v-card-text>
            <generalCardComponent outlined v-show="!loading">
                <v-card-title class="primary white--text text-h6">Actualizar orden</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col class="col-md-6 col-12">
                            <FormsFieldsTextComponent label="Track id" :disabled="Object.keys(order.extra).length != 0" v-model="dataOrder.tracking_number"></FormsFieldsTextComponent>
                        </v-col>
                        <v-col class="col-md-6 col-12">
                            <FormsFieldsTextComponent label="Precio neto" :disabled="Object.keys(order.extra).length != 0" v-model="dataOrder.net_price"></FormsFieldsTextComponent>
                        </v-col>

                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  color="secondary" v-show="Object.keys(order.extra).length == 0" class="rounded-lg font-weight-bold black--text" @click="updateOrder()">Actualizar informacion</v-btn>
                </v-card-actions>
            </generalCardComponent>
        </v-card-text>
      </generalCardComponent>
    </v-dialog>
  </template>
    <script>
  export default {
    props:{
        orderData:{
            type:Object,
            default:{}
        },
        value:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            loading:false,
            order:{
                order:{
                    associations:{
                        order_rows:[]
                    }
                },
            deliveryAddress:{},
            customerData:{}

            },
            dataOrder:{}
        }
    },
    methods:{
        getOrder(){
            this.loading = true
            this.$axios.get(`/webservices/order/${this.orderData.storeId}/${this.orderData.id}`)
                .then((data)=>{
                    this.loading = false
                    this.order = data.data
                    this.dataOrder = this.order.extra
                })
        },
        updateOrder() {
          this.$axios.post(`/webservices/order/update/${this.orderData.id}`, {
            data:{
              ...this.dataOrder,
              order_id:this.orderData.id
            }
          })
            .then((data) => {
              this.$emit('input', false)
              this.$emit('update')
            })
        }
    },
    watch:{
        orderData:{
            handler(){
                this.getOrder()
            },
            deep:true
        }
    }
  }
  </script>
  
  <style scoped>
  .order-details-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  
  .order-details-list {
    margin-bottom: 1rem;
  }
  
  .order-details-list dt {
    font-weight: bold;
   
    display: inline;
margin-right: 0.5rem;
}

.order-details-list dd {
display: inline;
margin: 0;
}

.order-items-table {
width: 100%;
border-collapse: collapse;
}

.order-items-table thead {
background-color: #f5f5f5;
font-weight: bold;
}

.order-items-table th,
.order-items-table td {
padding: 0.5rem;
border: 1px solid #e0e0e0;
text-align: left;
}

.order-items-table td {
vertical-align: middle;
}

.v-img {
border: 1px solid #e0e0e0;
border-radius: 4px;
overflow: hidden;
}
</style>

