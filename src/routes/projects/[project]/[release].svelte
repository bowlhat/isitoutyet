<script context="module">
    import {firebaseFirestore} from '../../../firebase';
    
    export async function preload({ params, query }) {
        let db = firebaseFirestore();
		let projectQuery = db
            .collection('projects')
            .doc(params.project);
        let project = await projectQuery.get();
        let release = await projectQuery
            .collection('releases')
            .doc(params.release)
            .get();

        let emailField = release.data().email
        let email
        if (emailField.get) {
            email = (await emailField.get()).data();
        }
        else if (typeof emailField === 'string') {
            email = (await db.doc(emailField).get()).data()
        }

        let dateField = release.data().date
        let date
        if (typeof dateField.toDate === 'function') {
            date = dateField.toDate()
        } else if (typeof dateField === 'string') {
            date = new Date(dateField)
        } else {
            date = new Date(0)
        }

        let receivedField = email.received
        let received
        if (receivedField) {
            if (typeof receivedField.toDate === 'function') {
                received = receivedField.toDate()
            } else if (typeof receivedField === 'string') {
                received = new Date(receivedField)
            }
        } else {
            received = date
        }

        return {
            project: {
                ...project.data(),
                slug: project.id,
            },
            release: {
                ...release.data(),
                date,
                email: {
                    ...email,
                    received,
                },
            },
        }
	}
</script>

<script>
    export let project;
    export let release;
    const epoch = new Date(0);
    const epochDate = epoch.toDateString();
    const epochTime = epoch.toTimeString();
    
    let releaseDate;
    let releaseTime;

    let emailDate;
    let emailTime;
    
    let email = {};

    let reldate = epoch
    $: {
        reldate = new Date(release.date || epoch);
        releaseDate = reldate.toDateString();
        releaseTime = reldate.toTimeString();
    }
    let recdate = epoch
    $: {
        email = release.email;
        recdate = new Date(email.received || epoch);
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

    <title>{project.name} {release.version} {release.islts ? 'LTS' : ''} {release.codename} {release.beta} is out now!</title>
	<meta name="description"
		content="Is it out yet? tracked the release of {project.name} {release.version}
            {release.islts ? 'LTS' : ''} {release.codename} {release.beta} on
            {reldate.getFullYear()}-{reldate.getMonth()}-{reldate.getDate()} at
            {reldate.getHours()}:{reldate.getMinutes()}"/>

	<meta property="og:title" content="{project.name} {release.version} {release.islts ? 'LTS' : ''} {release.codename} {release.beta} is out now!"/>
	<meta property="og:description"
		content="Is it out yet? tracked the release of {project.name} {release.version}
            {release.islts ? 'LTS' : ''} {release.codename} {release.beta} on
            {reldate.getFullYear()}-{reldate.getMonth()}-{reldate.getDate()} at
            {reldate.getHours()}:{reldate.getMinutes()}"/>

	<meta property="twitter:title" content="{project.name} {release.version} {release.islts ? 'LTS' : ''} {release.codename} {release.beta} is out now!"/>
	<meta property="twitter:description"
		content="@askisitoutyet tracked the release of {project.name} {release.version}
            {release.islts ? 'LTS' : ''} {release.codename} {release.beta} on
            {reldate.getFullYear()}-{reldate.getMonth()}-{reldate.getDate()} at
            {reldate.getHours()}:{reldate.getMinutes()}"/>
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
        <p><time datetime={reldate.toISOString()}>Release date: {releaseDate} {releaseTime}</time></p>
        <p>Subject: {email && email.subject ? email.subject : ''}</p>
        <p class="donate">
            Your donations keep us afloat. Please
            <a href="https://liberapay.com/diddledan/donate">
                <img alt="Donate using Liberapay"
                    src="https://liberapay.com/assets/widgets/donate.svg">
            </a>
            to continued maintenance of this project.
        </p>
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