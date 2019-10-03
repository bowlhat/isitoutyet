<script>
    export let title;
    export let description;
    export let type;
</script>

<title>{title} | Is it out yet?</title>
<meta name="description" content={description}/>
<meta property="og:title" content="{title} | Is it out yet?"/>
<meta property="og:description" content={description}/>
<meta property="og:type" content={type}/>
<meta property="twitter:title" content="{title} | @askisitoutyet"/>
<meta property="twitter:description" content={description}/>
