// ==========================================
// GENESIS - Chat Interface v2
// ระบบแชท + ควบคุมทุกฟีเจอร์
// ==========================================

var attachedFiles = [];
var recognition = null;
var isProcessing = false;

// ==========================================
// Matrix Rain
// ==========================================
function initMatrixRain() {
  var canvas = document.createElement('canvas');
  var container = document.getElementById('matrix-rain');
  if (!container) return;
  container.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var cols = Math.floor(canvas.width / 14);
  var drops = [];
  for (var i = 0; i < cols; i++) drops[i] = 1;
  function draw() {
    ctx.fillStyle = 'rgba(5, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = '12px monospace';
    for (var i = 0; i < drops.length; i++) {
      ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), i * 14, drops[i] * 14);
      if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 50);
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 14);
    drops = [];
    for (var i = 0; i < cols; i++) drops[i] = 1;
  });
}

// ==========================================
// Voice Output (Thai TTS)
// ==========================================
var voiceEnabled = true;

var currentTtsAudio = null;

function loadVoices() {
  try { window.speechSynthesis.getVoices(); } catch(e) {}
}

function speak(text) {
  if (!voiceEnabled) return;
  var clean = text.replace(/[\n\r]/g, ' ').replace(/[#\-\*\"\'\`\~\^\[\]\{\}\<\>]/g, '').replace(/[•✅📄📚🔍🏃💰📊💡❌🟢🎉]/g, '').trim();
  if (clean.length > 400) clean = clean.substring(0, 400) + '...';

  // หยุดเสียงเดิม
  if (currentTtsAudio) { currentTtsAudio.pause(); currentTtsAudio = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  // วิธี 1: ลองใช้ Web Speech API กับเสียงไทย
  if (window.speechSynthesis) {
    var voices = window.speechSynthesis.getVoices();
    var thaiVoice = null;
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang && voices[i].lang.indexOf('th') === 0) {
        thaiVoice = voices[i];
        break;
      }
    }
    if (thaiVoice) {
      var utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'th-TH';
      utter.voice = thaiVoice;
      utter.rate = 0.9;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      window.speechSynthesis.speak(utter);
      return;
    }
  }

  // วิธี 2: ใช้ Server-side TTS (Windows SAPI Thai)
  speakViaServer(clean);
}

function speakViaServer(text) {
  var url = '/api/tts?text=' + encodeURIComponent(text);
  currentTtsAudio = new Audio(url);
  currentTtsAudio.volume = 1.0;
  currentTtsAudio.onended = function() { currentTtsAudio = null; };
  currentTtsAudio.onerror = function() {
    currentTtsAudio = null;
    // Fallback: ลอง Web Speech API ปกติ
    if (window.speechSynthesis) {
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'th-TH';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };
  currentTtsAudio.play().catch(function() {
    currentTtsAudio = null;
    if (window.speechSynthesis) {
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'th-TH';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  });
}

function testVoice() {
  try {
    speak('สวัสดีครับคุณครู ผม Genesis พร้อมรับใช้ครับ');
  } catch(e) {}
}

function showVoices() {
  if (!window.speechSynthesis) { alert('เบราว์เซอร์นี้ไม่รองรับเสียงพูด'); return; }
  var voices = window.speechSynthesis.getVoices();
  var thaiList = voices.filter(function(v) { return v.lang && v.lang.indexOf('th') === 0; });
  var msg = 'เสียงทั้งหมด: ' + voices.length + '\n';
  msg += 'เสียงไทย: ' + thaiList.length + '\n\n';
  thaiList.forEach(function(v, i) { msg += (i+1) + '. ' + v.name + ' (' + v.lang + ')\n'; });
  if (thaiList.length === 0) msg += 'ไม่พบเสียงไทยในระบบ\nลองใช้ Server TTS แทน';
  alert(msg);
}

function toggleVoiceOutput() {
  voiceEnabled = !voiceEnabled;
  var icon = document.getElementById('voice-icon');
  if (icon) icon.className = voiceEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
  showToast(voiceEnabled ? 'เปิดเสียงแล้ว' : 'ปิดเสียงแล้ว', 'info');
}

// ==========================================
// Voice Input (STT)
// ==========================================
function initVoice() {
  // โหลดเสียงทั้งหมด
  loadVoices();
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Voice Recognition (STT)
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    var btn = document.getElementById('btn-voice');
    if (btn) btn.style.display = 'none';
  } else {
    recognition = new SR();
    recognition.lang = 'th-TH';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = function(e) {
      var text = e.results[0][0].transcript;
      document.getElementById('chat-input').value = text;
      document.getElementById('btn-voice').classList.remove('recording');
      sendMessage();
    };
    recognition.onend = function() { document.getElementById('btn-voice').classList.remove('recording'); };
    recognition.onerror = function(e) {
      document.getElementById('btn-voice').classList.remove('recording');
      if (e.error !== 'no-speech') showToast('ไม่ได้ยินเสียงครับ ลองใหม่', 'error');
    };
  }
}

function toggleVoice() {
  if (!recognition) return;
  var btn = document.getElementById('btn-voice');
  if (btn.classList.contains('recording')) { recognition.stop(); }
  else { recognition.start(); btn.classList.add('recording'); showToast('กำลังฟัง... พูดเลย', 'info'); }
}

// ==========================================
// Chat Messages
// ==========================================
function addMessage(text, role, opts) {
  opts = opts || {};
  var container = document.getElementById('chat-messages');
  if (!container) return;

  var msg = document.createElement('div');
  msg.className = 'chat-msg ' + role;

  if (role === 'ai') {
    var avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = '<div class="mini-core"><span>G</span></div>';
    msg.appendChild(avatar);
  }

  var bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  var content = document.createElement('div');
  content.className = 'msg-text';
  content.textContent = text;
  bubble.appendChild(content);

  // Department badge
  if (opts.dept) {
    var badge = document.createElement('div');
    badge.className = 'dept-badge';
    badge.innerHTML = '<i class="' + (opts.deptIcon || 'fas fa-building') + '"></i> ' + opts.dept;
    bubble.appendChild(badge);
  }

  // Download button
  if (opts.canDownload && opts.docData) {
    var dlBtn = document.createElement('button');
    dlBtn.className = 'download-btn';
    dlBtn.innerHTML = '<i class="fas fa-download"></i> ดาวน์โหลด .docx';
    dlBtn.onclick = function() { createAndDownload(opts.docData); };
    bubble.appendChild(dlBtn);
  }

  // PDF button
  if (opts.showPdf) {
    var pdfBtn = document.createElement('button');
    pdfBtn.className = 'download-btn pdf';
    pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> เปิด PDF';
    pdfBtn.onclick = function() {
      DocGenerator.generatePDF(text, opts.title || 'เอกสาร');
    };
    bubble.appendChild(pdfBtn);
  }

  // Excel button
  if (opts.showExcel) {
    var excelBtn = document.createElement('button');
    excelBtn.className = 'download-btn excel';
    excelBtn.innerHTML = '<i class="fas fa-file-excel"></i> สร้าง Excel';
    excelBtn.onclick = function() {
      if (opts.excelData) DocGenerator.generateExcel(opts.excelData, opts.title || 'ข้อมูล');
    };
    bubble.appendChild(excelBtn);
  }

  // Thinking steps
  if (opts.thinking) {
    var thinkEl = document.createElement('div');
    thinkEl.className = 'msg-thinking';
    thinkEl.innerHTML = opts.thinking;
    bubble.appendChild(thinkEl);
  }

  if (opts.isFile) {
    bubble.classList.add('file-msg');
  }

  var time = document.createElement('div');
  time.className = 'msg-time';
  var now = new Date();
  time.textContent = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
  bubble.appendChild(time);

  msg.appendChild(bubble);
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;

  return msg;
}

function addThinking() {
  var container = document.getElementById('chat-messages');
  if (!container) return null;
  var msg = document.createElement('div');
  msg.className = 'chat-msg ai';
  msg.id = 'thinking-msg';

  var avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = '<div class="mini-core thinking"><span>G</span></div>';
  msg.appendChild(avatar);

  var bubble = document.createElement('div');
  bubble.className = 'msg-bubble thinking';
  bubble.innerHTML = '<div class="thinking-dots"><span></span><span></span><span></span></div>';
  msg.appendChild(bubble);

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function removeThinking() {
  var el = document.getElementById('thinking-msg');
  if (el) el.remove();
}

function showThinkingSteps(steps) {
  var container = document.getElementById('chat-messages');
  if (!container) return;
  removeThinking();

  var msg = document.createElement('div');
  msg.className = 'chat-msg ai';
  msg.id = 'thinking-msg';

  var avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = '<div class="mini-core thinking"><span>G</span></div>';
  msg.appendChild(avatar);

  var bubble = document.createElement('div');
  bubble.className = 'msg-bubble thinking-bubble';

  var stepsHtml = '<div class="thinking-steps">';
  steps.forEach(function(s, i) {
    var icon = s.icon || 'fas fa-cog';
    stepsHtml += '<div class="step step-' + i + '"><i class="' + icon + ' fa-spin"></i> <strong>' + s.dept + ':</strong> ' + s.action + '</div>';
  });
  stepsHtml += '</div>';
  bubble.innerHTML = stepsHtml;
  msg.appendChild(bubble);

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;

  steps.forEach(function(s, i) {
    setTimeout(function() {
      var stepEl = bubble.querySelector('.step-' + i);
      if (stepEl) {
        stepEl.classList.add('active');
        stepEl.querySelector('i').className = 'fas fa-check-circle';
      }
    }, (i + 1) * 600);
  });

  return msg;
}

// ==========================================
// Send Message - Main Logic
// ==========================================
function sendMessage() {
  if (isProcessing) return;
  var input = document.getElementById('chat-input');
  if (!input) return;
  var text = input.value.trim();
  if (!text && attachedFiles.length === 0) return;

  isProcessing = true;
  input.value = '';
  input.style.height = 'auto';

  if (text) addMessage(text, 'user');
  if (attachedFiles.length > 0) {
    var fileNames = attachedFiles.map(function(f) { return f.name; }).join(', ');
    addMessage('แนบไฟล์: ' + fileNames, 'user', { isFile: true });
  }

  if (text) {
    showThinkingSteps([{ dept: 'Genesis', action: 'กำลังวิเคราะห์ "' + text.substring(0, 30) + '..."', icon: 'fas fa-brain' }]);

    // Safety timeout: reset stuck state after 10 seconds
    var safetyTimer = setTimeout(function() {
      if (isProcessing) {
        console.warn('Safety timeout: isProcessing was stuck, resetting');
        removeThinking();
        addMessage('ขออภัยครับ ระบบประมวลผลช้าเกินไป กรุณาลองพิมพ์ใหม่อีกครั้ง', 'ai');
        isProcessing = false;
      }
    }, 10000);

    try {
      AIBrain.process(text, {
        onThinking: function(steps) {
          showThinkingSteps(steps);
        }
      }).then(function(result) {
        setTimeout(function() {
          clearTimeout(safetyTimer);
          removeThinking();

          var deptName = '';
          var deptIcon = 'fas fa-building';
          if (result && result.source) {
            deptName = result.source;
            var dept = Departments.getSub(result.source) || (result.deptId ? Departments.getSub(result.deptId) : null);
            if (dept) { deptName = dept.name; deptIcon = dept.icon; }
          }

          addMessage(result.text, 'ai', {
            dept: deptName,
            deptIcon: deptIcon,
            canDownload: result.canDownload,
            docData: result.docData,
            showPdf: result.type === 'document_created',
            title: result.docData ? result.docData.title : 'เอกสาร'
          });

          try { speak(result.text.substring(0, 200)); } catch(e) {}

          var sub = document.getElementById('header-subtitle');
          if (sub) sub.textContent = 'ออนไลน์ - ' + (result.intent || 'ready');

          if (attachedFiles.length > 0) {
            DataStore.addAttachment(text, attachedFiles);
            attachedFiles = [];
            renderAttachedFiles();
          }

          isProcessing = false;
        }, 500);
      }).catch(function(err) {
        clearTimeout(safetyTimer);
        console.error('Process error:', err);
        removeThinking();
        addMessage('ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่', 'ai');
        isProcessing = false;
      });
    } catch(e) {
      clearTimeout(safetyTimer);
      console.error('Process threw error:', e);
      removeThinking();
      addMessage('ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่', 'ai');
      isProcessing = false;
    }
  } else {
    setTimeout(function() {
      removeThinking();
      DataStore.addAttachment('(แนบไฟล์)', attachedFiles);
      attachedFiles = [];
      renderAttachedFiles();
      addMessage('บันทึกไฟล์แนบเรียบร้อยครับ', 'ai');
      isProcessing = false;
    }, 800);
  }
}

// ==========================================
// Create Document & Download
// ==========================================
function createAndDownload(docData) {
  var thinkMsg = addThinking();
  setTimeout(function() {
    removeThinking();
    DocGenerator.processCommand(docData.deptId || 'general', docData.content).then(function(result) {
      addMessage('✅ ดาวน์โหลดเสร็จแล้วครับ', 'ai');
      showToast('ดาวน์โหลดสำเร็จ', 'success');
    }).catch(function(e) {
      addMessage('❌ เกิดข้อผิดพลาด: ' + e.message, 'ai');
    });
  }, 500);
}

// ==========================================
// File Upload
// ==========================================
function handleFileSelect(e) {
  Array.from(e.target.files).forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(ev) {
      attachedFiles.push({
        name: file.name,
        type: file.type,
        data: ev.target.result,
        size: file.size,
        isImage: file.type.startsWith('image/')
      });
      renderAttachedFiles();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}

function renderAttachedFiles() {
  var container = document.getElementById('attached-files');
  if (!container) return;
  if (attachedFiles.length === 0) { container.innerHTML = ''; return; }
  var html = '';
  attachedFiles.forEach(function(f, i) {
    var preview = f.isImage ? '<img src="' + f.data + '">' : '<i class="fas fa-file"></i>';
    html += '<div class="attached-file">' + preview +
      '<span>' + f.name.substring(0, 15) + '</span>' +
      '<span class="remove-file" onclick="removeFile(' + i + ')"><i class="fas fa-times"></i></span></div>';
  });
  container.innerHTML = html;
}

function removeFile(i) {
  attachedFiles.splice(i, 1);
  renderAttachedFiles();
}

// ==========================================
// Tab Navigation
// ==========================================
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  var tab = document.getElementById('tab-' + tabName);
  if (tab) tab.classList.add('active');
  var btn = document.querySelector('[data-tab="' + tabName + '"]');
  if (btn) btn.classList.add('active');

  var chatMain = document.querySelector('.chat-main');
  var quickCmds = document.querySelector('.quick-commands');
  if (chatMain) chatMain.style.display = (tabName === 'chat') ? '' : 'none';
  if (quickCmds) quickCmds.style.display = (tabName === 'chat') ? '' : 'none';

  if (tabName === 'docs') loadDocuments();
  if (tabName === 'agents') loadAgents();
  if (tabName === 'dashboard') loadDashboard();
}

// ==========================================
// Documents Tab
// ==========================================
function downloadDoc(index) {
  var docs = DataStore.getDocuments();
  if (index >= docs.length) return;
  var doc = docs[index];
  if (!doc.url || doc.url.indexOf('data:') === -1) {
    showToast('ไม่มีไฟล์ให้ดาวน์โหลด', 'error');
    return;
  }
  var parts = doc.url.split(',');
  var mime = parts[0].match(/:(.*?);/)[1];
  var bstr = atob(parts[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  saveAs(new Blob([u8arr], { type: mime }), doc.name);
  showToast('ดาวน์โหลด ' + doc.name, 'success');
}

function loadDocuments() {
  var container = document.getElementById('docs-list');
  if (!container) return;
  var docs = DataStore.getDocuments();
  if (docs.length === 0) {
    container.innerHTML = '<p class="empty-msg">ยังไม่มีเอกสาร<br>สั่งงานในแชทได้เลย</p>';
    return;
  }
  var html = '';
  docs.forEach(function(doc, i) {
    var time = doc.createdAt ? formatTime(new Date(doc.createdAt)) : '';
    var icon = 'fa-file-word';
    if (doc.type === 'official_letter' || doc.type === 'หนังสือราชการ') icon = 'fa-envelope-open-text';
    else if (doc.type === 'memo' || doc.type === 'บันทึกข้อความ') icon = 'fa-sticky-note';
    else if (doc.type === 'report' || doc.type === 'รายงาน') icon = 'fa-chart-bar';
    else if (doc.type === 'teaching_plan' || doc.type === 'แผนการสอน') icon = 'fa-chalkboard-teacher';
    else if (doc.type === 'budget_request' || doc.type === 'งบประมาณ') icon = 'fa-coins';
    else if (doc.type === 'order' || doc.type === 'คำสั่ง') icon = 'fa-gavel';
    else if (doc.type === 'attachment' || doc.type === 'ไฟล์แนบ') icon = 'fa-paperclip';

    var deptTag = doc.dept ? '<span class="doc-dept">' + doc.dept + '</span>' : '';
    html += '<div class="doc-item">' +
      '<div class="doc-icon"><i class="fas ' + icon + '"></i></div>' +
      '<div class="doc-info"><div class="doc-name">' + escapeHtml(doc.title || doc.name) + '</div>' +
      '<div class="doc-date">' + time + ' ' + deptTag + '</div></div>' +
      '<button class="doc-download" onclick="downloadDoc(' + i + ')"><i class="fas fa-download"></i></button></div>';
  });
  container.innerHTML = html;
}

// ==========================================
// Agents Tab - แสดงแผนกทั้งหมด
// ==========================================
function loadAgents() {
  var container = document.getElementById('agent-grid');
  if (!container) return;

  var html = '<div class="dept-org">';
  var mainDepts = ['general', 'academic', 'personnel', 'budget'];

  mainDepts.forEach(function(mainKey) {
    var main = Departments[mainKey];
    if (!main) return;

    html += '<div class="main-dept" style="border-left: 3px solid ' + main.color + '">';
    html += '<div class="main-dept-header">';
    html += '<i class="' + main.icon + '" style="color:' + main.color + '"></i>';
    html += '<strong>' + main.name + '</strong>';
    html += '</div>';
    html += '<div class="sub-depts">';

    Object.keys(main.sub).forEach(function(subKey) {
      var sub = main.sub[subKey];
      html += '<div class="sub-dept">';
      html += '<div class="sub-dept-icon" style="color:' + sub.color + '"><i class="' + sub.icon + '"></i></div>';
      html += '<div class="sub-dept-info">';
      html += '<div class="sub-dept-name">' + sub.name + '</div>';
      html += '<div class="sub-dept-desc">' + sub.desc + '</div>';
      html += '</div>';
      html += '<div class="agent-state idle">IDLE</div>';
      html += '</div>';
    });

    html += '</div></div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

// ==========================================
// Dashboard Tab - สถิติทั้งหมด
// ==========================================
function loadDashboard() {
  var container = document.getElementById('dashboard-content');
  if (!container) return;

  var stats = DataStore.getStats();
  var workflows = Workflow.getActive();
  var pending = DataStore.getPendingTasks();

  var html = '<div class="dashboard-grid">';

  // กล่องสถิติ
  html += '<div class="stat-box">';
  html += '<div class="stat-icon"><i class="fas fa-file-alt"></i></div>';
  html += '<div class="stat-number">' + stats.totalDocs + '</div>';
  html += '<div class="stat-label">เอกสารทั้งหมด</div>';
  html += '</div>';

  html += '<div class="stat-box">';
  html += '<div class="stat-icon"><i class="fas fa-calendar-check"></i></div>';
  html += '<div class="stat-number">' + stats.monthDocs + '</div>';
  html += '<div class="stat-label">เอกสารเดือนนี้</div>';
  html += '</div>';

  html += '<div class="stat-box">';
  html += '<div class="stat-icon pending"><i class="fas fa-clock"></i></div>';
  html += '<div class="stat-number">' + stats.pendingTasks + '</div>';
  html += '<div class="stat-label">งานค้าง</div>';
  html += '</div>';

  html += '<div class="stat-box">';
  html += '<div class="stat-icon done"><i class="fas fa-check-circle"></i></div>';
  html += '<div class="stat-number">' + stats.completedTasks + '</div>';
  html += '<div class="stat-label">งานเสร็จแล้ว</div>';
  html += '</div>';

  html += '</div>';

  // Workflow ที่กำลังทำ
  html += '<div class="dash-section">';
  html += '<h3><i class="fas fa-cogs"></i> Workflow ที่กำลังทำ (' + workflows.length + ')</h3>';
  if (workflows.length > 0) {
    workflows.forEach(function(wf) {
      html += '<div class="wf-item">';
      html += '<div class="wf-icon">' + wf.icon + '</div>';
      html += '<div class="wf-info">';
      html += '<div class="wf-name">' + wf.name + '</div>';
      html += '<div class="wf-progress">';
      html += '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.round((wf.currentStep / wf.steps.length) * 100) + '%"></div></div>';
      html += '<span>' + wf.currentStep + '/' + wf.steps.length + '</span>';
      html += '</div></div>';
      html += '<button class="wf-next" onclick="advanceWorkflow(\'' + wf.id + '\')"><i class="fas fa-arrow-right"></i></button>';
      html += '</div>';
    });
  } else {
    html += '<p class="empty-msg">ไม่มี workflow ที่กำลังทำ</p>';
  }
  html += '</div>';

  // สถิติแผนก
  html += '<div class="dash-section">';
  html += '<h3><i class="fas fa-chart-bar"></i> สถิติแผนก</h3>';
  html += '<div class="dept-stats">';
  var mainDepts = ['general', 'academic', 'personnel', 'budget'];
  mainDepts.forEach(function(mainKey) {
    var main = Departments[mainKey];
    if (!main) return;
    var totalDocs = 0;
    var totalTasks = 0;
    Object.keys(main.sub).forEach(function(subKey) {
      var s = stats.deptStats[subKey];
      if (s) { totalDocs += s.docs; totalTasks += s.tasks; }
    });
    html += '<div class="dept-stat-row">';
    html += '<span style="color:' + main.color + '"><i class="' + main.icon + '"></i> ' + main.name + '</span>';
    html += '<span>' + totalDocs + ' เอกสาร / ' + totalTasks + ' งาน</span>';
    html += '</div>';
  });
  html += '</div></div>';

  container.innerHTML = html;
}

function advanceWorkflow(wfId) {
  var result = Workflow.nextStep(wfId);
  if (result.success) {
    showToast(result.message, 'success');
    loadDashboard();
  } else {
    showToast(result.message, 'info');
    loadDashboard();
  }
}

// ==========================================
// Quick Commands
// ==========================================
function useQuickCommand(cmd) {
  document.getElementById('chat-input').value = cmd;
  sendMessage();
}

// ==========================================
// Clear Chat
// ==========================================
function clearChat() {
  var container = document.getElementById('chat-messages');
  if (container) container.innerHTML = '';
  addWelcome();
}

function addWelcome() {
  var hour = new Date().getHours();
  var greet = 'สวัสดีตอนเช้าครับ';
  if (hour >= 12 && hour < 17) greet = 'สวัสดีตอนบ่ายครับ';
  else if (hour >= 17) greet = 'สวัสดีตอนเย็นครับ';

  var count = AIBrain.memory.conversations.length;
  var extra = count > 0 ? ' ยินดีต้อนรับกลับมาครับ!' : '';
  var convCount = count > 0 ? '\n(ประวัติสนทนา ' + count + ' ครั้ง)' : '';

  addMessage(greet + ' คุณครู' + convCount + extra + '\n\nผม Genesis เลขา AI ของโรงเรียนหนองพอกพัฒนาประชานุสรณ์ พร้อมรับใช้ครับ\n\n💡 ลองพิมพ์:\n• "กติกาฟุตบอล" - ถามคำถาม\n• "เขียนแผนการสอนสุขศึกษา ป.5" - สั่งงาน\n• "จัดกีฬาสี" - เริ่ม workflow\n• "ดู Dashboard" - ดูสถิติ', 'ai');
}

// ==========================================
// Utilities
// ==========================================
function escapeHtml(t) {
  if (!t) return '';
  var d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

function formatTime(date) {
  var diff = new Date() - date;
  if (diff < 60000) return 'เมื่อสักครู่';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' นาทีที่แล้ว';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' ชม. ที่แล้ว';
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

function showToast(msg, type) {
  type = type || 'success';
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return r + ',' + g + ',' + b;
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  try { initMatrixRain(); } catch(e) { console.warn('Matrix rain error:', e); }
  try { initVoice(); } catch(e) { console.warn('Voice init error:', e); }
  try { AIBrain.init(); } catch(e) { console.warn('AIBrain init error:', e); }
  try { DataStore.syncFromCloud(); } catch(e) { console.warn('Cloud sync error:', e); }

  var btnSend = document.getElementById('btn-send');
  if (btnSend) btnSend.addEventListener('click', sendMessage);

  var btnVoice = document.getElementById('btn-voice');
  if (btnVoice) btnVoice.addEventListener('click', toggleVoice);

  var btnAttach = document.getElementById('btn-attach');
  if (btnAttach) btnAttach.addEventListener('click', function() {
    var fi = document.getElementById('file-input');
    if (fi) fi.click();
  });

  var fi = document.getElementById('file-input');
  if (fi) fi.addEventListener('change', handleFileSelect);

  var input = document.getElementById('chat-input');
  if (input) {
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  document.querySelectorAll('.quick-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var ci = document.getElementById('chat-input');
      if (ci) ci.value = this.dataset.cmd;
      sendMessage();
    });
  });

  // ทดสอบเสียงทันที
  setTimeout(function() { testVoice(); }, 2000);

  addMessage('system', '⚡ Genesis v3.0 พร้อมทำงาน\n\n🎯 ลองพิมพ์:\n• "สวัสดี" - ทักทาย\n• "สร้างแผนการสอน" - สร้างเอกสาร\n• "กติกาฟุตบอล" - ถามความรู้\n• "สรุปงานประจำเดือน" - รายงาน\n• "สวัสดีครับ วันนี้เป็นไงบ้าง" - คุยเล่น');
});
