// ==========================================
// GENESIS - Data Store v2
// ระบบจัดการข้อมูลทั้งหมด
// ==========================================

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
      return docs[idx];
    }
    return null;
  },

  deleteDocument: function(id) {
    var docs = this._get('commands');
    var filtered = docs.filter(function(d) { return d.id !== id; });
    this._set('documents', filtered);
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
    }
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

    // แยกตามแผนก
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
  // Export ข้อมูล (สำหรับ backup)
  // ==========================================
  exportAll: function() {
    return {
      version: '2.0',
      exportDate: new Date().toISOString(),
      documents: this._get('documents'),
      commands: this._get('commands'),
      notifications: this._get('notifications'),
      memory: JSON.parse(localStorage.getItem('genesis_memory') || '{}'),
      workflows: JSON.parse(localStorage.getItem('genesis_workflows') || '[]')
    };
  },

  // ==========================================
  // Import ข้อมูล (สำหรับ restore)
  // ==========================================
  importAll: function(data) {
    if (data.documents) this._set('documents', data.documents);
    if (data.commands) this._set('commands', data.commands);
    if (data.notifications) this._set('notifications', data.notifications);
    if (data.memory) localStorage.setItem('genesis_memory', JSON.stringify(data.memory));
    if (data.workflows) localStorage.setItem('genesis_workflows', JSON.stringify(data.workflows));
  },

  // ==========================================
  // ล้างข้อมูลทั้งหมด
  // ==========================================
  clearAll: function() {
    var keys = ['documents', 'commands', 'notifications'];
    keys.forEach(function(key) {
      localStorage.removeItem('genesis_' + key);
    });
    localStorage.removeItem('genesis_memory');
    localStorage.removeItem('genesis_workflows');
  }
};
