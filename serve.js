const http = require('http');
const https = require('https');
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

// ====== DuckDuckGo Web Search ======
function searchDuckDuckGo(query) {
  return new Promise(function(resolve, reject) {
    var searchUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    var options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    };

    https.get(searchUrl, options, function(response) {
      var body = '';
      response.on('data', function(chunk) { body += chunk; });
      response.on('end', function() {
        var results = parseSearchResults(body);
        resolve({ query: query, results: results });
      });
    }).on('error', function(err) {
      reject(err);
    }).on('timeout', function() {
      reject(new Error('Search timeout'));
    });
  });
}

function parseSearchResults(html) {
  var results = [];
  var blocks = html.split('result__body">');
  for (var i = 1; i < Math.min(blocks.length, 12); i++) {
    var block = blocks[i];
    if (block.indexOf('badge--ad') !== -1) continue;
    var titleMatch = block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
    var snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    var urlMatch = block.match(/class="result__url"[^>]*>\s*([\s\S]*?)\s*<\/a>/);
    if (titleMatch) {
      var title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      var snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      var resultUrl = '';
      if (urlMatch) {
        resultUrl = urlMatch[1].replace(/<[^>]+>/g, '').trim();
      }
      if (!resultUrl) {
        var hrefMatch = block.match(/class="result__a"[^>]*href="([^"]*)"/);
        if (hrefMatch) {
          var uddg = hrefMatch[1].match(/uddg=([^&]+)/);
          if (uddg) {
            try { resultUrl = decodeURIComponent(uddg[1]); } catch(e) { resultUrl = ''; }
          }
        }
      }
      if (title) {
        results.push({ title: title, snippet: snippet, url: resultUrl });
      }
    }
  }
  return results;
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

  // ====== API: DuckDuckGo Web Search ======
  if (pathname === '/api/search') {
    var query = parsedUrl.query.q || '';
    if (!query) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end('{"error":"No query"}');
      return;
    }
    try {
      var results = await searchDuckDuckGo(query);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(results));
    } catch (err) {
      console.error('Search Error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message, results: [] }));
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
