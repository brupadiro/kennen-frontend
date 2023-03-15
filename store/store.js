  var qs = require('qs');
  
  export const actions = {
    async findAll({
      commit
    }, query) {
      const {
        data: data
      } = await this.$axios.get(`/webservices/`, {
        params: {
          filters: query
        },
        paramsSerializer: params => {
          return qs.stringify(params, {
            arrayFormat: 'brackets'
          })
        }
      })
      return data
    },


  
  }

  
  