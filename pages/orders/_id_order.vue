<template>
    <v-container>
      <generalCardComponent class="order-details-card">
        <GeneralCardTitleComponent class="primary white--text">Detalles de la orden</GeneralCardTitleComponent>
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
      </generalCardComponent>
    </v-container>
  </template>
    <script>
  export default {
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

            }
        }
    },
    created() {
        this.getOrder()
    },  
    methods:{
        getOrder(){
            this.loading = true
            this.$axios.get(`/webservices/order/${this.$route.params.id_order}`)
                .then((data)=>{
                    this.loading = false
                    this.order = data.data
                })
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

