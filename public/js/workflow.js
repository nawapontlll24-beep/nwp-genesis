var Workflow = {
  templates: {},
  activeWorkflows: [],

  init: function() {
    this.templates = this.defineTemplates();
    this.loadActive();
  },

  defineTemplates: function() {
    return {
      // ====== Workflow 1: ขอจัดสรรงบประมาณ ======
      budget_request: {
        name: 'ขอจัดสรรงบประมาณ',
        icon: 'fas fa-coins',
        departments: ['budget_plan', 'clerical', 'general'],
        steps: [
          { dept: 'budget_plan', action: 'ร่างใบขอจัดสรร', docType: 'budget_request', wait: true },
          { dept: 'clerical', action: 'ตรวจสอบระเบียบการเงิน', docType: 'review_report', wait: true },
          { dept: 'general', action: 'เสนออนุมัติ', docType: 'official_letter', wait: true },
          { dept: 'budget_plan', action: 'บันทึกผลการอนุมัติ', docType: 'budget_request', wait: false }
        ]
      },

      // ====== Workflow 2: จัดงานกีฬาสี ======
      sports_day: {
        name: 'จัดงานกีฬาสี',
        icon: 'fas fa-trophy',
        departments: ['sports', 'budget_plan', 'facilities', 'health_ed', 'clerical'],
        steps: [
          { dept: 'sports', action: 'วางแผนแข่งขัน + ผังการแข่ง', docType: 'schedule', wait: true },
          { dept: 'budget_plan', action: 'ขอจัดสรรงบรางวัล/อุปกรณ์', docType: 'budget_request', wait: true },
          { dept: 'facilities', action: 'จองสนาม + จัดสถานที่', docType: 'venue_form', wait: true },
          { dept: 'health_ed', action: 'เตรียมแผนปฐมพยาบาล', docType: 'report', wait: true },
          { dept: 'clerical', action: 'ออกหนังสือเชิญ + คำสั่งแต่งตั้งเจ้าหน้าที่', docType: 'official_letter', wait: true },
          { dept: 'sports', action: 'จัดทำโปรแกรมการแข่ง + สรุปผล', docType: 'report', wait: false }
        ]
      },

      // ====== Workflow 3: ทำแผนการสอน ======
      lesson_plan: {
        name: 'ทำแผนการสอน',
        icon: 'fas fa-chalkboard-teacher',
        departments: ['health_ed', 'academic_doc'],
        steps: [
          { dept: 'health_ed', action: 'ร่างแผนการสอนตาม มคอ.', docType: 'teaching_plan', wait: true },
          { dept: 'academic_doc', action: 'ตรวจทาน + จัดรูปแบบ', docType: 'review_report', wait: false }
        ]
      },

      // ====== Workflow 4: รายงานประจำเดือน ======
      monthly_report: {
        name: 'รายงานประจำเดือน',
        icon: 'fas fa-chart-bar',
        departments: ['academic_doc', 'sports', 'health_ed', 'clerical'],
        steps: [
          { dept: 'sports', action: 'สรุปผลการแข่งขัน/กิจกรรมกีฬา', docType: 'report', wait: true },
          { dept: 'health_ed', action: 'สรุปอนามัย + โภชนาการ', docType: 'report', wait: true },
          { dept: 'academic_doc', action: 'รวมยอด + จัดทำรายงาน', docType: 'report', wait: true },
          { dept: 'clerical', action: 'ส่งรายงานให้ ผอ.', docType: 'official_letter', wait: false }
        ]
      },

      // ====== Workflow 5: แต่งตั้งเจ้าหน้าที่ ======
      appointment: {
        name: 'แต่งตั้งเจ้าหน้าที่',
        icon: 'fas fa-user-tie',
        departments: ['clerical', 'staff_data'],
        steps: [
          { dept: 'staff_data', action: 'เสนอรายชื่อ + คุณสมบัติ', docType: 'report', wait: true },
          { dept: 'clerical', action: 'ร่างคำสั่งแต่งตั้ง', docType: 'order', wait: true },
          { dept: 'clerical', action: 'เสนอผอ.ลงนาม', docType: 'official_letter', wait: false }
        ]
      },

      // ====== Workflow 6: จัดซื้อจัดจ้าง ======
      procurement: {
        name: 'จัดซื้อจัดจ้าง',
        icon: 'fas fa-shopping-cart',
        departments: ['procurement', 'budget_plan', 'clerical'],
        steps: [
          { dept: 'procurement', action: 'สำรวจราคา + ขอใบเสนอราคา', docType: 'report', wait: true },
          { dept: 'budget_plan', action: 'ตรวจสอบ TOR + งบประมาณ', docType: 'budget_request', wait: true },
          { dept: 'clerical', action: 'ร่างสัญญา/ใบสั่งซื้อ', docType: 'official_letter', wait: false }
        ]
      },

      // ====== Workflow 7: จัดวันเด็ก/วันสำคัญ ======
      celebration: {
        name: 'จัดงานวันสำคัญ',
        icon: 'fas fa-calendar-day',
        departments: ['clerical', 'facilities', 'health_ed', 'budget_plan'],
        steps: [
          { dept: 'clerical', action: 'ร่างกำหนดการ + หนังสือเชิญ', docType: 'official_letter', wait: true },
          { dept: 'budget_plan', action: 'ขอจัดสรรงบจัดงาน', docType: 'budget_request', wait: true },
          { dept: 'facilities', action: 'จัดสถานที่ + เวที', docType: 'venue_form', wait: true },
          { dept: 'health_ed', action: 'เตรียมแผนปฐมพยาบาล', docType: 'report', wait: false }
        ]
      }
    };
  },

  // ==========================================
  // เริ่ม workflow ใหม่
  // ==========================================
  start: function(templateKey, customData) {
    var template = this.templates[templateKey];
    if (!template) return { success: false, message: 'ไม่พบ template' };

    var workflow = {
      id: 'wf_' + Date.now(),
      templateKey: templateKey,
      name: template.name,
      icon: template.icon,
      currentStep: 0,
      status: 'active',
      steps: template.steps.map(function(step, index) {
        return {
          stepNumber: index + 1,
          dept: step.dept,
          action: step.action,
          docType: step.docType,
          status: 'pending',
          result: null,
          timestamp: null
        };
      }),
      departments: template.departments,
      customData: customData || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.activeWorkflows.push(workflow);
    this.saveActive();

    return {
      success: true,
      workflow: workflow,
      message: 'เริ่ม workflow "' + template.name + '" เรียบร้อย\nขั้นตอนทั้งหมด: ' + template.steps.length + ' ขั้นตอน'
    };
  },

  // ==========================================
  // ทำขั้นตอนถัดไป
  // ==========================================
  nextStep: function(workflowId) {
    var workflow = this.activeWorkflows.find(function(w) { return w.id === workflowId; });
    if (!workflow) return { success: false, message: 'ไม่พบ workflow' };

    if (workflow.currentStep >= workflow.steps.length) {
      workflow.status = 'completed';
      this.saveActive();
      return { success: false, message: 'workflow นี้เสร็จแล้ว' };
    }

    var step = workflow.steps[workflow.currentStep];
    step.status = 'completed';
    step.timestamp = new Date().toISOString();
    step.result = 'เสร็จเรียบร้อย';

    workflow.currentStep++;
    workflow.updatedAt = new Date().toISOString();

    if (workflow.currentStep >= workflow.steps.length) {
      workflow.status = 'completed';
    }

    this.saveActive();

    return {
      success: true,
      workflow: workflow,
      currentStep: workflow.currentStep,
      totalSteps: workflow.steps.length,
      message: 'ขั้นตอนที่ ' + (workflow.currentStep) + '/' + workflow.steps.length + ' เสร็จแล้ว'
    };
  },

  // ==========================================
  // ดึงสถานะ workflow
  // ==========================================
  getStatus: function(workflowId) {
    var workflow = this.activeWorkflows.find(function(w) { return w.id === workflowId; });
    if (!workflow) return null;

    return {
      id: workflow.id,
      name: workflow.name,
      status: workflow.status,
      currentStep: workflow.currentStep,
      totalSteps: workflow.steps.length,
      steps: workflow.steps
    };
  },

  // ==========================================
  // ดึงทุก workflow ที่กำลังทำงาน
  // ==========================================
  getActive: function() {
    return this.activeWorkflows.filter(function(w) { return w.status === 'active'; });
  },

  // ==========================================
  // สรุปสถานะทั้งหมด
  // ==========================================
  getSummary: function() {
    var active = this.getActive();
    var completed = this.activeWorkflows.filter(function(w) { return w.status === 'completed'; });

    var summary = '📊 สรุป Workflow:\n\n';
    summary += '🟢 กำลังทำ: ' + active.length + ' งาน\n';
    summary += '✅ เสร็จแล้ว: ' + completed.length + ' งาน\n\n';

    if (active.length > 0) {
      summary += '🟢 งานที่กำลังทำ:\n';
      active.forEach(function(w) {
        summary += '  • ' + w.name + ' (' + w.currentStep + '/' + w.steps.length + ')\n';
      });
    }

    return summary;
  },

  // ==========================================
  // บันทึก/โหลด active workflows
  // ==========================================
  saveActive: function() {
    try {
      localStorage.setItem('genesis_workflows', JSON.stringify(this.activeWorkflows));
    } catch (e) {
      console.log('Workflow save failed');
    }
  },

  loadActive: function() {
    try {
      var saved = localStorage.getItem('genesis_workflows');
      if (saved) {
        this.activeWorkflows = JSON.parse(saved);
      }
    } catch (e) {
      this.activeWorkflows = [];
    }
  },

  // ==========================================
  // ล้าง workflow ที่เสร็จแล้ว
  // ==========================================
  clearCompleted: function() {
    this.activeWorkflows = this.activeWorkflows.filter(function(w) {
      return w.status !== 'completed';
    });
    this.saveActive();
  }
};

Workflow.init();
