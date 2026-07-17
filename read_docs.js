const mammoth = require('C:\\Users\\Spcomputech\\Desktop\\NWP-Genesis\\node_modules\\mammoth');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Spcomputech\\Desktop\\NWP-Genesis\\ตัวอย่างเอกสาร';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.docx'));

(async () => {
  for (const file of files) {
    const filePath = path.join(dir, file);
    console.log('='.repeat(80));
    console.log('FILE: ' + file);
    console.log('='.repeat(80));
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      console.log(result.value);
    } catch (err) {
      console.log('ERROR: ' + err.message);
    }
    console.log('\n');
  }
})();
