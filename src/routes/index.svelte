<script context="module">
	export async function preload({ params, query }) {
		const res = await this.fetch(`/projects.json`);
		const json = await res.json();
		const projects = Object.keys(json).map(key => json[key]);

		if (res.status === 200) {
			return { projects };
		}
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
	<title>Tracked Projects</title>
	<link rel="canonical" href="https://isitoutyet.info/projects"/>
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
						<img src={item.logo} alt="{item.name} logo" loading="lazy" />
					</a>
				{/if}
			</div>
		{/each}
	</article>
	<footer>
		<p class="donate">Enjoying this site? Please <a href="https://liberapay.com/diddledan/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> to it's continued maintenance.</p>
	</footer>
</section>
