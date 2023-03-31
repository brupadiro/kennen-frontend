<template>
    <FormsFieldsSelectComponent
      v-model="selectedMonth"
      :items="monthOptions"
      label="Selecciona un mes"
      @input="updateDates"
    />
  </template>
  
  <script>
    import moment from 'moment';
  
    export default {
      data() {
        return {
          selectedMonth: 0,
          monthOptions: [
            { value: 0, text: 'Este mes' },
            { value: -1, text: 'Último mes' },
            { value: -2, text: 'Hace 2 meses' },
            { value: -3, text: 'Hace 3 meses' },
            { value: -4, text: 'Hace 4 meses' },
            { value: -5, text: 'Hace 5 meses' },
            { value: -6, text: 'Hace 6 meses' }
          ]
        };
      },
      created() {
        this.updateDates();
      },
      methods: {
        updateDates() {
          const today = moment();
          const month = today.add(this.selectedMonth, 'month')
          const startDate = month.clone().startOf('month').format('YYYY-MM-DD');
          const endDate = month.clone().endOf('month').add(1, 'day').format('YYYY-MM-DD');
          this.$emit('dateUpdated', {start_date:startDate, end_date:endDate});
        }
      }
    };
  </script>
  