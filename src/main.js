import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/******************
**			     **
**  🔥 FIREBASE  **
**			     **
******************/

// Service worker part

// Register service worked in standard vanillla JS way
// 
// (Alt method at https://dev.to/vbanditv/how-to-add-fcm-firebase-cloud-messaging-to-vuejs-37np)

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('firebase-messaging-sw.js')
	  .then(reg => {
		console.log(`Service Worker Registered (Scope: ${reg.scope})`);
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
**  VUE BASICS  ** 
**				**
*****************/

createApp(App).use(router).mount('#app')
