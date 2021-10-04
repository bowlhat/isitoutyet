<script>
import {onMount} from 'svelte';
import {firebaseMessaging} from '../firebase.js';

export let twoButtonMode = false;
export let project;

function storageAvailable(type) {
    var storage = (window)[type],
        x = '__storage_test__';
    try {
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
let localStorageActive = false;

let subscribed = false;
let disabled = true;

$: disabled = !project && !!localStorageActive;
onMount(() => {
    localStorageActive = storageAvailable('localStorage');
    subscribed = localStorageActive && localStorage.getItem(project) === 'subscribed';
});

async function subscribe() {
    if (!project) {
        console.log('Cannot subscribe to push notifications because: No project.');
        return;
    }
    if (!localStorageActive) {
        console.log('Cannot subscribe to push notifications because: No localStorage.');
        return;
    }
    try {
        let messaging = firebaseMessaging();
        let permission = await Notification.requestPermission();
        if (permission === 'granted') {
            let token = await messaging.getToken();
            if (token) {
                fetch(`/api/push/register?project=${project}`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
            }
            subscribed = true;
            localStorage.setItem(project, 'subscribed');
        }
    } catch (e) {
        console.log('Error subscribing push notifications:', e);
    }
}

async function unsubscribe() {
    if (!project) {
        console.log('Cannot unsubscribe from push notifications because: No project.');
        return;
    }
    try {
        let messaging = firebaseMessaging();
        let token = await messaging.getToken();
        if (token) {
            fetch(`/api/push/unregister?project=${project}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
        }
        subscribed = false;
        if (localStorageActive) {
            localStorage.setItem(project, '');
        }
    }
    catch (e) {
        console.log('Erorr unsubscribing push notifications:', e);
    }
}

function clickHandler() {
    if (!subscribed) {
        return subscribe();
    }
    return unsubscribe();
}
</script>

<style>
    button {
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        background: var(--app-header-background-color);
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        padding: 1em 2em;
        margin: 0 auto;
        color: var(--app-dark-text-color);
        fill: var(--app-dark-text-color);
    }
    button:hover {
        color: #284;
        fill: #284;
    }
    button[data-subscribed="true"]:hover {
        color: #824;
        fill: #824;
    }
</style>

{#if twoButtonMode === true}
    <button on:click={subscribe} disabled={disabled}>
        <svg height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        Notify me of new releases!
    </button>
    <button on:click={unsubscribe} disabled={disabled}>
        <svg height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
        Stop notifying me
    </button>
{:else}
    <button on:click={clickHandler} disabled={disabled} data-subscribed={subscribed}>
        {#if subscribed}
            <svg height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Stop notifying me
        {:else}
            <svg height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Notify me of new releases!
        {/if}
    </button>
{/if}
