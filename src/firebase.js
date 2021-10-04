export function firebase() {
    if (process.browser) {
        return window.firebase
    }
    else {
        const admin = require('firebase-admin')
        admin.initializeApp()
        return admin
    }
}

export function firebaseFirestore() {
    if (process.browser) {
        return window.db
    }
    else {
        const admin = firebase()
        return admin.firestore()
    }
}
export function firebaseMessaging() {
    if (process.browser) {
        return window.messaging
    }
    else {
        const admin = firebase()
        return admin.messaging()
    }
}
export function firebaseAuth() {
    if (process.browser) {
        return window.auth
    }
    else {
        const admin = firebase()
        return admin.auth()
    }
}