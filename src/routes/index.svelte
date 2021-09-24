<script context="module">
	import {firebaseFirestore} from '../firebase';

	export async function preload({ params, query }) {
		let db = firebaseFirestore();
		let snapshot = await db.collection('projects').get();
		let projects = snapshot.docs.map(item => ({
            ...item.data(),
            slug: item.id,
		}));
		return {projects};
	}
</script>

<script>
	export let projects;
</script>

<style>
	p {
		text-align: center;
		margin: 0 auto;
	}

	.project img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	h2 {
		font-size: 1.5rem;
    }
    section > article {
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
    div.project {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}
	.donate {
		line-height: 1.8em;
	}
	.donate img {
		vertical-align: bottom;
	}
</style>

<svelte:head>
	<link rel="canonical" href="https://isitoutyet.info/"/>

	<meta property="og:type" content="website"/>

	<title>Is it out yet? Home</title>
	<meta name="description"
		content="Is it out yet? The release-tracking app that can answer the question!"/>

	<meta property="og:title" content="Is it out yet? Home"/>
	<meta property="og:description"
		content="Is it out yet? The release-tracking app that can answer the question!"/>

	<meta property="twitter:title" content="@askisitoutyet Home"/>
	<meta property="twitter:description"
		content="@askisitoutyet: The release-tracking app that can answer the question!"/>
</svelte:head>

<section>
	<article>
		{#each projects as item (item.slug)}
			<div class="project">
				<h2>
					<a href="/projects/{item.slug}">{item.name}</a>
				</h2>
				{#if item.logo}
					<a href="/projects/{item.slug}">
						<img width="200" height="200"
							src={item.logo}
							alt="{item.name} logo"
							loading="lazy" />
					</a>
				{/if}
			</div>
		{/each}
	</article>
	<footer>
		<p class="donate">Enjoying this site? Please <a href="https://liberapay.com/diddledani/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> to it's continued maintenance.</p>
	</footer>
</section>
