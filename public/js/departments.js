// ==========================================
// GENESIS - องค์กรเสมือนโรงเรียน
// โครงสร้าง 4 ฝ่ายหลัก + ฝ่ายย่อย
// ==========================================

var Departments = {

  // ==========================================
  // ฝ่ายที่ 1: บริหารงานทั่วไป
  // ==========================================
  general: {
    id: 'general',
    name: 'ฝ่ายบริหารงานทั่วไป',
    icon: 'fas fa-building',
    color: '#3b82f6',
    sub: {
      clerical: {
        id: 'clerical',
        name: 'งานธุรการ',
        parent: 'general',
        icon: 'fas fa-file-alt',
        color: '#3b82f6',
        desc: 'หนังสือราชการ บันทึกข้อความ คำสั่ง หนังสือเวียน',
        capabilities: ['create_letter', 'create_memo', 'create_order', 'create_circular'],
        keywords: ['หนังสือ', 'บันทึก', 'คำสั่ง', 'หนังสือเวียน', 'ขอความเห็นชอบ', 'ขออนุญาต', 'เรียน ท่าน', 'หนังสือถึง', 'ออกคำสั่ง', 'แต่งตั้ง'],
        canCreate: ['official_letter', 'memo', 'order', 'circular']
      },
      facilities: {
        id: 'facilities',
        name: 'งานอาคารสถานที่',
        parent: 'general',
        icon: 'fas fa-tools',
        color: '#6366f1',
        desc: 'ดูแลอาคาร ซ่อมแซม ขอใช้สถานที่ พัฒนา',
        capabilities: ['repair_request', 'venue_request', 'facility_survey'],
        keywords: ['ซ่อม', 'อาคาร', 'สถานที่', 'ห้อง', 'หลังคา', 'น้ำรั่ว', 'ไฟดับ', 'ขอใช้ห้อง', 'พัฒนา', 'ปรับปรุง'],
        canCreate: ['repair_form', 'venue_form', 'facility_report']
      },
      doc_review: {
        id: 'doc_review',
        name: 'งานตรวจสอบเอกสาร',
        parent: 'general',
        icon: 'fas fa-check-double',
        color: '#8b5cf6',
        desc: 'ตรวจทาน ความถูกต้อง ระเบียบ ข้อกฎหมาย',
        capabilities: ['review_document', 'check_regulation', 'verify_accuracy'],
        keywords: ['ตรวจ', 'ตรวจสอบ', 'ถูกต้องไหม', 'ระเบียบ', '合规', 'ผิดไหม', 'ตรวจทาน'],
        canCreate: ['review_report']
      },
      registry: {
        id: 'registry',
        name: 'งานรวบรวมคำสั่ง',
        parent: 'general',
        icon: 'fas fa-archive',
        color: '#64748b',
        desc: 'เก็บรวบรวมคำสั่ง หนังสือจากหน่วยงานต่างๆ',
        capabilities: ['collect_orders', 'organize_archive', 'search_archive'],
        keywords: ['คำสั่งที่', 'หนังสือที่', 'รวบรวม', 'เก็บ', 'ค้นหาคำสั่ง', 'สรุปคำสั่ง'],
        canCreate: ['order_summary']
      }
    }
  },

  // ==========================================
  // ฝ่ายที่ 2: งานวิชาการ
  // ==========================================
  academic: {
    id: 'academic',
    name: 'ฝ่ายวิชาการ',
    icon: 'fas fa-graduation-cap',
    color: '#10b981',
    sub: {
      health_ed: {
        id: 'health_ed',
        name: 'งานสุขศึกษาและพลศึกษา',
        parent: 'academic',
        icon: 'fas fa-heartbeat',
        color: '#ef4444',
        desc: 'แผนการสอน สื่อการสอน สาระการเรียนรู้ สุขศึกษา พลศึกษา',
        capabilities: ['create_lesson_plan', 'create_teaching_media', 'create_worksheet', 'create_assessment'],
        keywords: ['แผนการสอน', 'สื่อการสอน', 'สุขศึกษา', 'พลศึกษา', 'แบบฝึกหัด', 'เกณฑ์วัดผล', 'สาระการเรียนรู้', 'สุขภาพ', 'โภชนาการ', 'อนามัยโรงเรียน'],
        gradeRange: 'ป.1-ป.6',
        subject: 'สุขศึกษาและพลศึกษา',
        canCreate: ['teaching_plan', 'teaching_media', 'worksheet', 'assessment']
      },
      sports: {
        id: 'sports',
        name: 'งานกีฬา',
        parent: 'academic',
        icon: 'fas fa-running',
        color: '#22c55e',
        desc: 'จัดการแข่งขัน กีฬาสี ข้อมูลนักกีฬา โปรแกรมฝึก กติกา',
        capabilities: ['organize_competition', 'create_athlete_roster', 'create_training_program', 'get_rules', 'competition_results'],
        keywords: ['กีฬา', 'กีฬาสี', 'แข่งขัน', 'นักกีฬา', 'โปรแกรมฝึก', 'กติกา', 'ฟุตบอล', 'บาสเกตบอล', 'วอลเลย์บอล', 'กรีฑา', 'ว่ายน้ำ', 'ผลการแข่ง', 'รางวัล'],
        canCreate: ['competition_plan', 'athlete_roster', 'training_program', 'sports_results']
      },
      research: {
        id: 'research',
        name: 'งานวิจัยข้อมูล',
        parent: 'academic',
        icon: 'fas fa-search',
        color: '#06b6d4',
        desc: 'ค้นคว้า ตรวจสอบข้อมูล สถิติ สรุปข้อมูล',
        capabilities: ['research', 'fact_check', 'statistics', 'summarize'],
        keywords: ['ค้นหา', 'ค้นคว้า', 'ตรวจสอบ', 'สถิติ', 'ข้อมูล', 'สรุป', 'วิจัย', 'ข้อเท็จจริง', 'ตัวเลข', 'ร้อยละ'],
        canCreate: ['research_report', 'statistics_summary']
      },
      registry_student: {
        id: 'registry_student',
        name: 'งานทะเบียนนักเรียน',
        parent: 'academic',
        icon: 'fas fa-users',
        color: '#8b5cf6',
        desc: 'คะแนน ปพ.5 สถิตินักเรียน เช็คชื่อ',
        capabilities: ['record_scores', 'student_stats', 'attendance', 'p5_report'],
        keywords: ['คะแนน', 'สถิตินักเรียน', 'เช็คชื่อ', 'ปพ.5', 'ผลการเรียน', 'นักเรียน', 'นร.', 'ห้อง', 'ชั้น'],
        canCreate: ['score_sheet', 'student_stats', 'attendance_form', 'p5_form']
      },
      academic_doc: {
        id: 'academic_doc',
        name: 'งานเอกสารวิชาการ',
        parent: 'academic',
        icon: 'fas fa-book',
        color: '#f59e0b',
        desc: 'รายงานผลการเรียน หลักสูตร แผนพัฒนาวิชาการ',
        capabilities: ['academic_report', 'curriculum', 'development_plan'],
        keywords: ['รายงานผล', 'หลักสูตร', 'แผนพัฒนา', 'เอกสารวิชาการ', 'ผลสัมฤทธิ์'],
        canCreate: ['academic_report', 'curriculum_doc']
      }
    }
  },

  // ==========================================
  // ฝ่ายที่ 3: บุคลากร
  // ==========================================
  personnel: {
    id: 'personnel',
    name: 'ฝ่ายบุคลากร',
    icon: 'fas fa-user-tie',
    color: '#f59e0b',
    sub: {
      staff_data: {
        id: 'staff_data',
        name: 'งานข้อมูลบุคลากร',
        parent: 'personnel',
        icon: 'fas fa-id-card',
        color: '#f59e0b',
        desc: 'ประวัติครู งานที่รับผิดชอบ ภาระงาน',
        capabilities: ['staff_profile', 'workload', 'history'],
        keywords: ['ครู', 'บุคลากร', 'ประวัติ', 'ภาระงาน', 'หน้าที่', 'รับผิดชอบ'],
        canCreate: ['staff_profile_doc', 'workload_report']
      },
      coordination: {
        id: 'coordination',
        name: 'งานประสานงาน',
        parent: 'personnel',
        icon: 'fas fa-handshake',
        color: '#ec4899',
        desc: 'ติดต่อหน่วยงาน หนังสือถึง ประสานงานภายนอก',
        capabilities: ['external_contact', 'coordination_letter', 'meeting_setup'],
        keywords: ['ติดต่อ', 'ประสานงาน', 'ประชุม', 'หน่วยงาน', 'สพป.', 'สพม.', 'สำนักงาน'],
        canCreate: ['coordination_letter', 'meeting_agenda']
      }
    }
  },

  // ==========================================
  // ฝ่ายที่ 4: งบประมาณ
  // ==========================================
  budget: {
    id: 'budget',
    name: 'ฝ่ายงบประมาณ',
    icon: 'fas fa-coins',
    color: '#f97316',
    sub: {
      budget_plan: {
        id: 'budget_plan',
        name: 'งานงบประมาณ',
        parent: 'budget',
        icon: 'fas fa-calculator',
        color: '#f97316',
        desc: 'ขอจัดสรรงบ รายงานการเงิน ใบเบิก  TOR',
        capabilities: ['budget_request', 'financial_report', 'expenditure', 'tor'],
        keywords: ['งบประมาณ', 'จัดสรร', 'เงิน', 'เบิก', 'จ่าย', 'ค่าใช้จ่าย', 'รายงานการเงิน', 'TOR', 'จัดซื้อ', 'จัดจ้าง'],
        canCreate: ['budget_request', 'financial_report', 'expenditure_form', 'tor_doc']
      },
      procurement: {
        id: 'procurement',
        name: 'งานจัดซื้อจัดจ้าง',
        parent: 'budget',
        icon: 'fas fa-shopping-cart',
        color: '#ef4444',
        desc: 'ขอซื้อ ขอจัดจ้าง สำรวจราคา ใบเสนอราคา',
        capabilities: ['purchase_request', 'procurement', 'price_survey'],
        keywords: ['ซื้อ', 'จัดซื้อ', 'จัดจ้าง', 'สำรวจราคา', 'ใบเสนอราคา', 'TOR', 'อุปกรณ์', 'วัสดุ'],
        canCreate: ['purchase_form', 'procurement_doc', 'price_survey']
      }
    }
  }
};

// ==========================================
// ค้นหาฝ่ายจากคำค้นหา
// ==========================================
Departments.find = function(text) {
  var lower = text.toLowerCase();
  var results = [];

  // ค้นจาก sub departments ทุกตัว
  var allSubs = this.getAllSubs();
  allSubs.forEach(function(sub) {
    var score = 0;
    sub.keywords.forEach(function(kw) {
      if (lower.indexOf(kw.toLowerCase()) !== -1) {
        score += kw.length; // ยิ่ง keyword ยาว ยิ่งแม่น
      }
    });
    if (score > 0) {
      results.push({ dept: sub, score: score });
    }
  });

  results.sort(function(a, b) { return b.score - a.score; });
  return results;
};

// ==========================================
// ค้นหาจาก intent (Q&A / Create / Research)
// ==========================================
Departments.findByIntent = function(text, intent) {
  var lower = text.toLowerCase();
  var allSubs = this.getAllSubs();

  if (intent === 'create_document') {
    // เน้นค้นหาแผนกที่สร้างเอกสารได้
    return allSubs.filter(function(sub) {
      return sub.canCreate && sub.canCreate.length > 0;
    });
  }

  if (intent === 'ask_question') {
    // เน้นค้นหาแผนกที่มีข้อมูล
    return allSubs.filter(function(sub) {
      return sub.capabilities && sub.capabilities.length > 0;
    });
  }

  return this.find(text);
};

// ==========================================
// ดึง sub departments ทั้งหมด
// ==========================================
Departments.getAllSubs = function() {
  var subs = [];
  var self = this;
  Object.keys(this).forEach(function(key) {
    if (typeof self[key] === 'object' && self[key].sub) {
      Object.keys(self[key].sub).forEach(function(subKey) {
        subs.push(self[key].sub[subKey]);
      });
    }
  });
  return subs;
};

// ==========================================
// ดึง department หลักจาก sub id
// ==========================================
Departments.getMainBySub = function(subId) {
  var self = this;
  var allSubs = this.getAllSubs();
  var sub = allSubs.find(function(s) { return s.id === subId; });
  if (!sub) return null;
  return self[sub.parent] || null;
};

// ==========================================
// ดึง sub department จาก id
// ==========================================
Departments.getSub = function(subId) {
  var allSubs = this.getAllSubs();
  return allSubs.find(function(s) { return s.id === subId; }) || null;
};
