<template>
  <v-container>
    <HeadersGeneralComponent>
      <template v-slot:title>
        Clientes
      </template>
    </HeadersGeneralComponent>


    <v-row>
      <v-col class="col-12">
        <generalCardComponent elevation="6">
          <GeneralCardTitleComponent class="primary">
            <v-row>
              <v-col class="col-12">
                <FormsFieldsSelectComponent v-model="store" :items="storeList.data" label-color="white--text" item-value="id" item-text="name"
                  label="Tienda">
                </FormsFieldsSelectComponent>
              </v-col>
            </v-row>
          </GeneralCardTitleComponent>
          <v-card-text>
            <v-data-table loading-text="Buscando clientes..." :loading="loading" :headers="headers" :items="customers"
              hide-default-footer>
              <template v-slot:item.firstname="{ item }">
                {{ item.firstname  }} {{ item.lastname  }}
              </template>

              <template v-slot:item.date_add="{ item }">
                {{ item.date_add | formatDate  }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-divider></v-divider>
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

        </generalCardComponent>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import qs from 'qs'
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  export default {
    mixins: [dateFunctions],
    data() {
      return {
        headers: [{
          text: 'Nombre',
          value: 'firstname'
        }, {
          text: 'Email',
          value: 'email'
        }, {
          text: 'Fecha de alta',
          value: 'date_add',
          align: 'center'
        }],
        storeList: {
          data: []
        },
        store: null,
        search: {
          pagination: {
            page: 1
          }
        },
        loading: false,
        customers: [],
      }
    },
    created() {
      this.getStores()
        .then(() => {
          this.getCustomers();
        })
    },
    methods: {

      async getStores() {
        this.storeList = await this.$store.dispatch('store/findAll', {
          company: this.$auth.user.company.id
        })
        console.log(this.storeList.data[0])
        this.store = this.storeList.data[0] ?.id
      },

      getCustomers() {
        this.loading = true
        this.customers = []
        this.$axios.get(`/webservices/customers/${this.store}`, {
          params: this.search
        }).then((response) => {
          this.customers = response.data;
          this.loading = false
        })
      }
    },
    watch: {
      store: {
        handler() {
          this.getCustomers();
        },
        deep: true
      }
    }
  }

</script>

<style>

</style>
