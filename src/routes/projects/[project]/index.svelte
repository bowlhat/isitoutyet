<script context="module">
    import {firebaseFirestore} from '../../../firebase';
	export async function preload({ params, query }) {
        let db = firebaseFirestore();
		let projectQuery = db
            .collection('projects')
            .doc(params.project);
        let project = await projectQuery.get();
        let releases = await projectQuery
            .collection('releases')
            .orderBy('date', 'desc')
            .get();

        if (!project.exists) {
            return this.error(404, 'Not Found')
        }

        return {
            project: {
                ...project.data(),
                slug: project.id,
            },
            releases: releases.docs.map(release => {
                const data = release.data();
                return {
                    ...data,
                    email: data.email.id,
                    id: release.id,
                }
            }),
        };
	}
</script>

<script>
    import PushNotificationButton from '../../../components/PushNotificationButton.svelte';

    export let project;
    export let releases;
    
    let counter = 0;
</script>

<style>
    header {
        display: grid;
        grid-auto-rows: 1fr;
        align-items: center;
    }
    .list {
        list-style: none;
        padding: 0;
    }
    .list li {
        margin: 18px 0;
    }
    .logo {
        text-align: center;
        margin-top: 2rem;
    }
    .donate {
		line-height: 1.8em;
	}
	.donate img {
		vertical-align: bottom;
	}
</style>

<svelte:head>
	<link rel="canonical" href="https://isitoutyet.info/projects/{project.slug}"/>

	<meta property="og:type" content="article"/>

    <title>Is {project.name} out yet?</title>
	<meta name="description"
		content="Latest releases information for {project.name}. Is it out yet? Find out now!"/>

	<meta property="og:title" content="Is {project.name} out yet?"/>
	<meta property="og:description"
		content="Latest releases information for {project.name}. Is it out yet? Find out now!"/>

	<meta property="twitter:title" content="@askisitoutyet about {project.name}"/>
	<meta property="twitter:description"
		content="Latest releases information for {project.name}. @askisitoutyet now!"/>
</svelte:head>

<section>
    <nav>
        <a href="/">
            &laquo; Back to all projects
        </a>
    </nav>
    <header>
        <h2>
            Is <em><a href={project.homepage}>{project.name}</a></em> out yet?
        </h2>
    </header>
</section>

<section>
    <article>
        <PushNotificationButton project={project.slug} />
        {#if project.logo}
            <div class="logo">
                <img width="200" height="200"
                    src={project.logo}
                    alt="{project.name} logo"
                    loading="lazy" />
            </div>
        {/if}
        <p>{project.description}</p>
        <h3>Known releases</h3>
        <ul class="list">
            {#each releases as release (release.id)}
                {#if counter++ === 5 || counter % 35 === 0}
                    <li class="donate">Please <a href="https://liberapay.com/diddledani/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> so that we may continue tracking {project.name}'s releases</li>
                {/if}
                <li>
                    <a href="/projects/{project.slug}/{release.id}">
                    {project.name} {release.version} {release.codename}
                    {release.islts ? 'LTS' : ''} {release.beta}
                    </a>
                </li>
            {/each}
            {#if counter < 5 || counter % 35 > 12}
                <li class="donate">Please <a href="https://liberapay.com/diddledani/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> so that we may continue tracking {project.name}'s releases</li>
            {/if}
        </ul>
    </article>
</section>