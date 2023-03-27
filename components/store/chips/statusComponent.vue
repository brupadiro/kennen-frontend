<template>
  <v-chip :color="getOrderStateColor(status)" class="elevation-1">
    {{ getOrderState(status) }}
  </v-chip>

</template>

<script>
  export default {
    props: {
      status: {
        type: String,
        required: true
      }
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
            return "Producto(s) pendiente(s)";
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
      getOrderStateColor(stateString) {
        stateString = this.getOrderState(stateString);
        switch (stateString) {
          case "En espera de pago":
            return "grey lighten-3";
            break;
          case "Pago aceptado":
            return "green accent-3";
            break;
          case "Preparación en curso":
            return "blue lighten-3";
            break;
          case "En espera de envío":
            return "orange lighten-3";
            break;
          case "Enviado":
            return "purple lighten-3";
            break;
          case "Entregado":
            return "teal lighten-3";
            break;
          case "Cancelado por el cliente":
            return "red lighten-3";
            break;
          case "Cancelado por el administrador":
            return "pink lighten-3";
            break;
          case "Producto(s) pendiente(s) de suministro por parte del proveedor":
            return "yellow lighten-3";
            break;
          case "Devolución":
            return "deep-purple lighten-3";
            break;
          case "Cambio":
            return "deep-orange accent-2";
            break;
          default:
            return "grey darken-1";
        }
      },

    }
  }

</script>

<style>

</style>
