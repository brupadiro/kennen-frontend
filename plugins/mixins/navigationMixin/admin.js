export default {
  data() {
    return {
      adminItems: [{
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
        {
          icon: 'numbers',
          title: 'Contabilidad',
          to: '/accounting'
        },
        {
          icon: 'account',
          title: 'Clientes',
          to: '/clients'
        },
        {
          icon: 'staff',
          title: 'Usuarios',
          to: '/users'
        },
        {
          icon: 'person',
          title: 'Mi perfil',
          to: '/profile'
        },
      ],
      bottomAdminItems: [{
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
          icon: 'numbers',
          title: 'Contabilidad',
          to: '/accounting'
        },
        {
          icon: 'account',
          title: 'Clientes',
          to: '/clients'
        },
        {
          icon: 'more',
          title: 'More',
          subItems: [{
            icon: 'error',
            title: 'Incidencias',
            to: '/incidents'
          },{
            icon: 'person',
            title: 'Mi perfil',
            to: '/profile'
          }, {
            icon: 'staff',
            title: 'Usuarios',
            to: '/users'
          }, ]
        },
      ],
    }
  }
}
