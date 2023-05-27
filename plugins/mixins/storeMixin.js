export default {
    methods:{
        setValue(symbol, value) {
            if (!value) return 'Not setted'
            return `${symbol} ${value}`
          },
          calcProfit(item) {
            let profit = 0
            if (item.product.net_price) {
              let price = item.product.price.split('€')[0]
              price = parseFloat(price)
              profit =price - item.product.net_price
            } else {
              'N/A'
            }
            return `€ ${profit}`
          },
          copyToClipboard(item) {
            console.log("aca");
            
            let size = item.product.name.split(':')[1]
            let textToCopy = `Name:${item.customer.name}
          Phone:${item.customer.phone}
          Address:${(item.delivery_address.address1 !=" ") ? item.delivery_address.address1 : item.delivery_address.address2 }
          City:${item.delivery_address.city}
          State:${item.delivery_address.state} 
          Country:${item.delivery_address.country} 
          Size:${size}
          Postcode:${item.delivery_address.postcode}`;
          
            navigator.clipboard.writeText(textToCopy).then(() => {
              console.log('Copied to clipboard');
              this.copyOrderSnackbar = true
            }).catch((err) => {
              console.log('Could not copy text: ', err);
            });
          }
              
    
    }
}