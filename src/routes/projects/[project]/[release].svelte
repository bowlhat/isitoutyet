<script context="module">
	export async function preload({ params, query }) {
        const res = await this.fetch(`/projects/${params.project}/${params.release}.json`);

		if (res.status === 200) {
			return await res.json();
		}
	}
</script>

<script>
    export let project;
    export let release;
    const epoch = new Date(0);
    const epochDate = epoch.toDateString();
    const epochTime = epoch.toTimeString();
    
    let releaseDate = epochDate;
    let releaseTime = epochTime;

    let emailDate = epochDate;
    let emailTime = epochTime;
    
    let email = {};

    $: {
        let reldate = new Date(release.date) || epoch;
        releaseDate = reldate.toDateString();
        releaseTime = reldate.toTimeString();
    }
    $: {
        email = release.email;
        let recdate = new Date(email.received) || epoch;
        emailDate = recdate.toDateString();
        emailTime = recdate.toTimeString();
    }
</script>

<style>
    code {
        display: block;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
    }
</style>

<svelte:head>
	<title>Release information for {project.name} {release.version} {release.islts ? 'LTS' : ''} {release.codename} {release.beta}</title>
	<link rel="canonical" href="https://isitoutyet.info/projects/{project.slug}"/>
</svelte:head>

<section>
    <nav>
        <a href="/projects/{project.slug}">
            &laquo; Back to {project.name}
        </a>
    </nav>
    <header>
        <h2>
            Release information for
            <a href={project.homepage}>{project.name}</a> {release.version}
            {release.islts ? 'LTS' : ''} {release.codename} {release.beta}
        </h2>
    </header>
</section>

<section>
    <article>
        <p>Release date: {releaseDate} {releaseTime}</p>
        <p>Email received: {emailDate} {emailTime}</p>
        <p>Subject: {email && email.subject ? email.subject : ''}</p>
        <p class="donate">Your donations keep us afloat. Please <a href="https://liberapay.com/diddledan/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> to continued maintenance of this project.</p>
        <code>
            {#if (email && email.body)}
                {#each email.body.split(/\r\n\r\n|\n\n|\r\r/) as paragraph}
                    <p>
                        {#if paragraph.trim().match(/^([^\n\r]+(\r\n|\n|\r)\s*[-]+\s*)|(\s*[-]+\s*(\r\n|\n|\r).*)$/)}
                            {#each paragraph.trim().split(/\r\n|\n|\r/) as line}
                                {line}<br />
                            {/each}
                        {:else}
                            {paragraph}
                        {/if}
                    </p>
                {/each}
            {:else}
                No announcement text available
            {/if}
        </code>
    </article>
</section>