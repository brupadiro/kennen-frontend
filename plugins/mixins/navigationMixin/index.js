import adminMixin from './admin.js'
import providerMixin from './provider.js'
export default {
  mixins: [adminMixin, providerMixin],
  computed: {
    items() {
      if(this.$auth.user.type == 'Provider') {
        return this.providerItems
      } else {
        return this.adminItems
      }
    },
    bottomItems() {
      if(this.$auth.user.type == 'Provider') {
        return this.providerItems
      } else {
        return this.bottomAdminItems
      }

    }
  }
}
