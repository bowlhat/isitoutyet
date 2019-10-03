import { writable } from 'svelte/store';

export const UserInfo = writable({
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