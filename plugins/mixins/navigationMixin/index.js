import adminMixin from './admin.js'
import userMixin from './user.js'
import staffMixin from './staff.js'
export default {
  mixins: [adminMixin, userMixin,staffMixin],
  computed: {
    items() {
      return this.adminItems
    },
    bottomItems() {

      return this.bottomAdminItems
    }
  }
}
