<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}

    footer {
      padding: 24px;
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
		background-size: 80px 48px;
		width: 190px;
		height: 50px;
		margin: 35px auto;
		text-indent: -9999px;
    }

    @media (prefers-color-scheme: dark) {
		.copyright-logo {
			filter: invert(100%);
		}
    }

</style>

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
			<span>© Daniel Llewellyn T/A Bowl Hat</span>
		</p>
		<p class="copyright-logo">Bowl Hat</p>
	</div>
</footer>