<template>
  <GeneralCardComponent class="rounded-xl v-card-text-overflow">
    <slot name="toolbar"></slot>
    <v-card-text class="text-h6 font-weight-bold black--text">
      <v-row>
        <v-col class="col-12 col-md-8 col-xl-8">
          <v-row>
            <v-col class="col-12">
              <v-divider></v-divider>
            </v-col>
            <v-col class="col-12">
              <v-row no-gutters>
                <v-row no-gutters>
                  <v-btn fab class="rounded-lg" depressed>
                    <v-icon size="30">
                      mdi-home
                    </v-icon>
                  </v-btn>
                  &nbsp;
                  &nbsp;
                  <div>
                    <h3>N {{data.number}}</h3>
                  </div>
                </v-row>
                <v-row no-gutters>
                  <v-btn fab class="rounded-lg" depressed>
                    <v-icon size="30">
                      mdi-square-outline
                    </v-icon>
                  </v-btn>
                  &nbsp;
                  &nbsp;
                  <div>
                    <h3>{{data.square_meters}} m</h3>
                    <p class="font-weight-light text-subtitle-2">Metros cubiertos</p>
                  </div>
                </v-row>
                <v-row no-gutters>
                  <v-btn fab class="rounded-lg" depressed>
                    <v-icon size="30">
                      mdi-square-outline
                    </v-icon>
                  </v-btn>
                  &nbsp;
                  &nbsp;
                  <div>
                    <h3>{{data.rooms}}</h3>
                    <p class="font-weight-light text-subtitle-2">Habitaciones</p>
                  </div>
                </v-row>
              </v-row>
            </v-col>
            <v-col class="col-12">
              <v-divider></v-divider>
            </v-col>

            <v-col class="col-12">
              <GeneralCardComponent outlined>
                <GeneralCardTitleComponent>Precios</GeneralCardTitleComponent>
                <v-divider></v-divider>
                <v-data-table hide-default-footer :items="data.room_type.prices" :headers="priceHeaders"></v-data-table>
              </GeneralCardComponent>
            </v-col>
            <v-col class="col-12">
              <GeneralCardComponent outlined>
                <GeneralCardTitleComponent>Camas</GeneralCardTitleComponent>
                <v-divider></v-divider>
                <v-data-table hide-default-footer :items="data.room_type.beds" :headers="bedsHeaders"></v-data-table>
              </GeneralCardComponent>
            </v-col>
            <v-col class="col-12">
              <h5>Amenities</h5>
            </v-col>
            <v-col class="col-12">
              <v-row no-gutters v-if="data.room_type.amenities">
                <v-chip class="margin-right-5" color="grey lighten-1 black--text mr-2 mb-2 font-weight-regular" label
                  dark v-for="amenity in data.amenities" :key="amenity.id">
                  {{amenity.name}}
                </v-chip>
              </v-row>
            </v-col>
            <v-col class="col-12">
              <h5>Equipamientos</h5>
            </v-col>
            <v-col class="col-12">
              <v-row no-gutters>
                <v-chip class="margin-right-5" color="grey lighten-1 black--text mr-2 mb-2 font-weight-regular" label
                  dark v-for="equipment in data.room_type.equipments" :key="equipment.id">
                  {{equipment.name}}
                </v-chip>
              </v-row>
            </v-col>

          </v-row>
        </v-col>
        <v-col class="col-12 col-md-4 col-xl-4">
          <v-card class="rounded-xl full-width" elevation="4" color="#333350">
            <v-card-title>
              <v-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
              </v-avatar>
              &nbsp;
              <div class="pt-4">
                <h6 class="white--text font-weight-regular" v-if="data.current_guest">
                  {{data.current_guest.name}}</h6>
                  <h6 v-else class="white--text font-weight-regular">
                    No hay huesped  actualmente
                  </h6>
                <p class="text-subtitle-2 white--text">Huésped actual</p>
              </div>
            </v-card-title>
            <v-divider color="white"></v-divider>
            <v-card-text v-if="data.current_guest">
              <v-row no-gutters>
                <v-col class="col-12 col-sm-6">
                  <p class="white--text">Documento</p>
                </v-col>
                <v-col class="col-12 col-sm-6 text-right">
                  <p class="white--text" v-if="owner.user">{{data.current_guest.doc_type}} {{data.current_guest.doc}}
                  </p>
                </v-col>
                <v-col class="col-12 col-sm-6">
                  <p class="white--text">Telefono</p>
                </v-col>
                <v-col class="col-12 col-sm-6 text-right">
                  <p class="white--text text-h6 font-weight-black">{{data.current_guest.phone}}</p>
                </v-col>
                <v-col class="col-12 col-sm-6">
                  <p class="white--text">Telefono</p>
                </v-col>
                <v-col class="col-12 col-sm-6 text-right">
                  <p class="white--text text-h6 font-weight-black">{{data.current_guest.email}}</p>
                </v-col>

                <v-col class="col-12">
                  <v-btn color="secondary rounded-lg font-weight-regular" block class="text-capitalize">
                    CONTACTAR&nbsp; <v-icon color="white">ion-ios-send</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </GeneralCardComponent>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        required: true,
        default: {
          current_guest:{},
            room_type: {
              amenities:[],
              equipments:[]
            },
        }
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.$root.$on('toggleFullScreen', () => {
        this.openRentalForm = false
      })
    },
    filters: {
      formatHabitants: (user, type) => {
        let data = user[type]
        return data ? data : ''
      }
    },
    data() {
      return {
        openRentalForm: false,
        headersRentals: [{
            text: 'Nombre',
            value: 'user.name'
          },
          {
            text: 'Documento',
            value: 'user.username'
          },
          {
            text: 'Fecha de inicio',
            value: 'start_date'
          },
          {
            text: 'Fecha de fin',
            value: 'end_date'
          },
        ],
        priceHeaders:[
          {
            text: 'Tipo',
            value: 'cost_season'
          },
          {
            text: 'Moneda',
            value: 'currency'
          },
          {
            text: 'Costo',
            value: 'price'
          },
        ],
        bedsHeaders:[
          {
            text: 'Cantidad',
            value: 'quantity'
          },
          {
            text: 'Tipo',
            value: 'type'
          },
        ]

      }
    },
    methods: {
        getRentals() {
          this.$store.dispatch('rentals/findAll', {
            filters: {
              apartment: this.data.id,
            },
            populate: '*'
          })
        }

    },
    computed: {
      owner() {
        return this.$store.getters['owners/get']
      },

    }
  }

</script>
