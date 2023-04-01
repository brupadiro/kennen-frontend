export default {
    data() {
        return {
            providerItems: [{
              icon: 'apps',
              title: 'Inicio',
              to: '/'
            },
            {
              icon: 'box',
              title: 'Pedidos',
              to: '/orders'
            },
            {
              icon: 'error',
              title: 'Incidencias',
              to: '/incidents'
            },
          ]
        }
    }
}