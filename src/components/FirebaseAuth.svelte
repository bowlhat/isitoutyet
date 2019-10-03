<script>
    import {onMount, setContext} from 'svelte';
    import {Authentication} from './Authentication';
	import {firebase, firebaseMessaging, firebaseAuth} from '../firebase';
    import {UserInfo} from '../stores.js';

    const dev = process.env.NODE_ENV === 'development';
	let fcm, auth, ui;
	let uiConfig;

    let showLogin = false;

    const startSigninFlow = () => {
        if (ui) {
            showLogin = true;
            ui.reset();
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }
    const signOut = () => {
        if (auth && $UserInfo.isLoggedIn) {
            auth.signOut();
        }
    }
    setContext(Authentication, {
        startSigninFlow: () => startSigninFlow(),
        signOut: () => signOut(),
    })

    onMount(() => {
        auth = firebaseAuth();
		const fb = firebase();

		uiConfig = {
			signInSuccessUrl: (dev) ? 'http://localhost:5000/': 'https://isitoutyet.info/',
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				fb.auth.GoogleAuthProvider.PROVIDER_ID,
				fb.auth.FacebookAuthProvider.PROVIDER_ID,
				fb.auth.TwitterAuthProvider.PROVIDER_ID,
				fb.auth.GithubAuthProvider.PROVIDER_ID,
				fb.auth.EmailAuthProvider.PROVIDER_ID,
				fb.auth.PhoneAuthProvider.PROVIDER_ID,
				firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
			],

			tosUrl: 'https://isitoutyet.info/terms',
			privacyPolicyUrl: 'https://isitoutyet.info/privacy',
		}

		ui = new firebaseui.auth.AuthUI(auth);
		if (ui.isPendingRedirect()) {
			showLogin = true;
			ui.start('#firebaseui-auth-container', uiConfig);
		}

		auth.onAuthStateChanged(user => {
			showLogin = false;
			if (user) {
				// User is signed in.
				user.getIdToken().then(function(accessToken) {
					UserInfo.set({
                        isLoggedIn: true,
                        accessToken,
                        displayName: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        photoURL: user.photoURL,
                        uid: user.uid,
                        phoneNumber: user.phoneNumber,
                        provderData: user.providerData,
                    });
				});
			} else {
				UserInfo.set({
                    isLoggedIn: false,
                    accessToken: '',
                    displayName: '',
                    email: '',
                    emailVerified: false,
                    photoUrl: '',
                    uid: '',
                    phoneNumber: '',
                    providerData: null,
                });
			}
        }, function(error) {
          console.log(error);
        });
    });
</script>

<style>
	#firebaseui-auth-container {
		align-items: center;
		display: flex;
		overflow: auto;
		position: fixed;
		background: rgba(0,0,0,0.6);
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	:global(body) .firebaseui-page-provider-sign-in {
		background-color: #fff;
		border-radius: 1rem;
	}

	.cancel-login {
		background: white;
		border-radius: 1rem;
		padding: 1rem;
		position: fixed;
		right: 1rem;
		top: 1rem;
	}

	.login, .logout {
		display: flex;
		justify-content: flex-end;
	}
	.login a {
		text-indent: -200vw;
		background-image: url('../pi.svg');
		width: 1rem;
		height: 1rem;
		display: inline-block;
        opacity: 0.1;
	}
    .login a:hover,
    .login a:active {
        opacity: 1;
    }

    .praetorians {
        padding: 0 2rem 2rem;
    }
</style>

<slot></slot>

<div id="firebaseui-auth-container"
    style={showLogin ? '' : 'display: none;'}
    on:click={(e) => {
        if (e.target.id === 'firebaseui-auth-container') {
            showLogin = false
        }
    }}>
</div>

<div class="praetorians">
    {#if showLogin}
        <a class="cancel-login" href="javascript:"
            on:click={() => showLogin = false}>Cancel login</a>
    {/if}

    {#if $UserInfo.isLoggedIn}
        <div class="logout">
            <a on:click={signOut} href='javascript:'>Logout</a>
        </div>
    {:else}
        <div class="login">
            <a on:click={startSigninFlow} href='javascript:'>Login</a>
        </div>
    {/if}
</div>