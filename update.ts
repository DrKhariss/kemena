import { doc, setDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

async function update() {
  const ref = doc(db, 'config', 'mainPage');
  await setDoc(ref, {
    heroImageUrl: ''
  }, { merge: true });
  console.log('done');
  process.exit(0);
}
update();
