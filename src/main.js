/*******************
**   ⤵️ IMPORTS   **
*******************/

// Libraries
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


/******************
**			     **
**  🔥 FIREBASE  **
**			     **
******************/

// Service worker part
// 		( based on https://dev.to/vbanditv/how-to-add-fcm-firebase-cloud-messaging-to-vuejs-37np )

if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('firebase-messaging-sw.js')
	.then(reg => {
		// console.log(`Service Worker Registered (Scope: ${reg.scope})`);
	})
	.catch(error => {
		const msg = `Service Worker Error (${error})`;
		console.error(msg);
	});
} else {
	// happens when the app isn't served over HTTPS or if the browser doesn't support service workers
	console.warn('Service Worker not available');
}
  

/*****************
**				**
**     MISC     ** 
**				**
*****************/

// Custom page titles for Vue Router

router.beforeEach((to, from, next) => {
	// Get the page title from the route meta data that we have defined
	// See further down below for how we setup this data
	const title = to.meta.title
	// If the route has a title, set it as the page title of the document/page
	if (title) {
		document.title = title
	}
	// Continue resolving the route
	next()
})


/*****************
**				**
**  VUE BASICS  ** 
**				**
*****************/

createApp(App).use(router).mount('#app')
