const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// ==========================================
// Process Command - Cloud Function
// ==========================================
exports.processCommand = functions.firestore
  .document('commands/{commandId}')
  .onCreate(async (snap, context) => {
    const command = snap.data();
    const commandId = context.params.commandId;

    console.log(`Processing command: ${commandId}`);
    console.log(`Department: ${command.department}`);
    console.log(`Command: ${command.command}`);

    try {
      // Update status to processing
      await snap.ref.update({ status: 'processing' });

      // Process based on department
      let result = null;
      
      switch (command.department) {
        case 'docs-officer':
          result = await processDocsCommand(command.command);
          break;
        case 'classroom-admin':
          result = await processClassroomCommand(command.command);
          break;
        case 'finance':
          result = await processFinanceCommand(command.command);
          break;
        case 'sports':
          result = await processSportsCommand(command.command);
          break;
        case 'health':
          result = await processHealthCommand(command.command);
          break;
        case 'creative':
          result = await processCreativeCommand(command.command);
          break;
        case 'researcher':
          result = await processResearchCommand(command.command);
          break;
        default:
          result = { message: 'ไม่พบฝ่ายที่ระบุ' };
      }

      // Update command with result
      await snap.ref.update({
        status: 'completed',
        result: result,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update corresponding task
      const tasksSnapshot = await db.collection('tasks')
        .where('commandId', '==', commandId)
        .limit(1)
        .get();

      if (!tasksSnapshot.empty) {
        await tasksSnapshot.docs[0].ref.update({
          status: 'completed',
          result: result,
          completedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      console.log(`Command ${commandId} completed successfully`);

    } catch (error) {
      console.error(`Error processing command ${commandId}:`, error);
      
      await snap.ref.update({
        status: 'error',
        error: error.message,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// ==========================================
// Department Processors
// ==========================================

async function processDocsCommand(command) {
  // TODO: Connect to AI API for document processing
  return {
    message: 'ฝ่ายเอกสารราชการกำลังดำเนินการ',
    department: 'docs-officer',
    command: command,
    timestamp: new Date().toISOString()
  };
}

async function processClassroomCommand(command) {
  return {
    message: 'ฝ่ายธุรการชั้นเรียนกำลังดำเนินการ',
    department: 'classroom-admin',
    command: command,
    timestamp: new Date().toISOString()
  };
}

async function processFinanceCommand(command) {
  return {
    message: 'ฝ่ายงบประมาณกำลังดำเนินการ',
    department: 'finance',
    command: command,
    timestamp: new Date().toISOString()
  };
}

async function processSportsCommand(command) {
  return {
    message: 'ฝ่ายกีฬากำลังดำเนินการ',
    department: 'sports',
    command: command,
    timestamp: new Date().toISOString()
  };
}

async function processHealthCommand(command) {
  return {
    message: 'ฝ่ายอนามัยกำลังดำเนินการ',
    department: 'health',
    command: command,
    timestamp: new Date().toISOString()
  };
}

async function processCreativeCommand(command) {
  return {
    message: 'ฝ่ายสร้างสรรค์กำลังดำเนินการ',
    department: 'creative',
    command: command,
    timestamp: new Date().toISOString()
  };
}

async function processResearchCommand(command) {
  return {
    message: 'ฝ่ายวิจัยกำลังดำเนินการ',
    department: 'researcher',
    command: command,
    timestamp: new Date().toISOString()
  };
}

// ==========================================
// Send Notification - Cloud Function
// ==========================================
exports.sendNotification = functions.firestore
  .document('notifications/{notifId}')
  .onCreate(async (snap, context) => {
    const notif = snap.data();
    
    console.log(`New notification: ${notif.title}`);
    
    // TODO: Send push notification to device
    
    return null;
  });

// ==========================================
// Check Deadlines - Scheduled Function
// ==========================================
exports.checkDeadlines = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('Checking deadlines...');
    
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    try {
      const snapshot = await db.collection('notifications')
        .where('dueDate', '<=', threeDaysLater)
        .where('dueDate', '>=', now)
        .where('notified', '==', false)
        .get();
      
      for (const doc of snapshot.docs) {
        const notif = doc.data();
        
        // Mark as notified
        await doc.ref.update({ notified: true });
        
        console.log(`Deadline reminder: ${notif.title}`);
      }
      
    } catch (error) {
      console.error('Error checking deadlines:', error);
    }
    
    return null;
  });
