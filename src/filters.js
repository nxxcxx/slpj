import Vue from 'vue'
import moment from 'moment'

Vue.filter( 'relativeTime', function ( value ) {
	return moment( value ).startOf( 'hour' ).fromNow()
} )
