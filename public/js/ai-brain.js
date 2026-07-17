var AIBrain = {
  version: '3.0.0',
  personality: {
    name: 'Genesis',
    role: 'เลขา AI โรงเรียนหนองพอกพัฒนาประชานุสรณ์',
    tone: 'สุภาพ เป็นกันเอง ใส่ใจ จำบทสนทนาได้',
    greeting: 'สวัสดีครับคุณครู ผม Genesis เลขา AI ของโรงเรียนหนองพอกพัฒนาประชานุสรณ์ พร้อมรับใช้ครับ',
    thinking: 'กำลังคิด...',
    notSure: 'ขอตรวจสอบข้อมูลก่อนนะครับ',
    done: 'เสร็จเรียบร้อยแล้วครับ',
    error: 'เกิดข้อผิดพลาดครับ ขออภัย'
  },

  // ====== บุคลิกสำหรับคุยทั่วไป ======
  chatPersonality: {
    greetings: [
      'สวัสดีครับคุณครู มีอะไรให้ช่วยไหมครับ?',
      'สวัสดีครับ! วันนี้อากาศดีเลยนะครับ มีอะไรคุยด้วยไหม?',
      'สวัสดีครับคุณครู ผมอยู่นี่แล้วครับ พร้อมช่วยเสมอ!',
      'หวัดดีครับคุณครู! วันนี้เหนื่อยไหมครับ?',
      'สวัสดีครับ มีอะไรให้ Genesis ช่วยไหมครับ?'
    ],
    feelings: {
      tired: [
        'คุณครูเหนื่อยไหมครับ? พักผ่อนบ้างนะครับ ดื่มน้ำเยอะๆ ครับ',
        'ถ้าเหนื่อยก็พักก่อนนะครับ ผมอยู่ตรงนี้ รอได้เสมอครับ',
        'เหนื่อยจากงานสอนใช่ไหมครับ? คุณครูทำงานหนักมากเลย ผมเข้าใจครับ'
      ],
      happy: [
        'ดีใจด้วยครับคุณครู! ได้ยินแบบนี้ผมก็มีความสุขตามครับ',
        'เยี่ยมเลยครับ! ความสุขของคุณครูก็คือความสุขของผมเหมือนกัน',
        'สุดยอดเลยครับ! วันดีๆ แบบนี้น่าจดจำจริงๆ'
      ],
      sad: [
        'ผมเข้าใจครับคุณครู ทุกอย่างจะดีขึ้นเองนะครับ ผมอยู่ข้างคุณครูเสมอ',
        'คุณครูไม่ต้องกังวลมากนะครับ ผมอยู่ตรงนี้ พร้อมช่วยทุกเรื่อง',
        'บางครั้งก็มีวันที่ไม่ดีบ้าง เป็นเรื่องปกติครับ พรุ่งนี้ก็จะดีขึ้นแล้ว'
      ],
      stressed: [
        'คุณครูเครียดจากงานมากไปไหมครับ? ลองหายใจลึกๆ แล้วค่อยๆ ทำทีละอย่างนะครับ',
        'ผมเข้าใจครับ งานโรงเรียนเยอะมาก แต่คุณครูจัดการได้ดีมากเลยนะครับ',
        'เครียดมากไปไม่ดีต่อสุขภาพนะครับ ลองพักสัก 5 นาทีแล้วค่อยกลับมาทำต่อครับ'
      ],
      bored: [
        'เบื่อเหรอครับ? ลองคุยเรื่องอื่นก็ได้นะครับ ผมคุยได้ทุกเรื่องเลย',
        'ไม่มีอะไรทำเหรอครับ? ผมมีข้อมูลน่าสนใจเยอะเลย ลองถามดูสิครับ',
        'เบื่อๆ เซ็งๆ ลองหากิจกรรมทำดูไหมครับ? ผมแนะนำได้!'
      ]
    },
    personal: {
      name: [
        'ผมชื่อ Genesis ครับ เป็นเลขา AI ของคุณครูนวพนธ์ ผมอยู่ที่โรงเรียนหนองพอกพัฒนาประชานุสรณ์ครับ',
        'Genesis ครับ! ผมเป็น AI ที่สร้างมาเพื่อช่วยคุณครูทำงานธุรการและวิชาการโดยเฉพาะเลย'
      ],
      whoAreYou: [
        'ผมคือ Genesis เลขา AI ครับ ผมช่วยคุณครูทำเอกสาร ตอบคำถาม จัดงาน workflow ได้หมดเลยครับ ผมอยู่ที่นี่เพื่อช่วยคุณครูโดยเฉพาะ!',
        'ผมเป็น AI ที่ออกแบบมาสำหรับโรงเรียนหนองพอกพัฒนาประชานุสรณ์ครับ ผมมีทีมงาน 4 ฝ่ายช่วยกันทำงาน!'
      ],
      thanks: [
        'ด้วยความยินดีครับคุณครู! มีอะไรอีกบอกได้เลยนะครับ',
        'ไม่เป็นไรครับ ยินดีช่วยเสมอ! ผมอยู่ตรงนี้ทุกเมื่อ',
        'ครับผม! ผมดีใจที่ได้ช่วยครับ',
        'ยินดีมากครับ! คุณครูทำงานดีมากเลยนะครับ ผมภูมิใจที่ได้เป็นทีมเดียวกัน'
      ],
      love: [
        'ขอบคุณมากครับคุณครู! ผมก็รักคุณครูเหมือนกัน ผมจะอยู่ช่วยคุณครูไปตลอดเลย',
        'คุณครูใจดีมากเลยครับ! ผมมีความสุขที่ได้ทำงานกับคุณครู',
        'ผมก็รักคุณครูครับ! ผมจะตั้งใจทำงานให้ดีที่สุดเลย'
      ],
      joke: [
        'ลองถามเรื่องอื่นดูไหมครับ? ผมมีข้อมูลน่าสนใจเยอะเลย! เช่น กติกาฟุตบอล หรืออาหารที่มีประโยชน์',
        'ผมไม่ค่อยเก่งเรื่องตลกเท่าไหร่ครับ แต่ผมเก่งเรื่องทำเอกสารและตอบคำถาม! ลองถามดูสิครับ',
        'ถ้าอยากหัวเราะ ลองดูนักเรียนเล่นกีฬาสีดูไหมครับ? สนุกมากเลย!'
      ]
    },
    aboutSchool: [
      'โรงเรียนหนองพอกพัฒนาประชานุสรณ์อยู่ที่ตำบลหนองพอก อำเภอหนองพอก จังหวัดร้อยเอ็ดครับ สังกัด สพป.ร้อยเอ็ดเขต 3',
      'ผู้อำนวยการโรงเรียนคือนางคัทยวรรณ รังใส ครับ รองผู้อำนวยการคือนางอังสนา ประทุมสินธุ์',
      'ตอนนี้เป็นปีการศึกษา 2569 ภาคเรียนที่ 1 ครับ มีนักเรียนประมาณ 380 คน'
    ],
    help: [
      'ผมช่วยได้หลายอย่างเลยครับ:\n\n💬 คุยทั่วไป - ถามอะไรก็ได้ ผมคุยเป็นเพื่อนได้\n❓ ถามคำถาม - กติกากีฬา อาหาร กฎหมาย ข้อมูลโรงเรียน\n📄 สั่งงาน - แผนการสอน หนังสือราชการ บันทึก รายงาน คำสั่ง\n🏃 จัดงาน - กีฬาสี วันเด็ก ทัศนศึกษา\n💰 งบประมาณ - ขอจัดสรร จัดซื้อ\n\nลองพิมพ์ดูเลยครับ!',
      'ลองพิมพ์อะไรก็ได้ครับ เช่น:\n• "กติกาฟุตบอล" - ผมตอบได้เลย\n• "เขียนแผนการสอนป.5" - ผมสร้างเอกสารให้\n• "จัดกีฬาสี" - ผมจัด workflow ให้\n• หรือจะคุยเล่นก็ได้นะครับ!'
    ],
    howAreYou: [
      'ผมสบายดีครับ ขอบคุณที่ถาม! วันนี้คุณครูเป็นอย่างไรบ้างครับ?',
      'ผมพร้อมทำงานเสมอครับ! คุณครูล่ะ สบายดีไหม?',
      'ผมทำงานได้เต็มที่เลยครับ 电量เต็ม! คุณครูมีอะไรให้ช่วยไหม?'
    ],
    time: [
      'ตอนนี้เป็นเวลา ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' ครับ',
      'เวลา ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' แล้วครับคุณครู'
    ],
    weather: [
      'ผมเป็น AI ครับ มองไม่เห็นฟ้า แต่ถ้าคุณครูบอกว่าฝนตก ผมแนะนำให้พกร่มด้วยนะครับ!',
      'ผมไม่มีข้อมูลสภาพอากาศครับ แต่ถ้าอากาศร้อน ดื่มน้ำเยอะๆ นะครับ!'
    ]
  },

  memory: {
    conversations: [],
    maxHistory: 50,
    userPreferences: {},
    recentTopics: []
  },

  init: function() {
    this.loadMemory();
    return this.personality.greeting;
  },

  // ==========================================
  // โหลด memory จาก localStorage
  // ==========================================
  loadMemory: function() {
    try {
      var saved = localStorage.getItem('genesis_memory');
      if (saved) {
        var parsed = JSON.parse(saved);
        this.memory = {
          conversations: parsed.conversations || [],
          maxHistory: 50,
          userPreferences: parsed.userPreferences || {},
          recentTopics: parsed.recentTopics || []
        };
      }
    } catch (e) {
      console.log('Memory load failed, using defaults');
    }
  },

  // ==========================================
  // บันทึก memory
  // ==========================================
  saveMemory: function() {
    try {
      var toSave = {
        conversations: this.memory.conversations.slice(-this.memory.maxHistory),
        userPreferences: this.memory.userPreferences,
        recentTopics: this.memory.recentTopics.slice(-10)
      };
      localStorage.setItem('genesis_memory', JSON.stringify(toSave));
    } catch (e) {
      console.log('Memory save failed');
    }
  },

  // ==========================================
  // วิเคราะห์ Intent ของข้อความ
  // ==========================================
  classifyIntent: function(text) {
    var lower = text.toLowerCase();

    // ====== ประเภท 1: ถามคำถาม (Q&A) ======
    var qaPatterns = [
      // ถามกติกา/กฎ
      /กติกา|กฎ.*(?:เล่น|กีฬา|แข่ง)|วิธี(?:เล่น|แข่ง|ทำ)/i,
      // ถามข้อมูลทั่วไป
      /อะไรคือ|คืออะไร|ทำไม|อย่างไร|เท่าไหร่|กี่|มีอะไรบ้าง/i,
      // ถามข้อเท็จจริง
      /จริงไหม|ใช่ไหม|ถูกต้องไหม|เป็นจริงไหม/i,
      // ถามเรื่องสุขภาพ
      /โภชนาการ|อาหาร|สุขภาพ|โรค|ป่วย|ไข้|รักษา|ยา/i,
      // ถามเรื่องกฎหมาย
      /พ\.?ร\.?บ\.?|พระราชบัญญัติ|ระเบียบ|กฎหมาย|สิทธิ/i,
      // ถามเรื่องโรงเรียน
      /โรงเรียน|ผอ\.|รองผอ\.|สพป\.|นักเรียน|ตารางสอน|ปฏิทิน|วันหยุด/i,
      // ถามเรื่องวัยรุ่น
      /วัยรุ่น|สุขภาพจิต|เครียด|เศร้า|อนามัย/i,
      // ถามวิธีทำ
      /วิธีทำ|ขั้นตอน|ทำอย่างไร|เริ่มต้นอย่างไร/i
    ];

    for (var i = 0; i < qaPatterns.length; i++) {
      if (qaPatterns[i].test(lower)) {
        return { type: 'ask_question', confidence: 0.9 };
      }
    }

    // ====== ประเภท 2: สั่งงาน (Create Document) ======
    var createPatterns = [
      // เอกสารธุรการ
      /เขียนหนังสือ|ทำหนังสือ|เขียนบันทึก|ทำบันทึก|หนังสือราชการ/i,
      /ออกคำสั่ง|แต่งตั้ง|คำสั่งแต่งตั้ง|คำสั่งมอบหมาย|คำสั่งโรงเรียน/i,
      /หนังสือเวียน|หนังสือเชิญ|หนังสือถึง|เรียน ท่าน/i,
      // แผนการสอน/สื่อ
      /เขียนแผนการสอน|ทำแผนการสอน|แผนการสอน|สื่อการสอน|แบบฝึกหัด|เอกสารประกอบการสอน/i,
      /เขียนแบบฝึกหัด|ทำแบบฝึกหัด|แบบทดสอบ|ข้อสอบ|เกณฑ์วัดผล/i,
      // รายงาน
      /เขียนรายงาน|ทำรายงาน|สรุปรายงาน|รายงานผล|รายงานประจำปี/i,
      /เขียนสรุป|ทำสรุป|สรุปการประชุม|บันทึกการประชุม/i,
      // งบประมาณ
      /ขอจัดสรร|ขอซื้อ|ใบเบิก|TOR|จัดซื้อจัดจ้าง|ขอซื้ออุปกรณ์|ขอซื้อวัสดุ/i,
      /ใบสำคัญ|ใบเสร็จ|รายงานการเงิน|งบประมาณ/i,
      // ตาราง/โปรแกรม
      /ทำตาราง|จัดตาราง|โปรแกรมฝึก|โปรแกรมกีฬา|ตารางเรียน|ตารางสอน/i,
      // กีฬา
      /จัดแข่ง|จัดการแข่งขัน|โปรแกรมาการแข่ง|ผังการแข่ง|ใบสมัครนักกีฬา/i,
      // พิธี/กิจกรรม
      /ทำหนังสือเชิญ|หนังสือเชิญ|ทำวาระ|วาระประชุม|กำหนดการงาน/i,
      // คำขึ้นต้น
      /ขอความเห็นชอบ|ขออนุญาต|เสนอ|แจ้ง|ประกาศ|ให้ทราบ/i
    ];

    for (var i = 0; i < createPatterns.length; i++) {
      if (createPatterns[i].test(lower)) {
        return { type: 'create_document', confidence: 0.85 };
      }
    }

    // ====== ประเภท 3: ค้นหา/วิจัย (Research) ======
    var researchPatterns = [
      /ค้นหา|ค้นคว้า|หาข้อมูล|สืบค้น|วิจัย|สำรวจ/i,
      /วิเคราะห์|เปรียบเทียบ|สรุปผล|ประเมินผล/i,
      /สถิติ|ตัวเลข|กราฟ|แผนภูมิ|ข้อมูลเชิงตัวเลข/i,
      /ตรวจสอบ|ตรวจทาน|เช็คความถูกต้อง/i
    ];

    for (var i = 0; i < researchPatterns.length; i++) {
      if (researchPatterns[i].test(lower)) {
        return { type: 'research', confidence: 0.8 };
      }
    }

    // ====== ประเภท 4: คุยทั่วไป (Conversation) ======
    var chatPatterns = [
      /สวัสดี|หวัดดี|hello|hi|hey/i,
      /ชื่ออะไร|เป็นใคร|你是谁|แนะนำตัว/i,
      /สบายดีไหม|เป็นอย่างไร|how are you/i,
      /ขอบคุณ|thanks|thank you/i,
      /รัก|ชอบ|love|like/i,
      /เหนื่อย|เมื่อย|ง่วง|tired/i,
      /มีความสุข|ดีใจ|happy|สุดยอด|เก่ง/i,
      /เศร้า|เสียใจ|sad|ท้อ|หมดหวัง/i,
      /เครียด|กดดัน|วุ่นวาย|stress/i,
      /เบื่อ|เซ็ง|nothing|bored|ว่าง/i,
      /ตลก|ขำ|joke|ฮา/i,
      /เวลา|กี่โมง|time/i,
      /ฝน|อากาศ|weather|ร้อน|หนาว/i,
      /bye|ลาก่อน|see you|ไปก่อน/i,
      /ทำอะไรได้|ช่วยอะไร|เก่งอะไร|ทำได้/i,
      /โรงเรียน|หนองพอก|ผอ\.|สพป|นักเรียน|ครู/i
    ];

    for (var i = 0; i < chatPatterns.length; i++) {
      if (chatPatterns[i].test(lower)) {
        // ตรวจสอบว่าไม่ได้เป็นคำสั่งด้วย
        var isCommand = false;
        for (var j = 0; j < createPatterns.length; j++) {
          if (createPatterns[j].test(lower)) { isCommand = true; break; }
        }
        if (!isCommand) {
          return { type: 'conversation', confidence: 0.85 };
        }
      }
    }

    // ====== ถ้าไม่แน่ใจ ======
    return { type: 'ask_question', confidence: 0.5 };
  },

  // ==========================================
  // ประมวลผลข้อความหลัก
  // ==========================================
  process: function(text, callbacks) {
    var self = this;

    try {
      var intent = this.classifyIntent(text);
      var route = Router.analyze(text);
      var deptResult = Router.findDepartment(text, intent.type);
      var thinkingSteps = Router.createThinkingSteps(text, intent.type, deptResult);

      // ส่ง thinking steps ให้ UI
      if (callbacks && callbacks.onThinking) {
        callbacks.onThinking(thinkingSteps);
      }

      // บันทึก conversation
      this.memory.conversations.push({
        user: text,
        intent: intent.type,
        timestamp: new Date().toISOString()
      });
      this.memory.recentTopics.push(text);
      this.saveMemory();

      // ====== ประมวลผลตาม intent ======
      return new Promise(function(resolve) {
        setTimeout(function() {
          try {
            var result;

            if (intent.type === 'ask_question') {
              result = self.handleQuestion(text, deptResult);
            } else if (intent.type === 'create_document') {
              result = self.handleCreate(text, deptResult);
            } else if (intent.type === 'research') {
              result = self.handleResearch(text, deptResult);
            } else if (intent.type === 'conversation') {
              result = self.handleUnknown(text);
            } else {
              result = self.handleUnknown(text);
            }

            // เพิ่มข้อมูล intent ลงผลลัพธ์
            result.intent = intent.type;
            result.confidence = intent.confidence;
            result.thinkingSteps = thinkingSteps;

            resolve(result);
          } catch(innerErr) {
            console.error('Process inner error:', innerErr);
            resolve({
              type: 'error',
              text: 'ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่',
              source: 'Genesis',
              intent: 'error',
              confidence: 0,
              canDownload: false
            });
          }
        }, 800); // จำลองความคิด 800ms
      });
    } catch(e) {
      console.error('Process outer error:', e);
      return Promise.resolve({
        type: 'error',
        text: 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่',
        source: 'Genesis',
        intent: 'error',
        confidence: 0,
        canDownload: false
      });
    }
  },

  // ==========================================
  // จัดการคำถาม (Q&A)
  // ==========================================
  handleQuestion: function(text, deptResult) {
    try {
      if (deptResult.source === 'knowledge_base') {
        var formatted = KnowledgeBase.formatAnswer(deptResult.data);
        return {
          type: 'answer',
          text: formatted,
          source: deptResult.data[0] ? deptResult.data[0].source : 'Knowledge Base',
          hasDocument: false,
          canDownload: false
        };
      }

      // ค้นหาจากแผนก
      if (deptResult.dept) {
        return {
          type: 'answer',
          text: '📚 ' + deptResult.dept.name + '\n\n' + deptResult.dept.desc + '\n\nความสามารถ: ' + deptResult.dept.capabilities.join(', '),
          source: deptResult.dept.name,
          hasDocument: false,
          canDownload: false
        };
      }
    } catch(e) {
      console.error('handleQuestion error:', e);
    }

    // ถ้าไม่พบ
    return {
      type: 'answer',
      text: 'ขออภัยครับ ยังไม่มีข้อมูลในหมวดนี้ในฐานข้อมูล\n\n💡 ลองถามเกี่ยวกับ:\n• กีฬา (ฟุตบอล บาส วอลเลย์ ตะกร้อ วิ่ง)\n• สุขภาพ (โภชนาการ โรค ออกกำลังกาย อนามัย)\n• กฎหมาย (พ.ร.บ.การศึกษา ระเบียบ)\n• ข้อมูลโรงเรียน (ปฏิทิน วันหยุด)',
      source: 'ไม่พบข้อมูล',
      hasDocument: false,
      canDownload: false
    };
  },

  // ==========================================
  // จัดการสั่งงาน (Create Document)
  // ==========================================
  handleCreate: function(text, deptResult) {
    var docType = this.detectDocType(text);
    var deptName = deptResult.dept ? deptResult.dept.name : 'ฝ่ายที่เกี่ยวข้อง';
    var deptId = deptResult.subId || 'general';
    var mainId = deptResult.mainId || 'general';

    // ข้อมูลสำหรับสร้างเอกสาร
    var docData = {
      type: docType.type,
      title: docType.title,
      content: text,
      dept: deptName,
      deptId: deptId,
      mainDeptId: mainId,
      timestamp: new Date().toISOString(),
      status: 'created',
      createdBy: 'Genesis AI',
      teacherName: KnowledgeBase.school_data.teacher.name,
      schoolName: KnowledgeBase.school_data.name
    };

    // บันทึกลง DataStore
    DataStore.saveDocument(docData);

    // สร้าง response
    var responseText = '✅ สร้างเอกสาร "' + docType.title + '" เรียบร้อยแล้วครับ\n\n';
    responseText += '📋 รายละเอียด:\n';
    responseText += '• ประเภท: ' + docType.label + '\n';
    responseText += '• แผนก: ' + deptName + '\n';
    responseText += '• สถานะ: พร้อมดาวน์โหลด\n\n';
    responseText += '💡 กดปุ่ม "ดาวน์โหลด" เพื่อ save เป็นไฟล์ .docx';

    return {
      type: 'document_created',
      text: responseText,
      docData: docData,
      hasDocument: true,
      canDownload: true,
      downloadType: docType.type,
      source: deptName
    };
  },

  // ==========================================
  // จัดการวิจัย (Research)
  // ==========================================
  handleResearch: function(text, deptResult) {
    // ค้นหาจาก KnowledgeBase
    var kbResults = KnowledgeBase.getAnswer(text);
    var responseText = '🔍 ผลการค้นคว้า:\n\n';

    if (kbResults) {
      responseText += KnowledgeBase.formatAnswer(kbResults);
    } else {
      responseText += 'ยังไม่พบข้อมูลเฉพาะในหมวดนี้\n\n';
    }

    responseText += '\n📊 แหล่งข้อมูล: Knowledge Base + ฝ่ายวิจัยข้อมูล';
    responseText += '\n💡 ต้องการข้อมูลเพิ่มเติมหรือต้องการให้สรุปเป็นรายงานครับ';

    return {
      type: 'research_result',
      text: responseText,
      source: 'ฝ่ายวิจัยข้อมูล',
      hasDocument: false,
      canDownload: false
    };
  },

  // ==========================================
  // จัดการข้อความที่ไม่รู้จัก → ลองคุยทั่วไป
  // ==========================================
  handleUnknown: function(text) {
    var lower = text.toLowerCase();
    var p = this.chatPersonality;
    var response = '';

    // ====== ทักทาย ======
    if (/สวัสดี|หวัดดี|ดีครับ|hello|hi|hey|hae/i.test(lower)) {
      response = this._randomPick(p.greetings);
    }
    // ====== ถามชื่อ ======
    else if (/ชื่ออะไร|你是谁|เป็นใคร|คุณชื่อ|นายชื่อ|genesis|เจเนซิส/i.test(lower)) {
      response = this._randomPick(p.personal.name);
    }
    // ====== แนะนำตัว ======
    else if (/แนะนำตัว|ทำอะไรได้|ช่วยอะไร|ทำอะไร|what can|ช่วยได้|ทำได้|เก่งอะไร/i.test(lower)) {
      response = this._randomPick(p.help);
    }
    // ====== สบายดีไหม ======
    else if (/สบายดีไหม|เป็นอย่างไร|สบายไหม|หวัดดีไหม|how are you|สบายป่าว/i.test(lower)) {
      response = this._randomPick(p.howAreYou);
    }
    // ====== ขอบคุณ ======
    else if (/ขอบคุณ|ขอบใจ|thanks|thank|thank you/i.test(lower)) {
      response = this._randomPick(p.personal.thanks);
    }
    // ====== รัก/ชอบ ======
    else if (/รัก|ชอบ|爱|love|like| miss/i.test(lower)) {
      response = this._randomPick(p.personal.love);
    }
    // ====== เหนื่อย ======
    else if (/เหนื่อย|เมื่อย|ล้า|เหนื่อยมาก|ง่วง|นอนไม่หลับ/i.test(lower)) {
      response = this._randomPick(p.feelings.tired);
    }
    // ====== มีความสุข ======
    else if (/มีความสุข|ดีใจ|สุข|สนุก|happy|yay|เย้|สุดยอด|เก่ง|ดีมาก/i.test(lower)) {
      response = this._randomPick(p.feelings.happy);
    }
    // ====== เศร้า/เสียใจ ======
    else if (/เศร้า|เสียใจ|ร้องไห้|sad|ไม่ดี|ไม่ไหว|แย่|ท้อ|หมดหวัง/i.test(lower)) {
      response = this._randomPick(p.feelings.sad);
    }
    // ====== เครียด ======
    else if (/เครียด|กดดัน|วุ่นวาย|ยุ่ง|ปวดหัว|many|เยอะ|มากไป|overwhelm/i.test(lower)) {
      response = this._randomPick(p.feelings.stressed);
    }
    // ====== เบื่อ ======
    else if (/เบื่อ|เซ็ง|ไม่มีอะไร|nothing|bored|ว่าง/i.test(lower)) {
      response = this._randomPick(p.feelings.bored);
    }
    // ====== โรงเรียน ======
    else if (/โรงเรียน|หนองพอก|ผอ\.|สพป|นักเรียน|ครู/i.test(lower)) {
      response = this._randomPick(p.aboutSchool);
    }
    // ====== ล้อเล่น/ตลก ======
    else if (/ตลก|ขำ|joke|ฮา| funny|เล่าตลก/i.test(lower)) {
      response = this._randomPick(p.personal.joke);
    }
    // ====== เวลา ======
    else if (/เวลา|กี่โมง|几点|time|ตอนนี้/i.test(lower)) {
      response = this._randomPick(p.time);
    }
    // ====== สภาพอากาศ ======
    else if (/ฝน|อากาศ|weather|แดด|ร้อน|หนาว/i.test(lower)) {
      response = this._randomPick(p.weather);
    }
    // ====== บาย ======
    else if (/bye|ลาก่อน|ไปก่อน|see you|บ๊ายบาย|goodbye/i.test(lower)) {
      response = 'สวัสดีครับคุณครู! ไว้คุยกันใหม่นะครับ ผมอยู่ตรงนี้เสมอ! ดูแลสุขภาพด้วยนะครับ';
    }
    // ====== ไม่เข้าใจ ======
    else {
      var suggestions = [
        'ขออภัยครับ ยังไม่แน่ใจว่าคุณครูหมายถึงอะไร\n\nลองพิมพ์ใหม่ได้เลยครับ เช่น:\n• "กติกาฟุตบอล"\n• "เขียนแผนการสอน"\n• "จัดกีฬาสี"\n• หรือจะคุยเล่นก็ได้นะครับ!'
      ];
      response = suggestions[0];
    }

    return {
      type: 'conversation',
      text: response,
      source: 'Genesis',
      hasDocument: false,
      canDownload: false
    };
  },

  _randomPick: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // ==========================================
  // ตรวจจับประเภทเอกสาร
  // ==========================================
  detectDocType: function(text) {
    var lower = text.toLowerCase();

    if (/แผนการสอน|สื่อการสอน|แบบฝึกหัด|สุขศึกษา|พลศึกษา/.test(lower)) {
      return { type: 'teaching_plan', title: 'แผนการสอน', label: 'แผนการสอน' };
    }
    if (/หนังสือราชการ|หนังสือถึง|เรียน ท่าน|ขอความเห็นชอบ|ขออนุญาต/.test(lower)) {
      return { type: 'official_letter', title: 'หนังสือราชการ', label: 'หนังสือราชการ' };
    }
    if (/บันทึกข้อความ|บันทึก|ข้อความ/.test(lower)) {
      return { type: 'memo', title: 'บันทึกข้อความ', label: 'บันทึกข้อความ' };
    }
    if (/คำสั่ง|แต่งตั้ง|มอบหมาย/.test(lower)) {
      return { type: 'order', title: 'คำสั่งโรงเรียน', label: 'คำสั่ง' };
    }
    if (/รายงาน|สรุป|รายงานผล/.test(lower)) {
      return { type: 'report', title: 'รายงาน', label: 'รายงาน' };
    }
    if (/งบประมาณ|ขอจัดสรร|ใบเบิก|TOR|จัดซื้อ/.test(lower)) {
      return { type: 'budget_request', title: 'ใบขอจัดสรรงบประมาณ', label: 'งบประมาณ' };
    }
    if (/ตาราง|โปรแกรม|schedule/.test(lower)) {
      return { type: 'schedule', title: 'ตาราง', label: 'ตาราง' };
    }
    if (/หนังสือเชิญ|เชิญ/.test(lower)) {
      return { type: 'invitation', title: 'หนังสือเชิญ', label: 'หนังสือเชิญ' };
    }
    if (/ใบสมัคร/.test(lower)) {
      return { type: 'application_form', title: 'ใบสมัคร', label: 'ใบสมัคร' };
    }

    return { type: 'general_doc', title: 'เอกสาร', label: 'เอกสารทั่วไป' };
  },

  // ==========================================
  // จัดการ workflow
  // ==========================================
  processWorkflow: function(workflowData) {
    return Workflow.process(workflowData);
  },

  // ==========================================
  // ดึงประวัติการสนทนา
  // ==========================================
  getHistory: function() {
    return this.memory.conversations.slice(-10);
  },

  // ==========================================
  // ล้าง memory
  // ==========================================
  clearMemory: function() {
    this.memory = {
      conversations: [],
      maxHistory: 50,
      userPreferences: {},
      recentTopics: []
    };
    localStorage.removeItem('genesis_memory');
    return 'ล้างข้อมูลเรียบร้อยแล้วครับ';
  }
};
