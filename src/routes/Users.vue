<template>
	<div id="Users">
		<ul id="inf-scroll" class="collection">
			<li class="collection-item avatar" v-for="( user, idx ) in users" :key="idx">
				<router-link :to="`user/${user._id}`">
					<i v-if="!getUserImagePaths( user._id )" class="material-icons circle">account_circle</i>
					<img v-if="getUserImagePaths( user._id )" class="circle" :src="getUserImagePaths( user._id )">
					<span class="title"> {{ user.email }} </span>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import axios from 'axios'
import InfiniteScroll from 'infinite-scroll'

export default {

	name: 'Users',
	data() {
		return {
			totalUsers: Infinity,
			users: [],
			currentPage: 1,
			limitItemPerPage: 15,
			pagesNumbers: Array.from( { length: 20 }, ( v, k ) => k + 1 )
		}
	},
	mounted() {
		let infScroll = new InfiniteScroll( '#inf-scroll', {
			path: this.getPath,
			append: false,
			responseType: 'json',
			history: false
		} )
		infScroll.loadNextPage()
		infScroll.on( 'load', ( res ) => {
			console.log( this.currentPage )
			if ( res === null ) return
			this.currentPage += 1
			this.totalUsers = res.total
			this.users = [ ...this.users, ...res.users ]
		} )
	},
	methods: {
		getPath() {
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
