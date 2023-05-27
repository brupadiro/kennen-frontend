  var qs = require('qs');



  export const state = () => ({
    orderStore: {
      orders: [],
      total_pages: 0,
      total_count: 0
    },
    searchParams: {
      page: 1,
      state: "2",
      pageSize: 10,
    },
  })


  export const getters = {
    get(state) {
      return state.orderStore
    },
    getSearchParams(state) {
      return state.searchParams
    },
  }


  export const actions = {
    async findAll({
      state,
      commit
    }, {
      storeId,
      search
    }) {
      const {
        data: data
      } = await this.$axios.get(`/webservices/orderList/${storeId}/`, {
        params: search,
        paramsSerializer: params => {
          return qs.stringify(params, {
            arrayFormat: 'brackets'
          })
        }
      })
      return data
    },
    setSearch({
      state,
      commit
    }, search){
      commit('setSearchParams', search)
    }, 
    set({commit},data) {
      commit('set', data)
    }
  }


  export const mutations = {
    set(state, data) {
      state.orderStore = data
    },
    setSearchParams(state, searchParams) {
      state.searchParams = searchParams
    }
  }
