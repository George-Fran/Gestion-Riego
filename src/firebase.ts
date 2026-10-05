import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  query,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { SavedRecord } from './types';

const app = initializeApp(firebaseConfig);

// CRITICAL: Connect using specified firestoreDatabaseId from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test initial connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Check Firebase network connection:', error);
    }
  }
}
testConnection();

const REGISTROS_COLLECTION = 'registros';

/**
 * Real-time listener for Firestore records.
 * Automatically synchronizes records across all devices (phones, laptops, tablets).
 */
export function subscribeToRecords(
  callback: (records: SavedRecord[]) => void
) {
  const recordsQuery = query(
    collection(db, REGISTROS_COLLECTION),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    recordsQuery,
    (snapshot) => {
      const records: SavedRecord[] = [];
      snapshot.forEach((docSnapshot) => {
        records.push(docSnapshot.data() as SavedRecord);
      });

      callback(records);
    },
    (error) => {
      console.error('Error in Firestore real-time listener:', error);
    }
  );
}

/**
 * Save or update a record in Firestore Cloud Database.
 */
export async function saveRecordToCloud(record: SavedRecord): Promise<void> {
  const docRef = doc(db, REGISTROS_COLLECTION, record.id);
  await setDoc(docRef, record, { merge: true });
}

/**
 * Delete a record from Firestore Cloud Database.
 */
export async function deleteRecordFromCloud(id: string): Promise<void> {
  const docRef = doc(db, REGISTROS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Delete all records from Firestore Cloud Database.
 */
export async function clearAllRecordsFromCloud(
  records: SavedRecord[]
): Promise<void> {
  const deletePromises = records.map((r) =>
    deleteDoc(doc(db, REGISTROS_COLLECTION, r.id))
  );
  await Promise.all(deletePromises);
}
