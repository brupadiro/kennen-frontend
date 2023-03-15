<template>
  <GeneralCardComponent class="mx-auto">
    <generalCardTitleComponent class="primary white--text">{{ store.name }}</generalCardTitleComponent>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table :loading="loading" loading-text="Cargando ordenes" disable-pagination disable-sort calculate-widths  disable-filtering :items="data" :headers="columns" hide-default-footer :items-per-page="10">
        <template v-slot:item.creation_date="{ item }">
          {{ item.creation_date | formatDate }}
          </template>
          <template v-slot:item.cost="{ item }">
            € {{ item.cost }}
          </template>

          <template v-slot:item.regarding="{ item }">
          <storeChipsStatusComponent :status="item.regarding"></storeChipsStatusComponent>
          </template>
      </v-data-table>
    </v-card-text>
  </GeneralCardComponent>
</template>

<script>
  import dateFunctions from '~/plugins/mixins/dateFunctions';
  export default {
    mixins:[dateFunctions],
    name: 'storeCardComponent',
    props: {
      store: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        mode: 'list',
        filter: '',
        pagination: {
          rowsPerPage: 10
        },
        columns: [{
            text: 'Id Pedido',
            value: 'id',
            align: 'left'
          },
          {
            text: 'Total',
            value: 'cost',
            align: 'left',
            sortable: true
          },
          {
            text: 'Estado',
            value: 'regarding',
            align: 'left',
            sortable: true
          },
          {
            text: 'Fecha',
            value: 'creation_date',
            align: 'left',
            sortable: true
          },
        ],
        loading:false,
        data: [],
      }
    },
    mounted() {
      this.getStore()
    },
    methods: {
      getOrderState(stateNumber) {
        switch (stateNumber) {
          case "0":
            return "En espera de pago";
            break;
          case "2":
            return "Pago aceptado";
            break;
          case "1":
            return "Preparación en curso";
            break;
          case "3":
            return "En espera de envío";
            break;
          case "4":
            return "Enviado";
            break;
          case "5":
            return "Entregado";
            break;
          case "6":
            return "Cancelado por el cliente";
            break;
          case "7":
            return "Cancelado por el administrador";
            break;
          case "8":
            return "Producto(s) pendiente(s) de suministro por parte del proveedor";
            break;
          case "9":
            return "Devolución";
            break;
          case "10":
            return "Cambio";
            break;
          default:
            return "Estado desconocido";
        }
      },
      getStore() {
        this.loading = true
        this.$axios.get(`/webservices/orderList/${this.store.id}`)
          .then((response) => {
            this.loading = false
            this.data = response.data.map((order) => {
              return {
                id: order.id,
                cost: `${Math.round(order.total_paid, 2)}`,
                regarding: order.current_state,
                creation_date: order.date_add,
              }
            })
          }).catch(()=>{
              this.loading = false
            })
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
    }
  }

</script>
