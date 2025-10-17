/**
 * VAPID Keys Generator - Einfache Verwendung
 * 
 * Führe diese Datei aus um VAPID Keys zu generieren:
 * node generateVapidKeys.js
 */

const { VapidKeyGenerator } = require('./myLibUI/Backend/vapidKeyGenerator.js');

async function generateKeys() {
  try {
    console.log('🔑 Generiere VAPID Keys...\n');
    
    // 1. Keys generieren
    const keys = VapidKeyGenerator.generateKeys("mailto:admin@yourapp.com");
    
    // 2. Keys validieren
    const isValid = VapidKeyGenerator.validateKeys(keys.publicKey, keys.privateKey);
    
    if (isValid) {
      console.log('\n✅ VAPID Keys erfolgreich generiert!');
      console.log('\n📋 Kopiere diese Keys in deine Konfiguration:');
      console.log('\n🔑 PUBLIC KEY (für Frontend):');
      console.log(keys.publicKey);
      console.log('\n🔐 PRIVATE KEY (für Backend):');
      console.log(keys.privateKey);
      
      // 3. Keys speichern
      VapidKeyGenerator.saveKeysToFile(keys, 'vapid-keys.json');
      
      console.log('\n💾 Keys wurden in vapid-keys.json gespeichert');
    } else {
      console.log('❌ VAPID Keys sind ungültig');
    }
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
  }
}

// Führe die Funktion aus
generateKeys();
