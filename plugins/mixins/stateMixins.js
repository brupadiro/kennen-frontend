//create mixin 
export default {
    data() {
        return {
            stateItems: [{
                value: "0",
                text: "En espera de pago"
              },
              {
                value: "2",
                text: "Pago aceptado"
              },
              {
                value: "1",
                text: "Preparación en curso"
              },
              {
                value: "3",
                text: "En espera de envío"
              },
              {
                value: "4",
                text: "Enviado"
              },
              {
                value: "5",
                text: "Entregado"
              },
              {
                value: "6",
                text: "Cancelado por el cliente"
              },
              {
                value: "7",
                text: "Cancelado por el administrador"
              },
              {
                value: "8",
                text: "Producto(s) pendiente(s)"
              },
              {
                value: "9",
                text: "Devolución"
              },
              {
                value: "10",
                text: "Cambio"
              },
              {
                value: "",
                text: "Estado desconocido"
              }
            ]
    
        }
    }
}