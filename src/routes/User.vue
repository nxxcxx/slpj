<template>
	<div id="User">

		<div class="row">

			<div class="col s12">

				USER<pre style="max-height: 300px; overflow: scroll;">{{ user }}</pre>

				<img v-for="( img, idx ) in user.images" :key="idx" :src="img.path" width="100px">

				<form>
					<div class="input-field">
						<i class="material-icons prefix">comment</i>
						<textarea class="materialize-textarea" ref="commentText"></textarea>
						<label>Enter a comment</label>
						<button v-on:click="postComment"
							class="btn waves-effect waves-light right">
							POST
						</button>
					</div>
				</form>

				COMMENTS
				<ul class="collection">
					<li class="collection-item avatar" v-for="( comment, idx ) in user.comments" :key="idx">
						<i v-if="!getCommentAvatarImagePath( comment )" class="material-icons circle">account_circle</i>
						<img v-if="getCommentAvatarImagePath( comment )" :src="getCommentAvatarImagePath( comment )" class="circle">
						<span class="title">[{{ comment.byUserId.email }}] {{ comment.time | relativeTime }}</span>
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

export default {
	name: 'User',
	data() {
		return {
			user: {},
		}
	},
	mounted() {
		this.loadUser()
	},
	methods: {
		getCommentAvatarImagePath( comment ) {
			if ( comment ) return comment.byUserId.images[ 0 ] ? comment.byUserId.images[ 0 ].path : null
			return null
		},
		loadUser() {
			axios.get( `http://localhost:8001/user/${this.$route.params.id}` )
				.then( res => {
					console.log( res.data )
					this.user = res.data
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
