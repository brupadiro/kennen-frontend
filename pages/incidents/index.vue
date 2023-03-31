<template>
  <v-container>
    <headersGeneralComponent>
      <template v-slot:title>
        Incidents
      </template>
    </headersGeneralComponent>

    <v-row>
      <v-col class="col-12">
        <GeneralCardComponent>
          <generalCardTitleComponent class="primary white--text">All incidents</generalCardTitleComponent>
          <v-card-title>
            <FormsFieldsSelectComponent style="width:100%" @input="getOrdersWithIncident()"  v-model="search.store" :items="storeList.data" item-value="id" item-text="name" label="Tienda">
            </FormsFieldsSelectComponent>
          </v-card-title>
          <v-card-text>
            <v-data-table loading-text="Loading incidents..." :loading="loading" hide-default-footer :items="orderWithIncidents" :headers="headers">
              <template v-slot:item.response="{ item }">
                <v-edit-dialog @close="updateResponse(item)"  @save="updateResponse(item)" save-text="Guardar" cancel-text="Guardar">
                  <v-text-field hide-details outlined dense height="20" readonly
                    :value="item.response"></v-text-field>
                  <template v-slot:input>
                    <FormsFieldsTextareaComponent :disabled="item.status=='Solved'" class="py-3" hide-details outlined v-model="item.response" label="Edit"></FormsFieldsTextareaComponent>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-slot:item.status="{ item }">
                <v-edit-dialog  @close="updateStatus(item)"  @save="updateStatus(item)" save-text="Guardar" cancel-text="Guardar">
                  <v-chip small  class="elevation-3 full-width" label :color="setColorChip(item.status)">{{ item.status }}&nbsp;
                    <v-icon>mdi-pencil</v-icon>
                  </v-chip>
                  <template v-slot:input>
                    <FormsFieldsSelectComponent :disabled="item.status=='Solved'" dense class="py-3" label="Update status" outlined v-model="item.status" :items="['Pending','Updated','Solved']"></FormsFieldsSelectComponent>
                  </template>
                </v-edit-dialog>
              </template>

              <template v-slot:item.img="{ item }">
                <v-edit-dialog   @save="updateImg(item)" large cancel-text="Cancelar" @cancel="cleanFile()" save-text="Guardar">
                  <v-card height="80" class="my-2">
                    <v-img width="80" height="100%" v-if="item.img?.url" :src="item.img.url" contain></v-img>
                    <img width="80" v-else  src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930">
                  </v-card>
                  <template v-slot:input>
                    <FormsFieldsFileComponent class="py-3" hide-details outlined v-model="img" label="Edit"></FormsFieldsFileComponent>
                  </template>
                </v-edit-dialog>
              </template>


              <template v-slot:item.date_response="{ item }">
                {{ (item.date_response) ?item.date_response:'N/A' }}
              </template>
            </v-data-table>
          </v-card-text>
        </GeneralCardComponent>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import moment from 'moment'
  export default {
    data() {
      return {
        orderWithIncidents: [],
        img: null,
        search:{
          store: 0
        },
        loading:false,
        storeList: {
          data: []
        },

        headers: [{
            text: 'Order ID',
            value: 'order.id'
          },
          {
            text: 'Tracking number',
            value: 'order.tracking_number'
          },
          {
            text: 'Description',
            value: 'content'
          },
          {
            text: 'Date',
            value: 'createdAt'
          },
          {
            text: 'status',
            value: 'status'
          },
          {
            text: 'Response',
            value: 'response'
          },
          {
            text: 'PICTURE',
            value: 'img'
          },

          {
            text: 'Date response',
            value: 'date_response'
          },


        ]
      }
    },
    created() {
      this.getStores()
    },
    methods: {

      async getStores() {
        this.storeList = await this.$store.dispatch('store/findAll', {
          company: this.$auth.user.company.id
        })
        this.search.store = this.storeList.data[0]?.id

        this.getOrdersWithIncident()
      },

      getOrdersWithIncident() {
        this.loading = true
        this.$axios.get(`orders/OrdersWithIncidents/${this.search.store}`).then((response) => {
          this.orderWithIncidents = response.data.orders.map((item)=>{
            let date_response = item.date_response ? moment(item.date_response).format('DD/MM/YYYY') : 'N/A'
            return {
              ...item,
              date_response: date_response,
              createdAt: moment(item.createdAt).format('DD/MM/YYYY')
            }
          })
          this.loading = false
        })
      },
      setColorChip(status) {
        switch (status) {
          case 'Pending':
            return 'red'
            break;
          case 'Updated':
            return 'orange'
            break;
          case 'Solved':
            return 'green'
            break;
          default:
            return 'red'
            break;
        }
      },
      updateResponse(item) {
        const date_response= moment().format('YYYY-MM-DD HH:mm:ss')
        this.$axios.put(`incidents/${item.id}`, {
          data: {
            response: item.response,
            date_response: date_response
          }
        }).then((response) => {
          this.getOrdersWithIncident()
        })
      },
      updateStatus(item) {
        this.$axios.put(`incidents/${item.id}`, {
          data: {
            status: item.status
          }
        }).then((response) => {
          this.getOrdersWithIncident()
        })
      },
      updateImg(item){

        //update img using formData
        const formData = new FormData()
        formData.append('files', this.img)
        this.$axios.post(`upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          item.img = response.data[0]
          this.$axios.put(`incidents/${item.id}`, {
            data: {
              img: response.data[0].id
            }
          }).then((response) => {
            this.getOrdersWithIncident()
          })
        })
      },
      cleanFile(){
        this.$root.$emit('resetFile')
        this.img = null
      }
    }
  }

</script>

<style>

</style>
