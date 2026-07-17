var KnowledgeBase = {
  version: '1.0.0',
  lastUpdate: new Date().toISOString(),

  sports_rules: {
    football: {
      name: 'กติกาฟุตบอล',
      icon: '⚽',
      summary: 'ฟุตบอลเป็นกีฬาที่นิยมที่สุดในโลก แข่งขันระหว่าง 2 ทีม ทีมละ 11 คน',
      field: {
        length: '90-120 เมตร',
        width: '45-90 เมตร',
        goalWidth: '7.32 เมตร',
        goalHeight: '2.44 เมตร',
        penaltyArea: '16.5 x 40.32 เมตร',
        goalArea: '5.5 x 18.32 เมตร',
        centerCircle: 'รัศมี 9.15 เมตร',
        cornerArc: 'รัศมี 1 เมตร'
      },
      players: {
        perTeam: 11,
        goalkeeper: 1,
        minimumToStart: 7,
        substitutes: 'สูงสุด 5 คน (เปลี่ยนได้ 3 ครั้งระหว่างเกม, เปลี่ยนได้เพิ่มในช่วงต่อเวลา)',
        position: 'ผู้รักษาประตู, กองหลัง, กองกลาง, กองหน้า'
      },
      match: {
        duration: '90 นาที (2 ครึ่ง ครึ่งละ 45 นาที)',
        halftime: 'พักครึ่งไม่เกิน 15 นาที',
        extraTime: 'ต่อเวลาพิเศษครึ่งละ 15 นาที รวม 30 นาที',
        penaltyShootout: 'ยิงจุดโทษ ทีมละ 5 คน ถ้าเสมอยิงต่อคนละ 1 คน',
        referee: 'ผู้ตัดสิน 1 คน + ผู้ช่วยผู้ตัดสิน 2 คน (วิดีโอช่วยตัดสิน VAR ในบางลีก)'
      },
      ball: {
        circumference: '68-70 ซม.',
        pressure: '0.6-1.1 บาร์',
        weight: '410-450 กรัม'
      },
      rules: [
        { id: 'offside', title: 'ล้ำหน้า', desc: 'ผู้เล่นที่อยู่ใกล้เส้นประตูฝั่งตรงข้ามมากกว่าทั้งลูกบอลและผู้เล่นฝ่ายตรงข้ามคนที่สอง (ไม่รวมผู้รักษาประตู) เมื่อฝ่ายตรงข้ามส่งลูกให้ จะถือว่าล้ำหน้า ยกเว้นอยู่ในเขตตัวเอง หรืออยู่ level กับผู้เล่นคนที่สอง' },
        { id: 'foul', title: 'ทำฟาวล์', desc: 'เตะ เตะโด่ง ผลัก ดัน ชน ดึง สกัด ขัดขา กระโดดชน ใช้มือแตะบอล (นอกเหนือจากผู้รักษาประตูในเขตโทษ)' },
        { id: 'penalty', title: 'จุดโทษ', desc: 'ทำฟาวล์ในเขตโทษของทีมตัวเอง ทีมตรงข้ามได้ลูกจุดโทษ ยิงจากจุดโทษห่างประตู 11 เมตร' },
        { id: 'yellow_card', title: 'ใบเหลือง', desc: 'ใบเตือน ผู้เล่นได้ 2 ใบเหลือง = ใบแดง ถูกไล่ออก' },
        { id: 'red_card', title: 'ใบแดง', desc: 'ไล่ออก ผู้เล่นเหลือ 10 คน ห้ามเปลี่ยนตัวแทน' },
        { id: 'throw_in', title: 'ทุ่มบอล', desc: 'บอลออกเส้นข้าง ทุ่มด้วยสองมือจากด้านหลังศีรษะ ยืนสองเท้าบนพื้น ห้ามยืนบนเส้น' },
        { id: 'goal_kick', title: 'เตะจากประตู', desc: 'ฝ่ายรุกเตะออกเส้นหลังประตู ฝ่ายรับเตะจากหน้าประตู' },
        { id: 'corner', title: 'เตะมุม', desc: 'ฝ่ายรับเตะออกเส้นหลังประตูตัวเอง ฝ่ายรุกเตะมุม' },
        { id: 'free_kick', title: 'เตะโทษ', desc: 'เตะโทษตรงจุดที่ทำฟาวล์ มี 2 แบบ: ตรง (เตะตรง) และ อ้อม (ตั้งกำแพง)' },
        { id: 'back_pass', title: 'ส่งกลับผู้รักษาประตู', desc: 'ถ้าส่งบอลด้วยเท้ากลับผู้รักษาประตู ห้ามประตูใช้มือรับ ต้องเตะด้วยเท้า' }
      ],
      formations: [
        { name: '4-4-2', desc: 'สมดุลดีที่สุด เน้นรับและรุกสม่ำเสมอ', players: '4 กองหลัง, 4 กองกลาง, 2 กองหน้า' },
        { name: '4-3-3', desc: 'เน้นเกมรุก มีปีก 3 คน', players: '4 กองหลัง, 3 กองกลาง, 3 กองหน้า' },
        { name: '3-5-2', desc: 'เน้นครองบอล ปีกมีบทบาทสำคัญ', players: '3 กองหลัง, 5 กองกลาง (มีปีก), 2 กองหน้า' },
        { name: '4-2-3-1', desc: 'สมัยใหม่ ยืดหยุ่น มีเพลย์เมคเกอร์', players: '4 กองหลัง, 2 กองกลางตัวรับ, 3 กองกลางตัวรุก, 1 กองหน้า' }
      ],
      thai_facts: [
        'ลีกสูงสุดของไทยคือ รีโว่ ไทยลีก',
        'ทีมชาติไทยเคยได้แชมป์ AFF Championship 7 สมัย',
        'สนามราชมังคลากีจานีสามารถจุคนได้ 65,000 คน',
        'สมาคมกีฬาฟุตบอลแห่งประเทศไทยก่อตั้งเมื่อ พ.ศ. 2459'
      ]
    },
    basketball: {
      name: 'กติกาบาสเกตบอล',
      icon: '🏀',
      summary: 'บาสเกตบอลแข่งขันระหว่าง 2 ทีม ทีมละ 5 คน ยิงลูกเข้าห่วง',
      court: {
        length: '28 เมตร',
        width: '15 เมตร',
        rimHeight: '3.05 เมตร',
        threePointLine: '6.75 เมตร (FIBA)',
        freeThrowLine: '4.6 เมตรจากห่วง',
        keyArea: '4.9 x 5.8 เมตร'
      },
      players: {
        perTeam: 5,
        minimumToStart: 4,
        substitutes: 'เปลี่ยนได้ไม่จำกัด ระหว่างหยุดเกม'
      },
      game: {
        duration: '40 นาที (4 ควอเตอร์ ควอเตอร์ละ 10 นาที)',
        quarterBreak: '2 นาที',
        halftime: '15-20 นาที',
        overtime: 'ต่อเวลา 5 นาที',
        shotClock: '24 วินาที',
        backcourt: '10 วินาที',
        timeout: 'ทีมละ 7 ครั้งต่อเกม'
      },
      scoring: {
        freeThrow: '1 แต้ม',
        insideThreePoint: '2 แต้ม',
        threePoint: '3 แต้ม'
      },
      rules: [
        { id: 'dribble', title: 'การเลี้ยงลูก', desc: 'ต้องเลี้ยงลูกด้วยมือเดียวหรือสองมือสลับกัน ห้ามเลี้ยงซ้ำ' },
        { id: 'travel', title: 'เดินถือลูก', desc: 'ถือลูกแล้วก้าวเท้าได้ไม่เกิน 2 ก้าว (gather step)' },
        { id: 'foul', title: 'ฟาวล์', desc: 'สัมผัสร่างกายที่ไม่ถูกกฎ ได้ 2 ฟาวล์พัก ผู้เล่น 5 ฟาวล์ออก' },
        { id: 'tech', title: 'Technical Foul', desc: 'แสดงท่าทีไม่เหมาะสม หรือขัดจังหวะเกม' },
        { id: 'block', title: 'บล็อก', desc: 'ขวางทางผู้เล่นที่ไม่มีลูก ต้องยืนนิ่ง' },
        { id: 'charge', title: 'ชาร์จ', desc: 'ผู้เล่นที่มีลูกชนผู้เล่นที่ยืนนิ่ง = ฟาวล์ฝ่ายมีลูก' }
      ],
      thai_facts: [
        'บาสเกตบอลไทยมีลีก TBL และ Thailand Basketball League',
        'ทีมชาติไทยเคยได้แชมป์ SEABA Championship',
        'สนามที่ใช้แข่งต้องได้มาตรฐาน FIBA'
      ]
    },
    volleyball: {
      name: 'กติกาวอลเลย์บอล',
      icon: '🏐',
      summary: 'วอลเลย์บอลแข่งขันระหว่าง 2 ทีม ทีมละ 6 คน ตีลูกข้ามเน็ต',
      court: {
        length: '18 เมตร',
        width: '9 เมตร',
        netHeightMen: '2.43 เมตร',
        netHeightWomen: '2.24 เมตร',
        attackLine: '3 เมตรจากเน็ต',
        freeZone: 'ริมสนาม 3 เมตร'
      },
      players: {
        perTeam: 6,
        minimumToStart: 4,
        libero: 'ผู้เล่นพิเศษ ใส่เสื้อสีต่าง รับลูกได้ดี ห้ามบล็อกและเสิร์ฟ',
        substitutes: 'เปลี่ยนได้ 6 ครั้งต่อเซต'
      },
      game: {
        sets: 'ดีที่สุดใน 5 เซต',
        pointsPerSet: '25 คะแนน (ต้องนำ 2 คะแนน)',
        tieBreak: 'เซตที่ 5 เล่น 15 คะแนน',
        serve: 'เสิร์ฟจากหลังเส้นสนาม'
      },
      scoring: {
        rally: 'ระบบ Rally Point - ทุกลูกมีแต้ม',
        in: 'ลูกตกในเส้น = มีแต้ม',
        out: 'ลูกออกนอกเส้น = อีกฝ่ายมีแต้ม'
      },
      rules: [
        { id: 'touch', title: 'สัมผัสลูก', desc: 'แตะลูกได้สูงสุด 3 ครั้งต่อทีมก่อนข้ามเน็ต' },
        { id: 'net', title: 'สัมผัสเน็ต', desc: 'ห้ามสัมผัสเน็ตขณะเล่นลูก' },
        { id: 'lift', title: 'ลifting', desc: 'ห้ามจับลูก (ต้องตี ไม่ใช่รับแบบจับ)' },
        { id: 'rotation', title: 'หมุนตำแหน่ง', desc: 'เมื่อได้แต้มจากเสิร์ฟ ต้องหมุนตำแหน่ง' },
        { id: 'block', title: 'บล็อก', desc: 'บล็อกได้โดยไม่ต้องรอให้ลูกข้ามเน็ต' },
        { id: 'back_row', title: 'ผู้เล่นหลัง', desc: 'ห้ามบล็อกและโจมตีจากหน้าเส้น 3 เมตร' }
      ],
      thai_facts: [
        'วอลเลย์บอลหญิงทีมชาติไทยเคยอันดับ 4 ชิงแชมป์เอเชีย',
        'ลีกวอลเลย์บอลไทยมีทั้งชายและหญิง',
        'วอลเลย์บอลเป็นกีฬายอดนิยมอันดับ 2 ของไทย'
      ]
    },
    sepak_takraw: {
      name: 'กติกาเซปักตะกร้อ',
      icon: '🟡',
      summary: 'เซปักตะกร้อกีฬาพื้นบ้านไทย แข่งขันระหว่าง 2 ทีม ทีมละ 3 คน',
      court: {
        length: '13.4 เมตร',
        width: '6.1 เมตร',
        netHeightMen: '1.52 เมตร',
        netHeightWomen: '1.42 เมตร',
        quarterCircle: 'รัศมี 0.3 เมตร ตรงมุมสนาม'
      },
      players: {
        perTeam: 3,
        positions: ' tekong (1 คน), กองหน้า (2 คน)',
        substitutes: 'เปลี่ยนได้ 3 ครั้งต่อเซต'
      },
      game: {
        sets: 'ดีที่สุดใน 3 เซต',
        pointsPerSet: '21 คะแนน นำ 2 คะแนน',
        tieBreak: 'เซตที่ 3 เล่น 15 คะแนน'
      },
      rules: [
        { id: 'kick', title: 'เตะ', desc: 'เตะลูกจากทุกส่วนของร่างกาย (ห้ามใช้แขน)' },
        { id: 'spin', title: 'หมุน', desc: 'ลูกต้องหมุนตามเข็มนาฬิกาตอนเตะข้ามเน็ต' },
        { id: 'block', title: 'บล็อก', desc: 'บล็อกได้ด้วยเข่าและเท้า' },
        { id: 'serve', title: 'เสิร์ฟ', desc: 'เตะจากวงกลมหลัง เสิร์ฟข้ามเน็ต' },
        { id: 'touch', title: 'สัมผัส', desc: 'แตะลูกได้สูงสุด 3 ครั้งก่อนข้ามเน็ต' }
      ],
      thai_facts: [
        'เซปักตะกร้อเป็นกีฬาประจำชาติไทย',
        'กีฬาตะกร้อมีมาตั้งแต่สมัยสุโขทัย',
        'ทีมชาติไทยเคยได้แชมป์โลกหลายสมัย'
      ]
    },
    running: {
      name: 'กติกาวิ่ง (กรีฑา)',
      icon: '🏃',
      summary: 'กรีฑา types: วิ่งเร็ว วิ่งกลาง วิ่งยาว วิ่งผลัด',
      types: [
        { name: 'วิ่ง 100 เมตร', desc: 'วิ่งเร็วที่สุด วัดความเร็วล้วนๆ' },
        { name: 'วิ่ง 200 เมตร', desc: 'วิ่งเร็ว 1 รอบสนาม' },
        { name: 'วิ่ง 400 เมตร', desc: 'วิ่งเร็ว 2 รอบสนาม วัดทั้งเร็วและอึด' },
        { name: 'วิ่ง 800 เมตร', desc: 'วิ่งกลาง วัดทั้งเร็วและอึด' },
        { name: 'วิ่ง 1500 เมตร', desc: 'วิ่งกลาง ต้องมีแผนการวิ่ง' },
        { name: 'วิ่ง 4x100 เมตร ผลัด', desc: 'ทีม 4 คน วิ่งผลัด คนละ 100 เมตร' },
        { name: 'วิ่ง 4x400 เมตร ผลัด', desc: 'ทีม 4 คน วิ่งผลัด คนละ 400 เมตร' }
      ],
      rules: [
        { id: 'false_start', title: 'ออกตัวก่อน', desc: 'ออกตัวก่อนสัญญาณ = ถูกปรับแพ้ 1 ครั้ง' },
        { id: 'lane', title: 'ช่องวิ่ง', desc: 'ห้ามวิ่งเข้าช่องคนอื่น (100-400 เมตร)' },
        { id: 'relay', title: 'ส่งไม้ผลัด', desc: 'ส่งไม้ในช่องรับ-ส่ง ถ้าตกต้องวิ่งกลับไปหยิบ' }
      ],
      thai_facts: [
        'สนามกรีฑามาตรฐานวิ่ง 400 เมตร 8 ช่องวิ่ง',
        'สุพิชญ์ ชูหงษ์ เคยได้แชมป์ SEA Games วิ่ง 100 เมตร'
      ]
    }
  },

  health_knowledge: {
    nutrition: {
      title: 'โภชนาการสำหรับเด็กวัยเรียน',
      foodGroups: [
        { group: 'ข้าวและธัญพืช', amount: '6-8 ทัพพี/วัน', examples: 'ข้าว ก๋วยเตี๋ยว ขนมปัง ข้าวโพด' },
        { group: 'ผัก', amount: '4-6 ทัพพี/วัน', examples: 'คะน้า กะหล่ำ ถั่วฝักยาว แครอท' },
        { group: 'ผลไม้', amount: '3-5 ที่/วัน', examples: 'กล้วย ส้ม มะม่วง แตงโม ฝรั่ง' },
        { group: 'เนื้อสัตว์', amount: '6-8 ช้อนโต๊ะ/วัน', examples: 'ไก่ ปลา หมู ไข่ เต้าหู้' },
        { group: 'นม', amount: '2-3 แก้ว/วัน', examples: 'นมสด โยเกิร์ต' },
        { group: 'น้ำมันและไขมัน', amount: '5-6 ช้อนชา/วัน', examples: 'น้ำมันพืช เนย' }
      ],
      tips: [
        'ดื่มน้ำวันละ 6-8 แก้ว',
        'กินอาหารเช้าทุกวัน',
        'ลดอาหารทอด อาหารมัน อาหารเค็ม',
        'ไม่กินจ๊บจ๊บระหว่างมื้อ',
        'กินผักผลไม้ทุกมื้อ'
      ]
    },
    exercise: {
      title: 'การออกกำลังกายสำหรับเด็ก',
      recommendation: 'ออกกำลังกายอย่างน้อย 60 นาที/วัน',
      types: [
        { type: 'หัวใจทำงาน', examples: 'วิ่ง ปั่นจักรยาน ว่ายน้ำ กระโดดเชือก', benefit: 'เสริมสร้างหัวใจ ปอด ระบบไหลเวียน' },
        { type: 'ความแข็งแรง', examples: 'วิดพื้น ซิทอัพ ยกน้ำหนัก (เบา)', benefit: 'เสริมสร้างกล้ามเนื้อ กระดูก' },
        { type: 'ความยืดหยุ่น', examples: 'ยืดเหยียด โยคะ', benefit: 'เพิ่มความยืดหยุ่น ป้องกันบาดเจ็บ' },
        { type: 'สมดุล', examples: 'ยืนข้างเดียว วิ่งบนเส้น', benefit: 'เสริมสร้างสมดุล ป้องกันล้ม' }
      ]
    },
    diseases: {
      title: 'โรคที่พบบ่อยในเด็ก',
      items: [
        { name: 'ไข้หวัด', symptoms: 'มีไข้ น้ำมูกไหล ไอ จาม', prevention: 'ล้างมือ หลีกเลี่ยงผู้ป่วย', treatment: 'พักผ่อน ดื่มน้ำ รับประทานยาตามแพทย์สั่ง' },
        { name: 'ไข้เลือดออก', symptoms: 'มีไข้สูง ปวดหัว ปวดกระดูก ผื่น', prevention: 'ป้องกันยุงกัด กำจัดแหล่งเพาะพันธุ์', treatment: 'พบแพทย์ทันที ดื่มน้ำมากๆ' },
        { name: 'ท้องร่วง', symptoms: 'ท้องเสีย อาเจียน มีไข้', prevention: 'กินอาหารสะอาด ดื่มน้ำสะอาด', treatment: 'ดื่มน้ำORS รับประทานยาตามแพทย์สั่ง' },
        { name: 'ตาแดง', symptoms: 'ตาแดง คัน เคืองตา', prevention: 'ไม่ใช้ของใช้ส่วนตัวร่วมกัน', treatment: 'หยอดตา ล้างหน้าบ่อยๆ' },
        { name: 'ผิวหนังอักเสบ', symptoms: 'ผื่น คัน แดง', prevention: 'รักษาความสะอาด ไม่ใช้ของร่วมกัน', treatment: 'ทาครีม รับประทานยาตามแพทย์สั่ง' }
      ]
    },
    puberty: {
      title: 'วัยรุ่นกับการเปลี่ยนแปลง',
      boys: [
        'เสียงแตก สูงขึ้น',
        'เริ่มมีหนวด',
        'ร่างกายสูงขึ้น กล้ามเนื้อเจริญ',
        'ผิวมัน เป็นสิว',
        'เหงื่อออกมากขึ้น'
      ],
      girls: [
        'เริ่มมีประจำเดือน',
        'สะโพกผาย',
        'หน้าอกเจริญ',
        'สูงขึ้น',
        'ผิวเปลี่ยน'
      ],
      advice: [
        'รักษาความสะอาด อาบน้ำวันละ 2 ครั้ง',
        'กินอาหารที่มีประโยชน์',
        'ออกกำลังกายสม่ำเสมอ',
        'พักผ่อนให้เพียงพอ',
        'ไม่เครียด ปรึกษาผู้ใหญ่เมื่อมีปัญหา'
      ]
    },
    mental_health: {
      title: 'สุขภาพจิตใจวัยรุ่น',
      signs: [
        'เศร้า ไม่มีสมาธิ เบื่อ',
        'นอนไม่หลับ หรือนอนมากเกินไป',
        'เบื่ออาหาร หรือกินมากเกินไป',
        'แยกตัวจากเพื่อน',
        'ผลการเรียนตก'
      ],
      tips: [
        'พูดคุยกับเพื่อน ครอบครัว ครู',
        'ออกกำลังกาย ทำกิจกรรมที่ชอบ',
        'จัดการเวลา ไม่กดดันตัวเองมากเกินไป',
        'หาใครสักคนไว้ใจ',
        'ปรึกษาจิตแพทย์เมื่อจำเป็น'
      ]
    },
    hygiene: {
      title: 'อนามัยส่วนบุคคล',
      daily: [
        'อาบน้ำวันละ 2 ครั้ง เช้า-เย็น',
        'แปรงฟันวันละ 2 ครั้ง เช้า-ก่อนนอน',
        'ตัดเล็บเป็นประจำ',
        'สระผมอย่างน้อยสัปดาห์ละ 2 ครั้ง',
        'เปลี่ยนเสื้อผ้าทุกวัน',
        'ล้างมือก่อนกินอาหาร'
      ],
      menstrual: {
        title: 'การดูแลตนเองในวัยมีประจำเดือน',
        tips: [
          'เปลี่ยนผ้าอนามัยทุก 3-4 ชั่วโมง',
          'ทำความสะอาดด้วยน้ำสะอาด',
          'จดวันที่มีประจำเดือน',
          'ออกกำลังกายเบาๆ ได้ตามปกติ',
          'กินอาหารที่มีธาตุเหล็ก'
        ]
      }
    }
  },

  thai_law: {
    education_act: {
      title: 'พระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542',
      sections: [
        { section: 'มาตรา 8', title: 'สิทธิการศึกษา', content: 'เด็กทุกคนมีสิทธิได้รับการศึกษาขั้นพื้นฐานฟรี 12 ปี (ป.1 ถึง ม.6)' },
        { section: 'มาตรา 10', title: 'ความเสมอภาค', content: 'บุคคลมีสิทธิได้รับการศึกษาโดยไม่เลือกชนชั้น วรรณะ ศาสนา เพศ สถานภาพทางเศรษฐกิจ สุขภาพ' },
        { section: 'มาตรา 12', title: 'การจัดการศึกษา', content: 'รัฐต้องจัดการศึกษาขั้นพื้นฐานให้ทั่วถึงและมีคุณภาพ' },
        { section: 'มาตรา 35', title: 'การประกันคุณภาพ', content: 'สถานศึกษาต้องจัดให้มีการประกันคุณภาพการศึกษา' }
      ]
    },
    labor_law: {
      title: 'พระราชบัญญัติคุ้มครองแรงงาน พ.ศ. 2541',
      sections: [
        { section: 'มาตรา 23', title: 'เวลาทำงาน', content: 'ห้ามให้ลูกจ้างทำงานเกินวันละ 8 ชั่วโมง หรือสัปดาห์ละ 40 ชั่วโมง' },
        { section: 'มาตรา 28', title: 'พักเบรก', content: 'ทำงานเกิน 5 ชั่วโมง ต้องพักอย่างน้อย 1 ชั่วโมง' },
        { section: 'มาตรา 29', title: 'วันหยุด', content: 'ลูกจ้างมีสิทธิหยุดพักผ่อนสัปดาห์ละ 1 วัน' }
      ]
    },
    school_management: {
      title: 'ระเบียบการบริหารงานในโรงเรียน',
      sections: [
        { section: 'คำสั่ง สพฐ.', title: 'งานธุรการ', content: 'หนังสือราชการต้องมีเลขที่หนังสือ ลงวันที่ ลงนาม ผู้รับผิดชอบ' },
        { section: 'ระเบียบกระทรวงศึกษาธิการ', title: 'งานงบประมาณ', content: 'การเบิกจ่ายเงินต้องมีใบสำคัญคู่กับใบเบิก หรือใบเสร็จรับเงิน' },
        { section: 'คำสั่ง สพป.', title: 'งานบุคลากร', content: 'การแต่งตั้ง โยกย้าย ครู ต้องมีคำสั่งจาก สพป. หรือ สพม.' }
      ]
    }
  },

  school_data: {
    name: 'โรงเรียนหนองพอกพัฒนาประชานุสรณ์',
    address: 'ตำบลหนองพอก อำเภอหนองพอก จังหวัดร้อยเอ็ด รหัสไปรษณีย์ 45210',
    organization: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาร้อยเอ็ด เขต 3',
    levels: 'อนุบาล - ป.6',
    students: 'ประมาณ 380 คน',
    academicYear: '2569',
    semester: '1',
    director: {
      name: 'นางคัทยวรรณ รังใส',
      position: 'ผู้อำนวยการโรงเรียน'
    },
    viceDirector: {
      name: 'นางอังสนา ประทุมสินธุ์',
      position: 'รองผู้อำนวยการโรงเรียน'
    },
    teacher: {
      name: 'นายนวพนธ์ ลอยละลิ่ว',
      position: 'ครู คศ.1',
      responsibilities: ['งานบริหารงานทั่วไป', 'งานกีฬา', 'งานอนามัย', 'งานกลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา'],
      subject: 'สุขศึกษาและพลศึกษา ป.1-ป.6',
      homeroom: 'ป.5/2'
    },
    academicCalendar: {
      semester1: {
        start: '16 พฤษภาคม 2569',
        end: '30 กันยายน 2569',
        midTermExam: 'สัปดาห์ที่ 8-9',
        finalExam: 'สัปดาห์ที่ 18-19'
      },
      semester2: {
        start: '1 พฤศจิกายน 2569',
        end: '28 กุมภาพันธ์ 2570',
        midTermExam: 'สัปดาห์ที่ 8-9',
        finalExam: 'สัปดาห์ที่ 18-19'
      }
    },
    holidays: [
      { date: 'พ.ค. 4', name: 'วันฉัตรมงคล' },
      { date: 'พ.ค. 11', name: 'วันพืชมงคล' },
      { date: 'มิ.ย. 3', name: 'วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี' },
      { date: 'ก.ค. 28', name: 'วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว' },
      { date: 'ส.ค. 12', name: 'วันเฉลิมพระชนมพรรษาสมเด็จพระบรมราชชนนีพันปีหลวง / วันแม่แห่งชาติ' },
      { date: 'ต.ค. 13', name: 'วันคล้ายวันสวรรคตพระบาทสมเด็จพระบรมชนกาธิเบศร' },
      { date: 'ต.ค. 23', name: 'วันปิยมหาราช' },
      { date: 'ธ.ค. 5', name: 'วันคล้ายวันพระบรมราชสมภพพระบาทสมเด็จพระบรมชนกาธิเบศร / วันพ่อแห่งชาติ' },
      { date: 'ธ.ค. 10', name: 'วันรัฐธรรมนูญ' },
      { date: 'ธ.ค. 28', name: 'วันคล้ายวันพระบรมราชสมภพ ร.9' },
      { date: 'ม.ค. 13', name: 'วันเด็กแห่งชาติ (สัปดาห์ที่ 2)' },
      { date: 'ม.ค. 16', name: 'วันครู' },
      { date: 'เม.ย. 6', name: 'วันจักรี' },
      { date: 'เม.ย. 13-15', name: 'วันสงกรานต์' }
    ]
  },

  sports_competition: {
    types: [
      { id: 'futsal', name: 'ฟุตซอล', players: 5, field: 'ในร่ม/กลางแจ้ง' },
      { id: 'football', name: 'ฟุตบอล', players: 11, field: 'สนามหญ้า' },
      { id: 'basketball', name: 'บาสเกตบอล', players: 5, field: 'สนามบาส' },
      { id: 'volleyball', name: 'วอลเลย์บอล', players: 6, field: 'ในร่ม/กลางแจ้ง' },
      { id: 'sepak_takraw', name: 'เซปักตะกร้อ', players: 3, field: 'สนามตะกร้อ' },
      { id: 'takraw_circle', name: 'ตะกร้อวง', players: 5, field: 'วงตะกร้อ' },
      { id: 'petanque', name: 'เปตอง', players: 3, field: 'สนามเปตอง' },
      { id: 'badminton', name: 'แบดมินตัน', players: 1, field: 'ในร่ม' },
      { id: 'table_tennis', name: 'ปิงปอง', players: 1, field: 'ในร่ม' },
      { id: 'relay', name: 'วิ่งผลัด', players: 4, field: 'สนามวิ่ง' },
      { id: 'long_jump', name: 'กระโดดไกล', players: 1, field: 'สนามทราย' },
      { id: 'shotput', name: 'ทุ่มน้ำหนัก', players: 1, field: 'สนามกรีฑา' },
      { id: 'cheer', name: 'เชียร์ลีดเดอร์', players: 12, field: 'ในร่ม' },
      { id: 'dance', name: 'ร่ายรำ/เต้น', players: 0, field: 'เวที' }
    ],
    houseColors: ['สีแดง', 'สีน้ำเงิน', 'สีเหลือง', 'สีเขียว'],
    scheduleTemplate: {
      opening: 'พิธีเปิด 08:30',
      morning: 'แข่งรอบแรก 09:00-12:00',
      lunch: 'พักเที่ยง 12:00-13:00',
      afternoon: 'รอบรองชนะเลิศ 13:00-15:00',
      final: 'รอบชิงชนะเลิศ 15:00-16:00',
      closing: 'พิธีมอบรางวัล 16:00-16:30'
    }
  },

  getAnswer: function(query) {
    var lower = query.toLowerCase();
    var results = [];

    // ค้นหาในหมวดกีฬา
    var sportKeywords = {
      'ฟุตบอล': 'football', 'บอล': 'football', 'soccer': 'football',
      'บาส': 'basketball', 'บาสเกตบอล': 'basketball', 'hoops': 'basketball',
      'วอลเลย์': 'volleyball', 'วอลเลย์บอล': 'volleyball',
      'ตะกร้อ': 'sepak_takraw', 'เซปัก': 'sepak_takraw',
      'วิ่ง': 'running', 'กรีฑา': 'running', 'วิ่งผลัด': 'running',
      'กีฬาสี': 'sports_day',
      'แข่งขัน': 'competition'
    };

    Object.keys(sportKeywords).forEach(function(kw) {
      if (lower.indexOf(kw.toLowerCase()) !== -1) {
        var sportKey = sportKeywords[kw];
        if (sportKey === 'sports_day') {
          results.push({
            source: 'กีฬาสี',
            content: this.sports_competition
          });
        } else if (sportKey === 'competition') {
          results.push({
            source: 'การแข่งขัน',
            content: this.sports_competition
          });
        } else if (this.sports_rules[sportKey]) {
          results.push({
            source: this.sports_rules[sportKey].name,
            content: this.sports_rules[sportKey]
          });
        }
      }
    }.bind(this));

    // ค้นหาในหมวดสุขภาพ
    var healthKeywords = {
      'โภชนาการ': 'nutrition', 'อาหาร': 'nutrition', 'กิน': 'nutrition',
      'ออกกำลังกาย': 'exercise', 'ฟิตเนส': 'exercise',
      'โรค': 'diseases', 'ป่วย': 'diseases', 'ไข้': 'diseases',
      'วัยรุ่น': 'puberty', 'puberty': 'puberty',
      'สุขภาพจิต': 'mental_health', 'เครียด': 'mental_health', 'เศร้า': 'mental_health',
      'อนามัย': 'hygiene', 'ความสะอาด': 'hygiene'
    };

    Object.keys(healthKeywords).forEach(function(kw) {
      if (lower.indexOf(kw.toLowerCase()) !== -1) {
        var healthKey = healthKeywords[kw];
        if (this.health_knowledge[healthKey]) {
          results.push({
            source: this.health_knowledge[healthKey].title,
            content: this.health_knowledge[healthKey]
          });
        }
      }
    }.bind(this));

    // ค้นหาในหมวดกฎหมาย
    var lawKeywords = {
      'พ.ร.บ.': 'education_act', 'พระราชบัญญัติ': 'education_act', 'สิทธิการศึกษา': 'education_act',
      'แรงงาน': 'labor_law', 'เวลาทำงาน': 'labor_law',
      'ระเบียบ': 'school_management', 'คำสั่ง': 'school_management'
    };

    Object.keys(lawKeywords).forEach(function(kw) {
      if (lower.indexOf(kw.toLowerCase()) !== -1) {
        var lawKey = lawKeywords[kw];
        if (this.thai_law[lawKey]) {
          results.push({
            source: this.thai_law[lawKey].title,
            content: this.thai_law[lawKey]
          });
        }
      }
    }.bind(this));

    // ค้นหาข้อมูลโรงเรียน
    var schoolKeywords = ['โรงเรียน', 'หนองพอก', 'ผอ.', 'ผู้อำนวยการ', 'รอง', 'สพป.', 'ครู', 'นักเรียน'];
    schoolKeywords.forEach(function(kw) {
      if (lower.indexOf(kw.toLowerCase()) !== -1) {
        results.push({
          source: 'ข้อมูลโรงเรียน',
          content: this.school_data
        });
      }
    }.bind(this));

    return results.length > 0 ? results : null;
  },

  formatAnswer: function(results) {
    if (!results || results.length === 0) return 'ไม่พบข้อมูลที่ต้องการ';

    var formatted = '';
    results.forEach(function(r) {
      formatted += '📚 ' + r.source + ':\n';

      if (r.content.field) {
        formatted += '📐 สนาม: ' + JSON.stringify(r.content.field) + '\n';
      }
      if (r.content.rules) {
        formatted += '📋 กติกา:\n';
        r.content.rules.forEach(function(rule) {
          formatted += '  • ' + rule.title + ': ' + rule.desc + '\n';
        });
      }
      if (r.content.tips) {
        formatted += '💡 เคล็ดลับ:\n';
        r.content.tips.forEach(function(tip) {
          formatted += '  • ' + tip + '\n';
        });
      }
      if (r.content.players) {
        formatted += '👥 ผู้เล่น: ' + JSON.stringify(r.content.players) + '\n';
      }
      if (r.content.game) {
        formatted += '🎮 การแข่ง: ' + JSON.stringify(r.content.game) + '\n';
      }
      formatted += '\n';
    });

    return formatted;
  }
};
