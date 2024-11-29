const admin = require('firebase-admin');

// Inizializza Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

// Funzione Netlify per recuperare gli utenti
exports.handler = async (event, context) => {
  try {
    const users = await listAllUsers();
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Funzione per recuperare tutti gli utenti autenticati
async function listAllUsers(nextPageToken) {
  const users = [];
  const result = await admin.auth().listUsers(1000, nextPageToken); // Limite di 1000 utenti
  result.users.forEach((user) => {
    users.push({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Senza Nome',
    });
  });
  if (result.pageToken) {
    const nextUsers = await listAllUsers(result.pageToken);
    users.push(...nextUsers);
  }
  return users;
}
