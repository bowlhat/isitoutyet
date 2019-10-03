export function firebase() {
    if (process.browser) {
        return window.firebase
    }
    else {
        const admin = require('firebase-admin')
        if (admin.apps.length == 0) {
            admin.initializeApp()
            return admin
        }
        else {
            return admin.apps[0]
        }
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