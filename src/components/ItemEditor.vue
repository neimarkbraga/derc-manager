<template>
  <div>
    <input
      type="text"
      placeholder="Enter a title"
      v-model="value.title"
      class="form-control" />

    <div v-for="(detail, index) of displayDetails" class="row no-gutters pt-3" :key="index">
      <div class="col-4 pr-2">
        <div class="d-flex align-items-center">
          <div class="pr-2">
            <div
              @click.prevent="detail.secure = !detail.secure"
              style="user-select: none; cursor: pointer; width: 1.5em;">
              <img v-if="detail.secure" src="../assets/shield.svg" class="d-block w-100" alt="Protected">
              <img v-else src="../assets/info.svg" class="d-block w-100" alt="Show">
            </div>
          </div>
          <div class="flex-fill">
            <input
              type="text"
              placeholder="Enter name"
              v-model="detail.name"
              class="form-control form-control-sm" />
          </div>
        </div>
      </div>
      <div class="col-8">
        <div class="d-flex">
          <input
            :type="detail.secure ? 'password' : ''"
            placeholder="Enter value"
            v-model="detail.value"
            class="form-control form-control-sm" />
          <div v-if="value.details[index]" class="ml-2">
            <button
              type="button"
              @click.prevent="value.details.splice(index, 1)"
              class="btn btn-sm btn-danger">
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ItemEditor',
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      newDetail: {
        name: '',
        value: '',
        secure: true
      }
    }),
    watch: {
      newDetail: {
        deep: true,
        handler(value) {
          if (value.name) {
            this.value.details.push(JSON.parse(JSON.stringify(value)));
            this.newDetail.name = '';
            this.newDetail.value = '';
            this.newDetail.secure = true;
          }
        }
      }
    },
    computed: {
      showNewDetail() {
        for (let detail of this.value.details) {
          if (!detail.name || !detail.value) {
            return false;
          }
        }
        return true;
      },
      displayDetails() {
        const details = [];
        for (let detail of this.value.details) {
          details.push(detail);
        }
        if (this.showNewDetail) {
          details.push(this.newDetail);
        }
        return details;
      }
    }
  }
</script>

<style scoped>

</style>