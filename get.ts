import { doc, getDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

async function get() {
  const ref = doc(db, 'config', 'mainPage');
  const snap = await getDoc(ref);
  console.log('length:', snap.data()?.heroImageUrl?.length);
  process.exit(0);
}
get();
