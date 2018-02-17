<template>
	<div id="app">
		<NavBar></NavBar>
		<router-view></router-view>
	</div>
</template>

<script>
import NavBar from './NavBar.vue'

export default {
	name: 'app',
	components: {
		NavBar
	}
}
</script>

<style lang="sass">
body
	margin: 0px
ul
	list-style-type: none
	padding: 0
li
	display: inline-block
	margin: 0 10px
a
	color: #002b6b
#app
	font-family: monospace
	background: #e6e6e6
</style>
