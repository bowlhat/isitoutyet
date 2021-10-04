import {firebaseConfig} from './firebase-config.js'

let initialized = false
export function firebase() {
    if (process.browser) {
        const admin = window.firebase
        if (initialized) {
            return admin
        }
        initialized = true
        return admin.initializeApp(firebaseConfig)
    }
    else {
        const admin = require('firebase-admin')
        if (initialized) {
            return admin
        }
        initialized = true
        return admin.initializeApp()
    }
}

export function firebaseFirestore() {
    const admin = firebase()
    return admin.firestore()
}
export function firebaseMessaging() {
    const admin = firebase()
    return admin.messaging()
}
export function firebaseAuth() {
    const admin = firebase()
    return admin.auth()
}