import { collection, doc, setDoc, getDocs, orderBy, query, limit as firestoreLimit, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Player } from './types';
import { v4 as uuidv4 } from 'uuid';

export const playersCollection = 'players';

/**
 * Saves a completed player's result to Firestore.
 * Returns the generated Firestore document ID.
 */
export async function savePlayerToFirestore(player: Player): Promise<string> {
    const docId = player.id || uuidv4();

    // Create a clean payload without circular references or functions
    const payload = {
        id: docId,
        name: player.name,
        level: player.level,
        companyName: player.companyName,
        archetypeId: player.archetype || null,
        scores: {
            TV: player.scores.TV,
            OR: player.scores.OR,
            IV: player.scores.IV,
            HR: player.scores.HR,
        },
        choices: player.choices,
        questionSet: player.questionSet,
        timestamp: serverTimestamp(),
    };

    await setDoc(doc(db, playersCollection, docId), payload);
    return docId;
}

/**
 * Fetches all players from Firestore to render in the Analytics Dashboard.
 */
export async function getAllPlayersFromFirestore(): Promise<any[]> {
    try {
        const q = query(collection(db, playersCollection), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching players from Firestore:', error);
        return [];
    }
}

/**
 * Fetches the top N players from Firestore based on TV score.
 */
export async function getLeaderboardFromFirestore(limitCount: number = 15): Promise<any[]> {
    try {
        const q = query(collection(db, playersCollection), orderBy('scores.TV', 'desc'), firestoreLimit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching leaderboard from Firestore:', error);
        return [];
    }
}
