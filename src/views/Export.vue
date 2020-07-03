<template>
  <div class="d-flex flex-fill align-items-center justify-content-center">
    <template v-if="encryptedJSON">
      <div class="w-100 p-3" style="max-width: 750px">
        <pre class="bg-dark text-white small rounded p-3" style="max-height: 75vh; overflow: auto;">{{ encryptedJSON }}</pre>

        <div class="text-center">
          <button type="button"
                  @click.prevent="download"
                  class="btn btn-primary">
            Download
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="w-100 p-3" style="max-width: 500px">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Please enter password for encryption</h5>
            <form @submit.prevent="encrypt">
              <fieldset :disabled="encryption.status.isBusy">
                <div class="form-group">
                  <input type="password"
                         required="required"
                         v-model="encryption.form.password"
                         placeholder="Password"
                         class="form-control" />
                </div>

                <div class="form-group">
                  <input type="password"
                         required="required"
                         v-model="encryption.form.rePassword"
                         placeholder="Re-enter Password"
                         class="form-control" />
                </div>

                <div v-if="encryption.status.errorMessage" class="alert alert-danger">
                  <p class="m-0 small">{{ encryption.status.errorMessage }}</p>
                </div>

                <button type="submit" class="btn btn-primary w-100">
                  <span v-if="encryption.status.isBusy" class="spinner-border spinner-border-sm" role="status" />
                  <span v-else>Encrypt</span>
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import Utils from '../libs/Utils';

  export default {
    name: 'Export',
    data: () => ({
      encryptedJSON: '',
      encryption: {
        form: {
          password: '',
          rePassword: ''
        },
        status: {
          isBusy: false,
          errorMessage: ''
        }
      }
    }),
    computed: {
      credentials: {
        get() {
          return this.$store.state.credentials;
        },
        set(value) {
          this.$store.state.credentials = value;
        }
      }
    },
    created() {
      if (!this.credentials.length) {
        this.$router.push('/manage');
      }
    },
    methods: {
      encrypt() {
        const { status, form } = this.encryption;
        try {
          status.isBusy = true;
          status.errorMessage = '';

          if (form.password !== form.rePassword) {
            throw new Error('Password did not match');
          }

          this.encryptedJSON = this.credentials.map(item => {
            item = JSON.parse(JSON.stringify(item));
            item.details.map(detail => {
              if (detail.secure) detail.value = Utils.encrypt(detail.value, form.password).toString();
              return detail;
            });
            return item;
          });
        }
        catch (e) {
          status.errorMessage = e.message;
        }
        finally {
          status.isBusy = false;
        }
      },
      download() {
        const blob = new Blob([JSON.stringify(this.encryptedJSON, null, 2)], {
          type: "text/plain;charset=utf-8"
        });

        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.target = '_blank';
        anchor.download = 'encrypted-credentials.json';
        anchor.click();
      }
    }
  }
</script>

<style scoped>

</style>