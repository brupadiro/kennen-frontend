<template>
  <v-card outlined width="100%">
    <v-card-title>
      <v-row>
        <v-col class="col-md-4 col-12">incidents</v-col>
        <v-col class="col-md-8 col-12">
          <FormsFieldsTextButtonComponent dense notification-text="Incidencia agregada" @click="addIncidences($event)"
            label="Add issue"></FormsFieldsTextButtonComponent>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table dense hide-default-footer :items="order.product.incidents" :headers="headers">
      <template v-slot:item.delete="{ item }">
        <v-btn fab small rounded color="red" elevation="3" @click="deleteIncidences(item)" class="my-3">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

    </v-data-table>
    <v-snackbar color="success" class="black--text" v-model="incidenceSnackBar">
      Issue successfully removed
    </v-snackbar>

  </v-card>
</template>

<script>
  export default {
    props: {
      order: {
        type: Object,
        default: () => {}
      },
      items: {
        type: Array,
        default: () => []
      },
      store: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        incidenceSnackBar: false,
        headers: [{
          text: 'Content',
          value: 'content',
          align: 'left',
        }, {
          text: 'Delete',
          value: 'delete',
          align: 'right',
        }],
      }
    },
    methods: {
      async addIncidences(incident) {

        const createIncident = async function(vm, order, incident){
          console.log(order)
          await vm.$axios.post(`/incidents/?populate=`, {
              data: {
                content: incident,
                order: order
              }
            })

        }

        try {
          if (this.order.product.extra_id) {
            console.log("create1")
            createIncident(this, this.order.product.extra_id, incident)
          } else {
            this.$axios.post(`/orders/`, {
              params: {
                populate: '*'
              },
              data: {
                product_id: this.order.product.id,
                store_id: this.store,
                order_id: this.order.order.id,
              }
            }).then(async({data})=>{
              console.log("create2")
              await createIncident(this, data.data.id, incident)
            })

          }
          this.$emit('refresh')
        } catch (e) {
          console.log(e)
        }
      },
      async deleteIncidences(item) {
        try {
          await this.$axios.delete(`/incidents/${item.id}`)
          this.incidenceSnackBar = true
          this.$emit('refresh')

        } catch (error) {

        }
      }

    }
  }

</script>

<style>

</style>
