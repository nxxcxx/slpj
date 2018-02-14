<template>
  <div id="navBar">
    <ul>
      <li>
        <router-link to="/">HOME</router-link>
        <router-link to="/users">USERS</router-link>
        <router-link to="/signin">SINGIN</router-link>
        <router-link to="/private">PRIVATE</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>

<style lang="sass">
#navBar
  background: #b0b0b0
</style>
