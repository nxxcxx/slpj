<template>
	<div id="User">

		<div class="row">

			<div class="col s12">

			<div v-if="loading" class="progress">
				<div class="indeterminate"></div>
			</div>

				<h5>USER</h5>

				<img v-for="( img, idx ) in user.images" :key="idx" :src="img.path" width="100px">

				<ul ref="collapsible" class="collapsible">
					<li>
						<div class="collapsible-header">
							<span>User info</span>
						</div>
						<div class="collapsible-body">
							<pre style="max-height: 300px; overflow-y: scroll;">{{ user }}</pre>
						</div>
					</li>
				</ul>

				<br>

				<div>
					<form v-if="isAuthenticated()">
						<div class="input-field">
							<i class="material-icons prefix">comment</i>
							<textarea id="comment" class="materialize-textarea" ref="commentText"></textarea>
							<label for="comment">Enter a comment</label>
						</div>
						<button v-on:click="postComment"
							class="btn waves-effect waves-light right">
							POST
						</button>
					</form>
				</div>

				<br>

				<h5>COMMENTS</h5>
				<ul class="collection">
					<li class="collection-item avatar" v-for="( comment, idx ) in user.comments" :key="idx">
						<i v-if="!getCommentAvatarImagePath( comment )" class="material-icons circle">account_circle</i>
						<img v-if="getCommentAvatarImagePath( comment )" :src="getCommentAvatarImagePath( comment )" class="circle">
						<span class="title"><b> {{ comment.byUserId.email }} </b></span>
						<span style="float: right;"> {{ comment.time | relativeTime }} </span>
						<p>{{ comment.text }}</p>
					</li>
				</ul>

			</div>

		</div>

	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import auth from '../auth.js'

export default {
	name: 'User',
	data() {
		return {
			user: {},
			loading: true
		}
	},
	mounted() {
		M.Collapsible.init( this.$refs.collapsible )
		this.loadUser()
	},
	methods: {
		isAuthenticated() {
			return auth.isAuthenticated()
		},
		getCommentAvatarImagePath( comment ) {
			if ( comment ) return comment.byUserId.images[ 0 ] ? comment.byUserId.images[ 0 ].path : null
			return null
		},
		loadUser() {
			axios.get( `http://localhost:8001/user/${this.$route.params.id}` )
				.then( res => {
					console.log( res.data )
					this.user = res.data
					this.loading = false
				} )
		},
		postComment() {
			axios.post( 'http://localhost:8001/upload/comment', {
				toUserId: this.user._id,
				text: this.$refs.commentText.value
			}, { requireAuth: true } )
			.then( res => {
				this.$router.go()
			} )
		},
	}
}
</script>

<style lang="sass">
	p
		white-space: pre-line
	pre
		margin: 0px
</style>
