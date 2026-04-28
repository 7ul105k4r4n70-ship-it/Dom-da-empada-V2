import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, setDoc, Timestamp, orderBy, limit } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
  orderBy,
  limit
};
export type { FirebaseUser };

export async function seedInitialData() {
  const usersRef = collection(db, 'users');
  const ordersRef = collection(db, 'orders');
  
  // Check if already seeded
  const usersSnap = await getDocFromServer(doc(db, 'test', 'seeded_v4'));
  if (usersSnap.exists()) return;

  // Seed Users
  const sampleUsers = [
    { name: 'Ricardo Mendes', email: 'ricardo.mendes@domdaempada.com', role: 'admin', region: 'Global', status: 'Ativo', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop' },
    { name: 'Mariana Silva', email: 'mariana.silva@domdaempada.com', role: 'coordenador', region: 'Salvador', status: 'Ativo', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' }
  ];

  for (const u of sampleUsers) {
    await addDoc(usersRef, u);
  }

  // Seed Orders
  const sampleOrders = [
    { 
      id: 'REC-9012', 
      pointId: 'P1', 
      pointName: 'Boa Viagem Store', 
      units: 450, 
      status: 'COMPLETED', 
      type: 'REGULAR', 
      region: 'Recife', 
      timestamp: Timestamp.now(), 
      lat: -8.1267, 
      lng: -34.9011,
      statusHistory: [
        { status: 'IDLE', timestamp: new Date(Date.now() - 86400000).toISOString(), userName: 'Sistema', userId: 'system' },
        { status: 'AWAITING LOGISTICS', timestamp: new Date(Date.now() - 43200000).toISOString(), userName: 'Mariana Silva', userId: 'user1' },
        { status: 'COMPLETED', timestamp: new Date().toISOString(), userName: 'Ricardo Mendes', userId: 'user2' }
      ]
    },
    { 
      id: 'REC-8994', 
      pointId: 'P2', 
      pointName: 'Casa Forte Hub', 
      units: 1200, 
      status: 'IN PROGRESS', 
      type: 'EXTRA DELIVERY', 
      region: 'Recife', 
      timestamp: Timestamp.now(), 
      lat: -8.0347, 
      lng: -34.9197,
      statusHistory: [
        { status: 'IDLE', timestamp: new Date(Date.now() - 21600000).toISOString(), userName: 'Sistema', userId: 'system' },
        { status: 'IN PROGRESS', timestamp: new Date().toISOString(), userName: 'Mariana Silva', userId: 'user1' }
      ]
    }
  ];

  for (const o of sampleOrders) {
    await addDoc(ordersRef, o);
  }

  // Seed Notifications
  const notificationsRef = collection(db, 'notifications');
  const currentUser = auth.currentUser;
  
  if (currentUser) {
    const sampleNotifications = [
      {
        title: 'Estoque Crítico',
        message: 'O estoque de Empada de Frango no Hub Recife está abaixo de 15%. Solicite reposição.',
        type: 'stock',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        read: false,
        userId: currentUser.uid,
        link: '/inventory'
      },
      {
        title: 'Pedido REC-9012 Concluído',
        message: 'O pedido da Boa Viagem Store foi entregue com sucesso por Ricardo Mendes.',
        type: 'order',
        severity: 'info',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        userId: currentUser.uid,
        link: '/orders'
      },
      {
        title: 'Conflito na Agenda',
        message: 'O motorista Ricardo Mendes possui dois agendamentos para o mesmo horário amanhã.',
        type: 'schedule',
        severity: 'warning',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        userId: currentUser.uid,
        link: '/schedule'
      }
    ];

    for (const n of sampleNotifications) {
      await addDoc(notificationsRef, n);
    }
  }

  await setDoc(doc(db, 'test', 'seeded_v4'), { done: true });
}

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Error handling helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
