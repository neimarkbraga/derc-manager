<template>
  <div class="d-flex flex-fill align-items-center justify-content-center">
    <template v-if="encryptedJSON">
      <div class="w-100 p-3" style="max-width: 750px">
        <pre class="bg-dark text-white small rounded p-3" style="max-height: 75vh; overflow: auto;">{{ encryptedJSON }}</pre>

        <form @submit.prevent="decrypt">
          <fieldset :disabled="decryption.status.isBusy">
            <div class="input-group">
              <input
                type="password"
                class="form-control"
                required="required"
                v-model="decryption.form.password"
                placeholder="Password" />
              <div class="input-group-append">
                <button class="btn btn-primary">
                  <span v-if="decryption.status.isBusy" class="spinner-border spinner-border-sm" role="status" />
                  <span v-else>Decrypt</span>
                </button>
              </div>
            </div>

            <div v-if="decryption.status.errorMessage" class="alert alert-danger mt-3">
              <button type="button" class="close" @click.prevent="decryption.status.errorMessage = ''">&times;</button>
              <p class="m-0">{{ decryption.status.errorMessage }}</p>
            </div>
          </fieldset>
        </form>
      </div>
    </template>

    <template v-else>
      <div class="w-100 p-3" style="max-width: 500px">
        <div class="card">
          <div class="card-body">
            <h5 class="mb-3">Please enter your encrypted data</h5>

            <form @submit.prevent="openJSON">
              <fieldset :disabled="jsonEntry.status.isBusy">
                <div class="custom-file">
                  <input type="file" @input="onFileSelected($event.target.files[0])" class="custom-file-input">
                  <label class="custom-file-label">Upload JSON file</label>
                </div>

                <div class="text-center p-2">
                  or
                </div>

                <div class="form-group">
                <textarea class="form-control"
                          required="required"
                          rows="3"
                          v-model="jsonEntry.form.text"
                          placeholder="Enter JSON text" />
                </div>

                <div v-if="jsonEntry.status.errorMessage" class="alert alert-danger">
                  <p class="m-0 small">{{ jsonEntry.status.errorMessage }}</p>
                </div>

                <button type="submit" class="btn btn-primary w-100">
                  <span v-if="jsonEntry.status.isBusy" class="spinner-border spinner-border-sm" role="status" />
                  <span v-else>Open</span>
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
    name: 'Import',
    data: () => ({
      encryptedJSON: '',
      jsonEntry: {
        form: {
          text: ''
        },
        status: {
          isBusy: false,
          errorMessage: ''
        }
      },
      decryption: {
        form: {
          password: ''
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
    methods: {
      setEncryptedJSON(value) {
        const isValid = (() => {
          if (!Array.isArray(value)) return false;
          for (let item of value) {
            if (typeof item.title !== 'string') return false;
            if (!Array.isArray(item.details)) return false;
            for (let detail of item.details) {
              if (typeof detail.name !== 'string') return false;
              if (typeof detail.value !== 'string') return false;
              if (typeof detail.secure !== 'boolean') return false;
            }
          }
          return true;
        })();

        if (!isValid) {
          throw new Error('Invalid value format.');
        }

        this.encryptedJSON = value;
      },
      openJSON() {
        const { status, form } = this.jsonEntry;
        try {
          status.isBusy = true;
          status.errorMessage = '';
          this.setEncryptedJSON(JSON.parse(form.text))
        }
        catch (e) {
          status.errorMessage = e.message;
        }
        finally {
          status.isBusy = false;
        }
      },
      async onFileSelected(file = null) {
        if (file) {
          const { status } = this.jsonEntry;
          try {
            status.isBusy = true;
            status.errorMessage = '';

            const content = await (new Promise(((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = () => reject(new Error('Unable to read file.'));
              reader.readAsText(file);
            })));

            this.setEncryptedJSON(JSON.parse(content));
          }
          catch (e) {
            status.errorMessage = e.message;
          }
          finally {
            status.isBusy = false;
          }
        }
      },
      decrypt() {
        const { status, form } = this.decryption;
        try {
          status.isBusy = true;
          status.errorMessage = '';

          this.credentials = this.encryptedJSON.map(item => {
            item = JSON.parse(JSON.stringify(item));
            item.details.map(detail => {
              if (detail.secure) detail.value = Utils.decrypt(detail.value, form.password);
              return detail;
            });
            return item;
          });
          this.$store.state.imported = true;
          this.$router.push('/manage');
        }
        catch (e) {
          status.errorMessage = e.message;
        }
        finally {
          status.isBusy = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>