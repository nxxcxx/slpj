import Vue from 'vue'
import moment from 'moment'

Vue.filter( 'relativeTime', function ( time ) {
	return moment( time ).fromNow()
} )
