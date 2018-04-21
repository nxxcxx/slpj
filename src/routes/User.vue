<template>
	<div id="User">

		<div class="row">

			<div class="col s12">

				USER<pre>{{ user }}</pre>

				<img v-for="( path, idx ) in imgPaths" :key="idx" :src="path" width="100px">

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
					<li class="collection-item avatar" v-for="( comment, idx ) in comments" :key="idx">
						<i v-if="!comment.avatarImgPath" class="material-icons circle">account_circle</i>
						<img v-if="comment.avatarImgPath" :src="comment.avatarImgPath" class="circle">
						<span class="title">[{{ comment.byUserId }}] {{ comment.time }}</span>
						<p>{{ comment.text }}</p>
					</li>
				</ul>


			</div>

		</div>

	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'User',
	data() {
		return {
			user: {},
			imgPaths: [],
			comments: []
		}
	},
	mounted() {
		this.loadUser()
	},
	methods: {
		loadUser() {
			axios.get( `http://localhost:8001/user/${this.$route.params.id}` )
				.then( res => {
					this.user = res.data
					this.loadUserImages()
					this.loadUserComments()
				} )
		},
		loadUserImages() {
			axios.get( `http://localhost:8001/user/${this.user._id}/images` )
				.then( res => {
					this.imgPaths = res.data.map( meta => meta.path )
				} )
		},
		loadUserComments() {
			axios.get( `http://localhost:8001/user/${this.$route.params.id}/comments`)
				.then( res => {
					this.comments = res.data.comments


					this.comments.map( cm => {
						axios.get( `http://localhost:8001/user/${cm.byUserId}/images` )
							.then( res => {
								// todo cleanup
								console.log( res.data )
								this.$set( cm, 'avatarImgPath', res.data[ 0 ] ? res.data[ 0 ].path : null )
							} )
					} )
					console.log( this.comments )


				} )
		},
		postComment() {
			axios.post( 'http://localhost:8001/upload/comment', {
				toUserId: this.user._id,
				text: this.$refs.commentText.value
			}, { requireAuth: true } )
			.then( res => {
				console.log( res )
				// reload comment/page
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
