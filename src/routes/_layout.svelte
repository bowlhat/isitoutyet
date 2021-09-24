<script>
	import Nav from '../components/Nav.svelte';
	import PushNotificationMessage from '../components/PushNotificationMessage.svelte';
	import FirebaseAuth from '../components/FirebaseAuth.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
		min-height: calc(
			100vh
			- 3.5rem - 1px /* nav */
			- 12.5rem /* footer */
			- 3rem /* praetorians */
		);
	}

    footer {
		padding: 1.5rem;
		text-align: center;
    }

    footer a,
    footer a:active,
    footer a:hover,
    footer a:focus,
    footer a:focus-within {
		color: var(--app-dark-text-color);
    }

	.copyright-logo {
		background: url('/bowlhat-logo.svg') center center no-repeat;
		background-size: 5rem 3rem;
		width: 5rem;
		height: 3rem;
		margin: 2rem auto;
		text-indent: -200vw;
    }

    @media (prefers-color-scheme: dark) {
		.copyright-logo {
			filter: invert(100%);
		}
    }

</style>

<FirebaseAuth>
	<Nav {segment}/>

	<main>
		<slot></slot>
	</main>

	<footer>
		<div>
			<p>
				<a href="/">Home</a>
				<span>|</span>
				<a href="/privacy">Privacy</a>
				<span>|</span>
				<a href="/terms">Terms</a>
				<span>|</span>
				<span>© Dani Llewellyn T/A Bowl Hat</span>
			</p>
			<p class="copyright-logo">Bowl Hat</p>
		</div>
		<PushNotificationMessage/>
	</footer>
</FirebaseAuth>
