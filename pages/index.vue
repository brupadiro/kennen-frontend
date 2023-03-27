<template>
  <v-container>
    <HeadersGeneralComponent>
      <template v-slot:title>
        Inicio
      </template>
      <template v-slot:subtitle>
        <v-btn color="secondary" class="font-weight-bold black--text rounded-lg" @click="modalShop=true">Agregar tienda</v-btn>
        </template>
    </HeadersGeneralComponent>
    <v-row>
          <v-col class="col-md-12"  v-for="store in stores.data" :key="store.id">
            <storeCardsComponent :store="store"></storeCardsComponent>
          </v-col>
          <v-col class="col-md-4" v-if="stores.data.length == 0">
            <GeneralCardComponent v-ripple @click.native="modalShop=true" height="400" class="d-flex justify-center align-center flex-column">
                <v-icon size="120">mdi-plus</v-icon>
                <h3 class="weight-text--light">Aun no hay tiendas agregadas</h3>
            </GeneralCardComponent>          
          </v-col>
          <v-col class="col-12">
          </v-col>
        </v-row>

        <storeCreateComponent v-model="modalShop" @refresh="getStores()"></storeCreateComponent>
  </v-container>
</template>


<script>


  import axios from 'axios'
  import qs from 'qs'

  export default {
    data() {
      return {
        modalShop: false,
        mode: 'list',
        shop: {},
        stores:{
          data: [],
          pagination: {
            rowsPerPage: 10
          }
        },
        success:false,
        pagination: {
          rowsPerPage: 10
        }
      }
    },
    created() {
      this.getStores()
    },
    computed: {

    },
    created() {
      this.getStores()
      this.$root.$on('refresh', () => {
        this.getStores()
      })
    },
    methods: {
      getStores() {
        console.log("aca")
        this.$axios.get('/webservices',{
          params:{
            filters:{
              company:this.$auth.user.company.id
            }
          },
          paramsSerializer: function(params) {
            return qs.stringify(params, {arrayFormat: 'brackets'})
          }
        })
          .then(response => {
            this.stores = response.data
          })
      },
    }
  }

</script>

<style scoped>
  .blue_dark {
    background-color: #082f56;
  }

  .green_dark {
    background-color: #084a0b;
  }

  .orange_dark {
    background-color: #64350e;
  }

  .q-table th.sortable {
    cursor: pointer;
    font-weight: bold;
  }

</style>
