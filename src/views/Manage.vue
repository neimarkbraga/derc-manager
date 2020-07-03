<template>
  <div class="container">
    <div class="row pt-3">
      <div v-for="(item, index) of displayItems" class="col-12 pb-3" :key="index">
        <div class="card">
          <div class="card-body">
            <ItemEditor v-model="displayItems[index]" />
            <div v-if="credentials[index]" class="mt-3 text-right">
              <button
                type="button"
                @click="removeItemByIndex(index)"
                class="btn btn-sm btn-outline-danger">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="this.credentials.length" class="pb-3 text-right">
      <router-link to="/export" class="btn btn-primary">
        Encrypt and Export
      </router-link>
    </div>
  </div>
</template>

<script>
  import ItemEditor from '../components/ItemEditor';

  export default {
    name: 'Manage',
    components: {
      ItemEditor
    },
    data: () => ({
      newItem: {
        title: '',
        details: []
      }
    }),
    watch: {
      newItem: {
        deep: true,
        handler(value) {
          if (value.title) {
            this.credentials.push(JSON.parse(JSON.stringify(value)));
            this.newItem.title = '';
            this.newItem.details = [];
          }
        }
      }
    },
    computed: {
      credentials: {
        get() {
          return this.$store.state.credentials;
        },
        set(value) {
          this.$store.state.credentials = value;
        }
      },

      showNewItem() {
        for (let item of this.credentials) {
          if (!item.title) {
            return false;
          }
        }
        return true;
      },

      displayItems() {
        const items = [];
        for (let item of this.credentials) {
          items.push(item);
        }
        if (this.showNewItem) {
          items.push(this.newItem);
        }
        return items;
      }
    },
    methods: {
      removeItemByIndex(index) {
        if (window.confirm('Are you sure to remove the item?')) {
          this.credentials.splice(index, 1);
        }
      }
    },
    created() {
      if (!this.$store.state.imported) {
        this.$store.state.credentials = [];
      }
      this.$store.state.imported = false;
    }
  }
</script>

<style scoped>

</style>