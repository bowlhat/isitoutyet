export interface Email {
    received?: firebase.firestore.Timestamp;
    subject?: string;
    body?: string;
}