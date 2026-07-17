var Router = {
  routes: [],
  lastRoute: null,

  init: function() {
    this.routes = this.buildRoutes();
  },

  buildRoutes: function() {
    var routes = [];

    // ====== หมวด 1: ตอบคำถาม (Q&A) ======
    routes.push({
      intent: 'ask_question',
      patterns: [
        /กติกา|กฎ|วิธีเล่น|กติกา.*(?:ฟุตบอล|บาส|วอลเลย์|ตะกร้อ|วิ่ง|กรีฑา)/i,
        /ข้อบังคับ|ระเบียบ|กฎหมาย|พ\.?ร\.?บ\.?|พระราชบัญญัติ/i,
        /ข้อมูล|สถิติ|จำนวน|ตัวเลข|กี่คน|กี่ปี|กี่ครั้ง/i,
        /โภชนาการ|อาหาร|กิน|ดื่ม|สุขภาพ|ออกกำลังกาย/i,
        /โรค|ป่วย|ไข้|รักษา|ยา|แพทย์|โรงพยาบาล/i,
        /วัยรุ่น|สุขภาพจิต|เครียด|เศร้า/i,
        /อนามัย|ความสะอาด|สุขอนามัย/i,
        /โรงเรียน|ผอ\.|รองผอ\.|สพป\.|นักเรียน|ครู|นักศึกษา/i
      ],
      department: null, // ไม่ต้องส่งไปแผนกไหน ใช้ KnowledgeBase โดยตรง
      handler: 'qa_handler'
    });

    // ====== หมวด 2: สร้างเอกสาร (Create Document) ======
    routes.push({
      intent: 'create_document',
      patterns: [
        /เขียนหนังสือ|ทำหนังสือ|เขียนบันทึก|ทำบันทึก|หนังสือราชการ/i,
        /ออกคำสั่ง|แต่งตั้ง|คำสั่งแต่งตั้ง|คำสั่งมอบหมาย/i,
        /เขียนแผนการสอน|ทำแผนการสอน|แผนการสอน|สื่อการสอน|แบบฝึกหัด/i,
        /เขียนรายงาน|ทำรายงาน|สรุปรายงาน|รายงานผล/i,
        /ขอจัดสรร|ขอซื้อ|ใบเบิก|TOR|จัดซื้อจัดจ้าง|ขอซื้ออุปกรณ์|ขอซื้อวัสดุ/i,
        /ทำตาราง|จัดตาราง|โปรแกรมฝึก|โปรแกรมกีฬา/i,
        /ทำหนังสือเชิญ|หนังสือเชิญ|ทำวาระ|วาระประชุม/i,
        /ข้อความ|บันทึกข้อความ|หนังสือเวียน/i
      ],
      department: null, // จะ路由ตาม keyword
      handler: 'create_handler'
    });

    // ====== หมวด 3: ค้นหา/วิจัย (Research) ======
    routes.push({
      intent: 'research',
      patterns: [
        /ค้นหา|ค้นคว้า|หาข้อมูล|สืบค้น|วิจัย/i,
        /ตรวจสอบ|ตรวจทาน|เช็ค|verify/i,
        /สรุป|รวมรวม|รวบรวม|วิเคราะห์/i,
        /เปรียบเทียบ|เปรียบเทียบ|compare/i,
        /สถิติ|ตัวเลข|กราฟ|แผนภูมิ/i
      ],
      department: 'research',
      handler: 'research_handler'
    });

    // ====== หมวด 4: จัดการงาน (Task Management) ======
    routes.push({
      intent: 'task_management',
      patterns: [
        /ส่งงาน|ส่งมอบ|ส่งต่อ|assign|มอบหมาย/i,
        /ตรวจสอบสถานะ|status|ค้าง|ค้างอยู่/i,
        /เสร็จแล้ว|done|complete|สำเร็จ/i,
        /กำหนดส่ง|deadline|กำหนดวัน|ส่งวันไหน/i
      ],
      department: null,
      handler: 'task_handler'
    });

    // ====== หมวด 5: จัดงาน/กิจกรรม (Event Planning) ======
    routes.push({
      intent: 'plan_event',
      patterns: [
        /จัดงาน|จัดกิจกรรม|กิจกรรม|งานโรงเรียน/i,
        /กีฬาสี|กีฬาภายใน|กีฬาสัปดาห์|กีฬาประจำปี/i,
        /วันเด็ก|วันครู|วันแม่|วันพ่อ|วันสำคัญ/i,
        /ทัศนศึกษา|เข้าค่าย|ค่ายลูกเสือ|ค่ายยุวฑูต/i,
        /พิธี|พิธีเปิด|พิธีปิด|พิธีมอบรางวัล/i
      ],
      department: null,
      handler: 'event_handler'
    });

    return routes;
  },

  // ==========================================
  // วิเคราะห์ข้อความและหา route ที่เหมาะสม
  // ==========================================
  analyze: function(text) {
    var self = this;
    var bestMatch = null;
    var bestScore = 0;

    this.routes.forEach(function(route) {
      route.patterns.forEach(function(pattern) {
        var matches = text.match(pattern);
        if (matches) {
          var score = matches[0].length;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = route;
          }
        }
      });
    });

    return bestMatch || {
      intent: 'unknown',
      department: null,
      handler: 'unknown_handler'
    };
  },

  // ==========================================
  // หา department ที่เหมาะสมสำหรับ intent
  // ==========================================
  findDepartment: function(text, intent) {
    if (intent === 'ask_question') {
      // ค้นหาจาก KnowledgeBase
      var kbResults = KnowledgeBase.getAnswer(text);
      if (kbResults) {
        return { subId: null, mainId: null, source: 'knowledge_base', data: kbResults };
      }
    }

    // ค้นหาจาก Departments
    var deptResults = Departments.find(text);
    if (deptResults.length > 0) {
      var bestDept = deptResults[0].dept;
      return {
        subId: bestDept.id,
        mainId: bestDept.parent,
        source: 'department',
        dept: bestDept
      };
    }

    return { subId: null, mainId: null, source: null };
  },

  // ==========================================
  // ส่งต่องาน (cross-department routing)
  // ==========================================
  routeTask: function(task) {
    var self = this;
    var results = [];

    // ส่งงานไปแผนกหลัก
    var primaryDept = Departments.getSub(task.subId);
    if (primaryDept) {
      results.push({
        dept: primaryDept,
        status: 'รับงาน',
        action: 'กำลังดำเนินการ'
      });
    }

    // ตรวจสอบว่าต้องส่งต่อแผนกอื่นไหม
    var crossDepts = this.findCrossDepartments(task);
    crossDepts.forEach(function(dept) {
      results.push({
        dept: dept,
        status: 'ได้รับแจ้ง',
        action: 'รอข้อมูล'
      });
    });

    this.lastRoute = {
      task: task,
      departments: results,
      timestamp: new Date().toISOString()
    };

    return results;
  },

  // ==========================================
  // หาแผนกที่เกี่ยวข้อง (inter-department)
  // ==========================================
  findCrossDepartments: function(task) {
    var results = [];
    var text = (task.description || task.title || '').toLowerCase();

    // ถ้าเกี่ยวกับงบประมาณ
    if (text.indexOf('งบ') !== -1 || text.indexOf('เงิน') !== -1 || text.indexOf('จัดซื้อ') !== -1) {
      var budgetDept = Departments.getSub('budget_plan');
      if (budgetDept) results.push(budgetDept);
    }

    // ถ้าเกี่ยวกับบุคลากร
    if (text.indexOf('ครู') !== -1 || text.indexOf('บุคลากร') !== -1 || text.indexOf('แต่งตั้ง') !== -1) {
      var personnelDept = Departments.getSub('staff_data');
      if (personnelDept) results.push(personnelDept);
    }

    // ถ้าเกี่ยวกับอาคารสถานที่
    if (text.indexOf('อาคาร') !== -1 || text.indexOf('สถานที่') !== -1 || text.indexOf('ซ่อม') !== -1) {
      var facilitiesDept = Departments.getSub('facilities');
      if (facilitiesDept) results.push(facilitiesDept);
    }

    // ถ้าเกี่ยวกับเอกสารธุรการ
    if (text.indexOf('หนังสือ') !== -1 || text.indexOf('คำสั่ง') !== -1 || text.indexOf('บันทึก') !== -1) {
      var clericalDept = Departments.getSub('clerical');
      if (clericalDept) results.push(clericalDept);
    }

    return results;
  },

  // ==========================================
  // สรุปผลการ route
  // ==========================================
  getSummary: function() {
    if (!this.lastRoute) return 'ยังไม่มีงานที่ส่งต่อ';

    var summary = '📊 สรุปการส่งต่องาน:\n\n';
    this.lastRoute.departments.forEach(function(d, i) {
      summary += (i + 1) + '. ' + d.dept.name + ' (' + d.status + ')\n';
      summary += '   → ' + d.action + '\n\n';
    });

    return summary;
  },

  // ==========================================
  // สร้าง thinking steps สำหรับแสดงผล
  // ==========================================
  createThinkingSteps: function(text, intent, deptResult) {
    var steps = [];

    steps.push({
      dept: 'Genesis',
      action: 'วิเคราะห์คำสั่ง "' + text + '"',
      icon: 'fas fa-brain'
    });

    if (intent === 'ask_question') {
      steps.push({
        dept: 'Knowledge Base',
        action: 'ค้นหาข้อมูลในฐานข้อมูล',
        icon: 'fas fa-database'
      });
      if (deptResult.source === 'knowledge_base') {
        steps.push({
          dept: 'Knowledge Base',
          action: 'พบข้อมูลที่เกี่ยวข้อง ' + deptResult.data.length + ' รายการ',
          icon: 'fas fa-check'
        });
      }
    } else if (intent === 'create_document') {
      if (deptResult.dept) {
        steps.push({
          dept: 'ฝ่ายวิชาการ',
          action: 'ส่งต่อไปยัง ' + deptResult.dept.name,
          icon: 'fas fa-paper-plane'
        });
      }
      steps.push({
        dept: deptResult.dept ? deptResult.dept.name : 'ฝ่ายที่เกี่ยวข้อง',
        action: 'กำลังจัดทำเอกสาร',
        icon: 'fas fa-file-alt'
      });
    } else if (intent === 'research') {
      steps.push({
        dept: 'ฝ่ายวิจัย',
        action: 'กำลังค้นคว้าและวิเคราะห์ข้อมูล',
        icon: 'fas fa-search'
      });
    }

    return steps;
  }
};

Router.init();
