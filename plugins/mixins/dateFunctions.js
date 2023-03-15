import moment from 'moment';
export default {
  filters: {
    formatDate(value) {
        return `${moment(value).format('DD/MM/YYYY')}`;
    },
    formatHour(value) {
      if(value) {
        return `${moment(value,'HH:mm').format('HH:mm')}`;
      }
      return '--:--';
  },

  }
}