<template>
	<div id="Users" class="container">
		<h5>USERS</h5>
		<ul id="inf-scroll" class="collection">
			<li class="collection-item avatar" v-for="( user, idx ) in users" :key="idx">
				<router-link :to="`user/${user._id}`">
					<i v-if="!getUserImagePaths( user._id )" class="material-icons circle">account_circle</i>
					<img v-if="getUserImagePaths( user._id )" class="circle" :src="getUserImagePaths( user._id )">
					<span class="title"> {{ user.email }} </span>
				</router-link>
			</li>
		</ul>
		<div class="center-align" v-if="this.users.length !== this.totalUsers">
			<button v-on:click="loadNextPage" style="width: 100%;"
				class="btn waves-effect waves-light">
				<i class="material-icons large">expand_more</i>
			</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import InfiniteScroll from 'infinite-scroll'

export default {

	name: 'Users',
	data() {
		return {
			limitItemPerPage: 10
		}
	},
	computed: {
		users() { return this.$store.state.users },
		totalUsers() { return this.$store.state.totalUsers },
		currentPage() { return this.$store.state.currentPage }
	},
	mounted() {
		this.infScroll = new InfiniteScroll( '#inf-scroll', {
			path: this.getPath,
			append: false,
			responseType: 'json',
			history: false
		} )
		this.infScroll.on( 'load', ( res ) => {
			if ( res === null ) return
			this.$store.commit( 'incrementPage' )
			this.$store.commit( 'setTotalUsers', { totalUsers: res.total } )
			this.$store.commit( 'appendUsers', { users: res.users } )
		} )
		if ( this.currentPage === 1 )
			this.infScroll.loadNextPage()
	},
	destroyed() {
		this.infScroll.destroy()
	},
	methods: {
		loadNextPage() {
			this.infScroll.loadNextPage()
		},
		getPath() {
			// todo update totalUsers here
			if ( this.users.length === this.totalUsers ) return
			return `http://localhost:8001/users?limit=${this.limitItemPerPage}&skip=${(this.currentPage - 1)*this.limitItemPerPage}`
		},
		getUserImagePaths( userId ) {
			let user = this.users.find( u => u._id === userId )
			if ( user ) return user.images[ 0 ] ? user.images[ 0 ].path : null
			return null
		},
	},
}
</script>

<style lang="sass">
	.collection-item
		min-height: 60px !important
</style>
