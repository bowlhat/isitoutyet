<script>
    import {onMount} from 'svelte';
	import {firebaseMessaging} from '../firebase';

    let message = '';
	let showMessage = false;
	let timer, messaging;
	const onMessage = payload => {
		console.log('[firebase-messaging] received foreground message:', payload);
		if ('notification' in payload) {
			message = payload.notification;
			showMessage = true;
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => showMessage = false, 30000);
		}
	}

	onMount(async () => {
		messaging = firebaseMessaging();
		messaging.onMessage(onMessage);
	});
</script>

<style>
    .push-message {
        position: fixed;
        left: 1rem;
        bottom: 1rem;
        right: 1rem;
        max-height: calc(100vh - 4em);
        overflow: auto;
        padding: 1em;
        border-radius: 0.2em;
        background: white;
        box-shadow: #000 2px 2px 4px;
    }

    button {
        display: block;
    }
</style>
{#if showMessage}
    <div class="push-message">
        <h2>{message.title}</h2>
        <p>{message.body}</p>
        <button on:click='{() => showMessage = false}'>close notification</button>
    </div>
{/if}