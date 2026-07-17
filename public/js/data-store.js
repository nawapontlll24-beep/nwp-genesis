// ==========================================
// GENESIS - Data Store v3
// Cloud Database (Supabase) + Local Backup
// ==========================================

var SUPABASE_URL = 'https://uadmalkxupaugjlllbia.supabase.co';
var SUPABASE_KEY = 'sb_publishable_0VmoJ7qMk-6wgUre6pfWcg__dvRZle1';

var _supabase = null;
var _useCloud = false;

function _initSupabase() {
  if (_supabase) return _supabase;
  try {
    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
      _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      _useCloud = true;
    }
  } catch (e) {
    console.warn('Supabase init failed:', e.message);
    _supabase = null;
  }
  return _supabase;
}

var DataStore = {
  _get: function(key) {
    try {
      var raw = localStorage.getItem('genesis_' + key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  _set: function(key, data) {
    localStorage.setItem('genesis_' + key, JSON.stringify(data));
  },

  _generateId: function() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  },

  // ==========================================
  // Cloud Sync
  // ==========================================
  syncFromCloud: async function() {
    var client = _initSupabase();
    if (!client) return;
    try {
      var tables = ['documents', 'commands', 'notifications', 'learned'];
      var keys = ['documents', 'commands', 'notifications', 'learned'];
      for (var i = 0; i < tables.length; i++) {
        var result = await client.from(tables[i]).select('*');
        if (result.data && result.data.length > 0) {
          var local = this._get(keys[i]);
          var localIds = {};
          local.forEach(function(item) { localIds[item.id] = true; });
          result.data.forEach(function(row) {
            if (!localIds[row.id]) {
              var mapped;
              if (tables[i] === 'learned') {
                mapped = {
                  id: row.id,
                  topic: row.topic || '',
                  content: row.content || '',
                  source: row.source || 'web_search',
                  keywords: row.keywords || [],
                  createdAt: row.created_at,
                  updatedAt: row.updated_at
                };
              } else {
                mapped = {
                  id: row.id,
                  type: row.type,
                  title: row.title,
                  content: row.content,
                  dept: row.dept,
                  deptId: row.dept_id,
                  mainDeptId: row.main_dept_id,
                  status: row.status,
                  teacherName: row.teacher_name,
                  schoolName: row.school_name,
                  url: row.url,
                  createdAt: row.created_at,
                  updatedAt: row.updated_at
                };
              }
              local.push(mapped);
            }
          });
          this._set(keys[i], local);
        }
      }
    } catch (e) {
      console.warn('Cloud sync failed:', e.message);
    }
  },

  _pushToCloud: async function(table, data) {
    var client = _initSupabase();
    if (!client) return;
    try {
      var row = {
        id: data.id,
        type: data.type || null,
        title: data.title || null,
        content: data.content || null,
        dept: data.dept || null,
        dept_id: data.deptId || null,
        main_dept_id: data.mainDeptId || null,
        status: data.status || null,
        teacher_name: data.teacherName || null,
        school_name: data.schoolName || null,
        url: data.url || null,
        created_at: data.createdAt || new Date().toISOString(),
        updated_at: data.updatedAt || new Date().toISOString()
      };
      await client.from(table).upsert(row, { onConflict: 'id' });
    } catch (e) {
      console.warn('Cloud push failed:', e.message);
    }
  },

  _deleteFromCloud: async function(table, id) {
    var client = _initSupabase();
    if (!client) return;
    try {
      await client.from(table).delete().eq('id', id);
    } catch (e) {
      console.warn('Cloud delete failed:', e.message);
    }
  },

  // ==========================================
  // จัดการเอกสาร
  // ==========================================
  saveDocument: function(docData) {
    var docs = this._get('documents');
    var doc = {
      id: this._generateId(),
      type: docData.type || 'general_doc',
      title: docData.title || 'เอกสาร',
      content: docData.content || '',
      dept: docData.dept || '',
      deptId: docData.deptId || '',
      mainDeptId: docData.mainDeptId || '',
      status: docData.status || 'created',
      teacherName: docData.teacherName || '',
      schoolName: docData.schoolName || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    docs.push(doc);
    this._set('documents', docs);
    this._pushToCloud('documents', doc);
    return doc;
  },

  getDocuments: function(filter) {
    var docs = this._get('documents').sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (filter) {
      if (filter.deptId) {
        docs = docs.filter(function(d) { return d.deptId === filter.deptId; });
      }
      if (filter.type) {
        docs = docs.filter(function(d) { return d.type === filter.type; });
      }
      if (filter.status) {
        docs = docs.filter(function(d) { return d.status === filter.status; });
      }
    }

    return docs;
  },

  getDocumentById: function(id) {
    var docs = this._get('documents');
    return docs.find(function(d) { return d.id === id; }) || null;
  },

  updateDocument: function(id, updates) {
    var docs = this._get('documents');
    var idx = docs.findIndex(function(d) { return d.id === id; });
    if (idx !== -1) {
      docs[idx] = Object.assign(docs[idx], updates, { updatedAt: new Date().toISOString() });
      this._set('documents', docs);
      this._pushToCloud('documents', docs[idx]);
      return docs[idx];
    }
    return null;
  },

  deleteDocument: function(id) {
    var docs = this._get('documents');
    var filtered = docs.filter(function(d) { return d.id !== id; });
    this._set('documents', filtered);
    this._deleteFromCloud('documents', id);
  },

  // ==========================================
  // จัดการงาน/คำสั่ง
  // ==========================================
  addCommand: function(department, commandText, metadata) {
    var commands = this._get('commands');
    var task = {
      id: this._generateId(),
      department: department,
      command: commandText,
      status: 'pending',
      priority: metadata ? metadata.priority : 'normal',
      assignedTo: metadata ? metadata.assignedTo : null,
      dueDate: metadata ? metadata.dueDate : null,
      createdAt: new Date().toISOString()
    };
    commands.push(task);
    this._set('commands', commands);
    this._pushToCloud('commands', task);
    return task;
  },

  getCommands: function(filter) {
    var commands = this._get('commands').sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (filter) {
      if (filter.status) {
        commands = commands.filter(function(c) { return c.status === filter.status; });
      }
      if (filter.department) {
        commands = commands.filter(function(c) { return c.department === filter.department; });
      }
    }

    return commands;
  },

  completeTask: function(taskId) {
    var commands = this._get('commands');
    var idx = commands.findIndex(function(c) { return c.id === taskId; });
    if (idx !== -1) {
      commands[idx].status = 'completed';
      commands[idx].completedAt = new Date().toISOString();
      this._set('commands', commands);
      this._pushToCloud('commands', commands[idx]);
    }
  },

  getPendingTasks: function() {
    return this.getCommands({ status: 'pending' });
  },

  // ==========================================
  // จัดการการแจ้งเตือน
  // ==========================================
  addNotification: function(data) {
    var notifs = this._get('notifications');
    var notif = {
      id: this._generateId(),
      type: data.type || 'info',
      title: data.title,
      message: data.message || data.detail || '',
      dueDate: data.dueDate || null,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifs.push(notif);
    this._set('notifications', notifs);
    this._pushToCloud('notifications', notif);
    return notif;
  },

  getNotifications: function(filter) {
    var notifs = this._get('notifications').sort(function(a, b) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (filter && filter.unread) {
      notifs = notifs.filter(function(n) { return !n.read; });
    }

    return notifs;
  },

  markNotifRead: function(id) {
    var notifs = this._get('notifications');
    var idx = notifs.findIndex(function(n) { return n.id === id; });
    if (idx !== -1) {
      notifs[idx].read = true;
      this._set('notifications', notifs);
      this._pushToCloud('notifications', notifs[idx]);
    }
  },

  // ==========================================
  // ข้อมูลที่เรียนรู้ (Learned Knowledge)
  // ==========================================
  saveLearnedInfo: function(data) {
    var learned = this._get('learned');
    var entry = {
      id: this._generateId(),
      topic: data.topic || '',
      content: data.content || '',
      source: data.source || 'web_search',
      keywords: data.keywords || [],
      createdAt: new Date().toISOString()
    };
    var existing = learned.find(function(l) {
      return l.topic.toLowerCase() === entry.topic.toLowerCase();
    });
    if (existing) {
      existing.content = entry.content;
      existing.source = entry.source;
      existing.keywords = entry.keywords;
      existing.updatedAt = new Date().toISOString();
    } else {
      learned.push(entry);
    }
    this._set('learned', learned);
    this._pushToCloud('learned', entry);
    return entry;
  },

  getLearnedInfo: function(query) {
    var learned = this._get('learned');
    if (!query) return learned;
    var q = query.toLowerCase();
    return learned.filter(function(l) {
      if (l.topic && l.topic.toLowerCase().indexOf(q) !== -1) return true;
      if (l.content && l.content.toLowerCase().indexOf(q) !== -1) return true;
      if (l.keywords && l.keywords.length > 0) {
        return l.keywords.some(function(kw) {
          return kw.toLowerCase().indexOf(q) !== -1;
        });
      }
      return false;
    });
  },

  deleteLearned: function(id) {
    var learned = this._get('learned');
    var filtered = learned.filter(function(l) { return l.id !== id; });
    this._set('learned', filtered);
    this._deleteFromCloud('learned', id);
  },

  // ==========================================
  // จัดการไฟล์แนบ
  // ==========================================
  addAttachment: function(commandId, files) {
    if (!files || files.length === 0) return;
    var docs = this._get('documents');
    files.forEach(function(f) {
      docs.push({
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
        name: f.name,
        url: f.data,
        type: 'attachment',
        commandId: commandId,
        size: f.size,
        createdAt: new Date().toISOString()
      });
    });
    this._set('documents', docs);
  },

  // ==========================================
  // Dashboard Statistics
  // ==========================================
  getStats: function() {
    var docs = this._get('documents');
    var tasks = this._get('commands');
    var notifs = this._get('notifications');

    var pending = tasks.filter(function(t) { return t.status === 'pending'; });
    var completed = tasks.filter(function(t) { return t.status === 'completed'; });
    var unread = notifs.filter(function(n) { return !n.read; });

    var thisMonth = new Date().toISOString().substring(0, 7);
    var monthDocs = docs.filter(function(d) {
      return d.createdAt && d.createdAt.substring(0, 7) === thisMonth;
    });

    var deptStats = {};
    var allSubs = Departments.getAllSubs();
    allSubs.forEach(function(sub) {
      deptStats[sub.id] = {
        name: sub.name,
        mainDept: sub.parent,
        docs: 0,
        tasks: 0
      };
    });

    docs.forEach(function(d) {
      if (d.deptId && deptStats[d.deptId]) {
        deptStats[d.deptId].docs++;
      }
    });

    tasks.forEach(function(t) {
      if (t.department && deptStats[t.department]) {
        deptStats[t.department].tasks++;
      }
    });

    return {
      totalDocs: docs.length,
      monthDocs: monthDocs.length,
      totalTasks: tasks.length,
      pendingTasks: pending.length,
      completedTasks: completed.length,
      unreadNotifs: unread.length,
      deptStats: deptStats
    };
  },

  // ==========================================
  // Export/Import
  // ==========================================
  exportAll: function() {
    return {
      version: '3.0',
      exportDate: new Date().toISOString(),
      documents: this._get('documents'),
      commands: this._get('commands'),
      notifications: this._get('notifications'),
      learned: this._get('learned'),
      memory: JSON.parse(localStorage.getItem('genesis_memory') || '{}'),
      workflows: JSON.parse(localStorage.getItem('genesis_workflows') || '[]')
    };
  },

  importAll: function(data) {
    if (data.documents) {
      this._set('documents', data.documents);
      var self = this;
      data.documents.forEach(function(d) { self._pushToCloud('documents', d); });
    }
    if (data.commands) {
      this._set('commands', data.commands);
      var self2 = this;
      data.commands.forEach(function(c) { self2._pushToCloud('commands', c); });
    }
    if (data.notifications) {
      this._set('notifications', data.notifications);
      var self3 = this;
      data.notifications.forEach(function(n) { self3._pushToCloud('notifications', n); });
    }
    if (data.learned) {
      this._set('learned', data.learned);
      var self4 = this;
      data.learned.forEach(function(l) { self4._pushToCloud('learned', l); });
    }
    if (data.memory) localStorage.setItem('genesis_memory', JSON.stringify(data.memory));
    if (data.workflows) localStorage.setItem('genesis_workflows', JSON.stringify(data.workflows));
  },

  clearAll: function() {
    var keys = ['documents', 'commands', 'notifications', 'learned'];
    keys.forEach(function(key) {
      localStorage.removeItem('genesis_' + key);
    });
    localStorage.removeItem('genesis_memory');
    localStorage.removeItem('genesis_workflows');
  }
};
