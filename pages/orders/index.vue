<template>
  <v-container>
    <headersGeneralComponent>
      <template v-slot:title>
        Pedidos
      </template>

    </headersGeneralComponent>

    <v-row>
        <v-col class="col-12">
            <StoreAllOrdersCardComponent></StoreAllOrdersCardComponent>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>