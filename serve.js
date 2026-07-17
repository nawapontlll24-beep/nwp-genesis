const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { MsEdgeTTS } = require('msedge-tts');

const PORT = process.env.PORT || 8888;
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg'
};

// ====== Microsoft Edge Neural TTS ======
// th-TH-PremwadeeNeural = ชายไทย วัย 30 สุขุม นุ่มนวล
const VOICE = 'th-TH-PremwadeeNeural';
const OUTPUT_FORMAT = 'audio-24khz-96kbitrate-mono-mp3';

async function generateTTS(text) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT);
  const result = tts.toStream(text);
  return new Promise((resolve, reject) => {
    const chunks = [];
    result.audioStream.on('data', (chunk) => chunks.push(chunk));
    result.audioStream.on('end', () => resolve(Buffer.concat(chunks)));
    result.audioStream.on('error', (err) => reject(err));
  });
}

// Cache
const ttsCache = new Map();

async function getCachedTTS(text) {
  const key = text.substring(0, 100);
  if (ttsCache.has(key)) return ttsCache.get(key);
  const audio = await generateTTS(text);
  if (ttsCache.size > 50) ttsCache.delete(ttsCache.keys().next().value);
  ttsCache.set(key, audio);
  return audio;
}

http.createServer(async function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var pathname = parsedUrl.pathname;

  // ====== API: TTS ======
  if (pathname === '/api/tts') {
    var text = parsedUrl.query.text || '';
    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('{"error":"No text"}');
      return;
    }
    if (text.length > 500) text = text.substring(0, 500);

    try {
      const audioBuffer = await getCachedTTS(text);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(audioBuffer);
    } catch (err) {
      console.error('TTS Error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ====== Static Files ======
  var urlPath = pathname.split('?')[0];
  var filePath = path.join(PUBLIC, urlPath === '/' ? 'index.html' : urlPath);
  fs.readFile(filePath, function(err, data) {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    var ext = path.extname(filePath);
    var headers = { 'Content-Type': MIME[ext] || 'text/plain' };
    if (ext === '.html' || ext === '.js' || ext === '.css') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(PORT, function() {
  console.log('NWP Genesis running at http://localhost:' + PORT);
  console.log('Voice: ' + VOICE);
});
