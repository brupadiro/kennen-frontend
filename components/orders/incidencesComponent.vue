<template>
  <v-card outlined width="100%">
    <v-card-title>
      <v-row>
        <v-col class="col-md-4 col-12">Incidencias</v-col>
        <v-col class="col-md-8 col-12">
          <FormsFieldsTextButtonComponent dense notification-text="Incidencia agregada" @click="addIncidences($event)"
            label="Agregar incidencia"></FormsFieldsTextButtonComponent>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table dense hide-default-footer :items="order.product.incidences" :headers="headers">
      <template v-slot:item.delete="{ item }">
        <v-btn fab small rounded color="red" elevation="3" @click="deleteIncidences(item)" class="my-3">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

    </v-data-table>
    <v-snackbar color="success" class="black--text" v-model="incidenceSnackBar">
      Pago eliminado correctamente
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
          text: 'Contenido',
          value: 'incidence',
          align: 'left',
        }, {
          text: 'Eliminar',
          value: 'delete',
          align: 'right',
        }],
      }
    },
    methods: {
      async addIncidences(incidence) {
        try {
          if (this.order.product.extra_id) {
            await this.$axios.put(`/orders/${this.order.product.extra_id}`, {
              params: {
                populate: '*'
              },
              data: {
                product_id: this.order.product.id,
                store_id: this.store,
                order_id: this.order.order.id,
                incidences: [
                  ...this.order.product.incidences,
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
                product_id: this.order.product.id,
                store_id: this.store,
                order_id: this.order.order.id,
                incidences: [{
                  incidence: incidence
                }]
              }
            })

          }
          this.$emit('refresh')
        } catch (e) {
          console.log(e)
        }
      },
      async deleteIncidences(item) {
        try {
          let incidences = this.order.product.incidences.filter(incidence => incidence.id !== item.id)
          await this.$axios.put(`/orders/${this.order.product.extra_id}`, {
            params: {
              populate: '*'
            },
            data: {
              incidences: incidences
            }
          })
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
