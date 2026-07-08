import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const projectId = config.projectId;
const docPath = `projects/${projectId}/databases/ai-studio-1225608a-c678-451b-9991-125762803b2c/documents/config/mainPage`;

async function run() {
  const res = await fetch(`https://firestore.googleapis.com/v1/${docPath}`);
  const data = await res.json();
  const heroUrl = data.fields?.heroImageUrl?.stringValue;
  console.log('heroUrl length:', heroUrl ? heroUrl.length : 0);
  if (heroUrl && heroUrl.length < 100) {
     console.log('heroUrl:', heroUrl);
  }
}
run();
