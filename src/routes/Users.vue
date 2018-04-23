<template>
	<div id="Users">
		<ul class="collection">
			<li class="collection-item avatar" v-for="( user, idx ) in users" :key="idx">
				<router-link :to="`user/${user._id}`">
					<i v-if="!getUserImagePaths( user._id )" class="material-icons circle">account_circle</i>
					<img v-if="getUserImagePaths( user._id )" class="circle" :src="getUserImagePaths( user._id )">
					<span class="title"> {{ user.email }} </span>
				</router-link>
			</li>
		</ul>

		<ul class="pagination">
			<li :class="{ disabled: currentPage === 1, 'waves-effect': currentPage !== 1 }"
				@click="decrementPage()"><a><i class="material-icons">chevron_left</i></a>
			</li>
			<li v-for="n in numPaginationColumn" :key="n"
				class="waves-effect"
				v-if="getPaginationButtonNumber( n ) <= totalPages"
				:class="{ active: getPaginationButtonNumber( n ) === currentPage }"
				@click="gotoPage( getPaginationButtonNumber( n ) )">
				<a> {{ getPaginationButtonNumber( n ) }} </a>
			</li>
			<li :class="{ disabled: currentPage === totalPages, 'waves-effect': currentPage !== totalPages }"
				@click="incrementPage()"><a><i class="material-icons">chevron_right</i></a>
			</li>
		</ul>

	</div>
</template>

<script>
import axios from 'axios'

export default {

	name: 'Users',
	data() {
		return {
			totalUsers: -1,
			users: [],
			currentPage: 1,
			totalPages: -1,
			numPaginationColumn: 5,
			limitItemPerPage: 10,
			paginationOffset: 0,
			pagesNumbers: Array.from( { length: 20 }, ( v, k ) => k + 1 )
		}
	},
	mounted() {
		this.loadUsers()
	},
	methods: {
		loadUsers() {
			axios.get( 'http://localhost:8001/users', {
				params: {
					limit: this.limitItemPerPage,
					skip: ( this.currentPage - 1 ) * this.limitItemPerPage
				}
			} )
			.then( res => {
				this.totalUsers = res.data.total
				this.users = res.data.users
				this.totalPages = Math.ceil( this.totalUsers / this.limitItemPerPage )
			} )
			.catch( err => console.error( err ) )
		},
		updatePaginationOffset() {
			this.paginationOffset = ~~( ( this.currentPage - 1 ) / this.numPaginationColumn + 1 ) - 1
		},
		incrementPage() {
			if ( this.currentPage === this.totalPages ) return
			this.currentPage += 1
			this.updatePaginationOffset()
			this.loadUsers()
		},
		decrementPage() {
			if ( this.currentPage === 1 ) return
			this.currentPage -= 1
			this.updatePaginationOffset()
			this.loadUsers()
		},
		gotoPage( n ) {
			this.currentPage = n
			this.updatePaginationOffset()
			this.loadUsers()
		},
		getPaginationButtonNumber( n ) {
			return this.paginationOffset * this.numPaginationColumn + n
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
