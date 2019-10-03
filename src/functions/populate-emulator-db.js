import * as fs from "fs"
import * as path from "path"

const basePath = path.join(__dirname, '..','..','..', 'src','functions', 'test-data')

function getDocs(dir, parentCollection) {
    let docs = fs.readdirSync(dir)
    for (let docFileName of docs) {
        let docFilePath = path.join(dir, docFileName)
        let indexFile = path.join(docFilePath, 'index.json')
        let stat = fs.statSync(docFilePath)
        if (docFileName.endsWith('.json') && stat.isFile()) {
            let docName = path.basename(docFileName, '.json')
            let doc = parentCollection.doc(docName)
            doc.set(JSON.parse(fs.readFileSync(docFilePath)))
            console.log('created firestore document: ' + docName)
        } else if (
            stat.isDirectory() &&
            fs.statSync(indexFile).isFile()
        ) {
            let doc = parentCollection.doc(docFileName)
            doc.set(JSON.parse(fs.readFileSync(indexFile)))
            let collections = fs.readdirSync(docFilePath)
            for (let collectionName of collections) {
                let collectionPath = path.join(docFilePath, collectionName)
                if (fs.statSync(collectionPath).isDirectory()) {
                    let newParent = doc.collection(collectionName)
                    console.log('starting population of firestore collection: ' + collectionName)
                    getDocs(collectionPath, newParent);
                }
            }
        }
    }
}

/**
 * 
 * @param {FirebaseFirestore.Firestore} db 
 */
export default function(db) {
    let testData = fs.readdirSync(basePath)
    for (let collectionName of testData) {
        let dirPath = path.join(basePath, collectionName)
        if (fs.statSync(dirPath).isDirectory()) {
            console.log('Populating firestore collection: ', collectionName)
            let collection = db.collection(collectionName)
            getDocs(dirPath, collection);
        }
    }
}