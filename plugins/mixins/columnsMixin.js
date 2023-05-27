//create mixin 
export default {
  data() {
    return {
      columns: [{
          text: 'Order ID',
          value: 'order.id',
          align: 'left',
          visible: true,
        }, {
          text: 'Store',
          value: 'storeName',
          align: 'left',
          visible: true,
        }, {
          text: 'Reference',
          value: 'order.reference',
          align: 'left',
          visible: false,
        },
        {
          align: 'left',
          text: 'Name',
          value: 'customer.name',
          align: 'left',
          visible: true,
        },
        {
          align: 'left',
          text: 'Email',
          value: 'customer.email',
          align: 'left',
          visible: false,
        },
        {
          align: 'left',
          text: 'Phone',
          value: 'customer.phone',
          align: 'left',
          visible: false,
        },

        {
          align: 'left',
          text: 'Date',
          value: 'order.date_add',
          align: 'left',
          visible: true,
        },


        {
          text: 'Status',
          value: 'order.status',
          align: 'left',
          visible: true,
        },
        {
          text: 'Address',
          value: 'delivery_address.address1',
          align: 'left',
          visible: false,
        },
        {
          text: 'City',
          value: 'delivery_address.city',
          align: 'left',
          visible: false,
        },
        {
          text: 'State',
          value: 'delivery_address.state',
          align: 'left',
          visible: false,
        },
        {
          text: 'Country',
          value: 'delivery_address.country',
          align: 'left',
          visible: false,
        },


        {
          align: 'left',
          text: 'Producto',
          value: 'product.name',
          align: 'left',
          visible: true,
        },
        {
          align: 'left',
          text: 'Product IMG',
          value: 'product.image_url',
          align: 'left',
          visible: true,
        },

        {
          text: 'Tracking',
          value: 'product.tracking_number',
          align: 'left',
          visible: true,
        },
        {
          text: 'Wholesale Price',
          value: 'product.net_price',
          align: 'left',
          visible: true,
        },


        {
          text: 'Payment',
          value: 'order.payment',
          align: 'left',
          visible: false,
        },
        {
          text: 'TotalPrice',
          value: 'order.total_paid',
          align: 'left',
          visible: true,
        },
        {
          text: 'Profit',
          value: 'profit',
          align: 'left',
          visible: true,
        },
        {
          text: 'Copy order',
          value: 'copy',
          align: 'left',
          visible: true,
        },


      ],
    }
  }
}
