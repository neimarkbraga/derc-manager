<template>
  <div id="app" class="d-flex flex-column min-vh-100 w-100">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-100">
        <div class="container">
          <router-link to="/" class="navbar-brand">DERCManager</router-link>

          <ul class="navbar-nav mr-auto">
            <router-link to="/manage" tag="li" class="nav-item" exact>
              <a class="nav-link">Create</a>
            </router-link>

            <router-link to="/import" tag="li" class="nav-item" exact>
              <a class="nav-link">Import</a>
            </router-link>
          </ul>
        </div>
      </nav>
    </header>

    <div class="d-flex flex-column flex-fill w-100">
      <router-view />
    </div>

    <footer class="p-2">
      &copy; 2020
    </footer>
  </div>
</template>

<script>

  export default {
    name: 'App',
    data: () => ({

    })
  }
</script>

<style lang="scss">
  @import "~bootstrap/scss/bootstrap";
</style>
