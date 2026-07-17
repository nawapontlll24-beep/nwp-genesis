// ==========================================
// NWP Genesis - Document Generator v2
// คุณภาพระดับราชการจริง ตามระเบียบสารบรรณ
// ==========================================

var DocGenerator = {

  // ข้อมูลโรงเรียน
  school: {
    name: 'โรงเรียนหนองพอกพัฒนาประชานุสรณ์',
    address: 'ตำบลหนองพอก อำเภอหนองพอก จังหวัดร้อยเอ็ด รหัสไปรษณี 45210',
    affiliation: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาร้อยเอ็ด เขต 3',
    director: 'นางคัทยวรรณ รังใส',
    vice: 'นางอังสนา ประทุมสินธุ์',
    teacher: 'นายนวพนธ์ ลอยละลิ่ว',
    position: 'ครู คศ.1',
    year: '2569',
    semester: '1',
    tel: '0-4356-XXXX'
  },

  // === ค่ามาตรฐานเอกสารราชการ ===
  FONT: 'TH Sarabun New',
  FONT_TITLE: 'TH Sarabun New',
  BODY_SIZE: 32,       // 16pt = half-points
  TITLE_SIZE: 56,      // 28pt
  HEADER_SIZE: 36,     // 18pt
  SMALL_SIZE: 28,      // 14pt
  LINE_SPACING: 360,   // 1.5 เท่า (276 = single)
  INDENT_FIRST: 720,   // ย่อหน้าแรก 720 twips = 1.27 cm
  INDENT_LEFT: 0,
  MARGIN_TOP: 1440,
  MARGIN_BOTTOM: 1440,
  MARGIN_LEFT: 1800,   // 3 cm ซ้าย (ราชการ)
  MARGIN_RIGHT: 1440,  // 2.5 cm ขวา

  // === วันที่ไทย ===
  _thaiDate: function(d) {
    if (!d) d = new Date();
    var months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + (d.getFullYear() + 543);
  },

  _thaiDateShort: function(d) {
    if (!d) d = new Date();
    return d.getDate() + ' ' + (d.getMonth()+1) + ' ' + (d.getFullYear() + 543);
  },

  // === Helper: สร้าง paragraph ย่อหน้า ===
  _bodyPara: function(text, opts) {
    opts = opts || {};
    var runs = [];
    if (typeof text === 'string') {
      runs.push(new docx.TextRun({
        text: text,
        size: opts.size || this.BODY_SIZE,
        font: this.FONT,
        bold: opts.bold || false,
        italics: opts.italics || false,
        color: opts.color || undefined,
        underline: opts.underline ? {} : undefined
      }));
    } else if (Array.isArray(text)) {
      text.forEach(function(t) {
        if (typeof t === 'string') {
          runs.push(new docx.TextRun({ text: t, size: DocGenerator.BODY_SIZE, font: DocGenerator.FONT }));
        } else {
          runs.push(new docx.TextRun(Object.assign({ size: DocGenerator.BODY_SIZE, font: DocGenerator.FONT }, t)));
        }
      });
    }

    return new docx.Paragraph({
      spacing: {
        before: opts.spaceBefore || 0,
        after: opts.spaceAfter || 0,
        line: opts.lineSpacing || this.LINE_SPACING
      },
      indent: {
        firstLine: opts.firstLine !== undefined ? opts.firstLine : this.INDENT_FIRST,
        left: opts.left || this.INDENT_LEFT
      },
      alignment: opts.align || docx.AlignmentType.LEFT,
      children: runs
    });
  },

  // === Helper: หัวเรื่อง ===
  _heading: function(text, level) {
    level = level || 1;
    var size = level === 1 ? this.TITLE_SIZE : level === 2 ? this.HEADER_SIZE : this.BODY_SIZE;
    return new docx.Paragraph({
      alignment: level <= 2 ? docx.AlignmentType.CENTER : docx.AlignmentType.LEFT,
      spacing: { before: level === 1 ? 200 : 240, after: 200, line: this.LINE_SPACING },
      children: [new docx.TextRun({
        text: text,
        size: size,
        font: this.FONT_TITLE,
        bold: true
      })]
    });
  },

  // === Helper: ว่าง ===
  _blank: function(lines) {
    lines = lines || 1;
    var children = [];
    for (var i = 0; i < lines; i++) {
      children.push(new docx.Paragraph({ spacing: { after: 0 }, children: [] }));
    }
    return children;
  },

  // === Helper: เส้นคั่น ===
  _divider: function() {
    return new docx.Paragraph({
      spacing: { before: 120, after: 120 },
      border: { bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: '000000', space: 1 } },
      children: []
    });
  },

  // === Helper: ส่วนหัวหนังสือ ===
  _officialHeader: function(refNo) {
    var children = [];
    // ตราโรงเรียน (ข้อความแทน)
    children.push(new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new docx.TextRun({ text: this.school.name, bold: true, size: this.HEADER_SIZE + 4, font: this.FONT_TITLE })]
    }));
    children.push(new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new docx.TextRun({ text: this.school.address, size: this.SMALL_SIZE, font: this.FONT })]
    }));
    children.push(new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new docx.TextRun({ text: this.school.affiliation, size: this.SMALL_SIZE, font: this.FONT })]
    }));
    children.push(this._divider());
    // เลขที่ & วันที่
    if (refNo) {
      children.push(this._bodyPara('ที่ ' + refNo, { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 40 }));
    }
    children.push(this._bodyPara('วันที่ ' + this._thaiDate(), { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 200 }));
    return children;
  },

  // === Helper: ลงชื่อผู้ลงนาม ===
  _signature: function(opts) {
    opts = opts || {};
    var children = this._blank(2);
    children.push(this._bodyPara('ลงชื่อ ..........................', { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 40 }));
    children.push(this._bodyPara(this.school.teacher, { firstLine: 0, align: docx.AlignmentType.RIGHT, bold: true, spaceAfter: 40 }));
    children.push(this._bodyPara(this.school.position, { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 40 }));
    if (opts.showDate) {
      children.push(this._bodyPara('วันที่ ' + this._thaiDate(), { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 0 }));
    }
    return children;
  },

  // === Helper: บันทึกข้อความ ===
  _saveToStore: function(blob, filename, type) {
    var self = this;
    return new Promise(function(resolve) {
      var reader = new FileReader();
      reader.onloadend = function() {
        var base64 = reader.result;
        DataStore.saveDocument({ title: filename, content: base64, type: type || 'general_doc' });
        resolve({ name: filename, url: base64 });
      };
      reader.readAsDataURL(blob);
    });
  },

  // ==================================================
  // 1. แผนการสอน (ตาม ข้อกำหนด กคศ. )
  // ==================================================
  generateTeachingPlan: function(params) {
    var subject = params.subject || 'สุขศึกษาและพลศึกษา';
    var grade = params.grade || 'ป.5';
    var topic = params.topic || 'สุขศึกษา';
    var now = new Date();
    var self = this;

    var children = [];

    // === ส่วนหัว ===
    children.push(new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new docx.TextRun({ text: 'แผนการจัดการเรียนรู้', bold: true, size: self.TITLE_SIZE, font: self.FONT_TITLE })]
    }));
    children.push(new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new docx.TextRun({ text: 'กลุ่มสาระการเรียนรู้สุขศึกษาและพลศึกษา', size: self.BODY_SIZE, font: self.FONT })]
    }));

    // === ตารางข้อมูลพื้นฐาน ===
    var tableData = [
      ['ชื่อสถานศึกษา', self.school.name],
      ['กลุ่มสาระการเรียนรู้', subject],
      ['ชั้น/ระดับ', grade],
      ['เรื่อง', topic],
      ['จำนวนชั่วโมง', '1 ชั่วโมง'],
      ['ปีการศึกษา', self.school.year + ' ภาคเรียนที่ ' + self.school.semester],
      ['วันที่จัดทำ', self._thaiDate(now)],
    ];

    var tableRows = tableData.map(function(row) {
      return new docx.TableRow({
        children: [
          new docx.TableCell({
            width: { size: 3200, type: docx.WidthType.DXA },
            borders: self._tableBorders(),
            children: [new docx.Paragraph({
              spacing: { before: 60, after: 60, line: 300 },
              indent: { left: 100 },
              children: [new docx.TextRun({ text: row[0], bold: true, size: self.BODY_SIZE, font: self.FONT })]
            })]
          }),
          new docx.TableCell({
            width: { size: 5800, type: docx.WidthType.DXA },
            borders: self._tableBorders(),
            children: [new docx.Paragraph({
              spacing: { before: 60, after: 60, line: 300 },
              indent: { left: 100 },
              children: [new docx.TextRun({ text: row[1], size: self.BODY_SIZE, font: self.FONT })]
            })]
          })
        ]
      });
    });

    children.push(new docx.Table({
      width: { size: 9000, type: docx.WidthType.DXA },
      rows: tableRows
    }));

    children.push(new docx.Paragraph({ spacing: { after: 200 }, children: [] }));

    // === สาระการเรียนรู้ ===
    children.push(self._heading('สาระการเรียนรู้', 2));

    children.push(self._bodyPara([
      { text: '1. จุดประสงค์การเรียนรู้ ', bold: true }
    ], { spaceAfter: 80, firstLine: 0 }));

    children.push(self._bodyPara([
      { text: '1.1 ความรู้ (Know) ', bold: true },
      { text: 'นักเรียนสามารถอธิบายความหมายและ 개념สำคัญของ' + topic + 'ได้' }
    ], { spaceAfter: 40 }));

    children.push(self._bodyPara([
      { text: '1.2 ทักษะ (Do) ', bold: true },
      { text: 'นักเรียนสามารถยกตัวอย่างและวิเคราะห์ situation ที่เกี่ยวข้องกับ' + topic + 'ได้' }
    ], { spaceAfter: 40 }));

    children.push(self._bodyPara([
      { text: '1.3 คุณลักษณะ (Be) ', bold: true },
      { text: 'นักเรียนมีเจตคติที่ดีต่อการดูแลสุขภาพตนเองและผู้อื่น' }
    ], { spaceAfter: 160 }));

    // === สาระสำคัญ ===
    children.push(self._bodyPara([
      { text: '2. สาระสำคัญ ', bold: true },
      { text: 'สาระสำคัญของ' + topic + 'ที่นักเรียนควรเรียนรู้และนำไปใช้ในชีวิตประจำวันได้' }
    ], { spaceAfter: 160 }));

    // === กิจกรรม ===
    children.push(self._bodyPara([
      { text: '3. ขั้นตอนการจัดการเรียนรู้', bold: true }
    ], { spaceAfter: 80, firstLine: 0 }));

    // ตารางขั้นตอน
    var actData = [
      ['ขั้นนำ\n(5 นาที)', '• ทักทายตรวจRowAnimationความเรียบร้อย\n• ทบทวนความรู้เดิมด้วยการซักถาม\n• บอกจุดประสงค์การเรียนรู้'],
      ['ขั้นกิจกรรม\n(25 นาที)', '• สื่อการสอน PowerPoint\n• กิจกรรมกลุ่ม / สาธิต\n• ฝึกปฏิบัติ / ระดมสมอง\n• อภิปรายกลุ่ม'],
      ['ขั้นสรุป\n(5 นาที)', '• สรุปเนื้อหาสำคัญ\n• นักเรียนสรุปสิ่งที่เรียนรู้\n• มอบหมายงาน / การบ้าน'],
      ['ขั้นประเมิน\n(5 นาที)', '• ทดสอบย่อย / ใบงาน\n• สังเกตพฤติกรรม'],
    ];

    var actRows = actData.map(function(row) {
      return new docx.TableRow({
        children: [
          new docx.TableCell({
            width: { size: 2400, type: docx.WidthType.DXA },
            borders: self._tableBorders(),
            shading: { fill: 'E8EAF6' },
            children: [new docx.Paragraph({
              spacing: { before: 80, after: 80, line: 300 },
              indent: { left: 100 },
              children: [new docx.TextRun({ text: row[0], bold: true, size: self.BODY_SIZE, font: self.FONT })]
            })]
          }),
          new docx.TableCell({
            width: { size: 6600, type: docx.WidthType.DXA },
            borders: self._tableBorders(),
            children: [new docx.Paragraph({
              spacing: { before: 80, after: 80, line: 300 },
              indent: { left: 100 },
              children: [new docx.TextRun({ text: row[1], size: self.BODY_SIZE, font: self.FONT })]
            })]
          })
        ]
      });
    });

    children.push(new docx.Table({
      width: { size: 9000, type: docx.WidthType.DXA },
      rows: actRows
    }));

    children.push(new docx.Paragraph({ spacing: { after: 200 }, children: [] }));

    // === สื่อการสอน ===
    children.push(self._bodyPara([
      { text: '4. สื่อการสอน ', bold: true },
      { text: 'PowerPoint, ใบงาน, อุปกรณ์ประกอบการสอน, สื่อจากแหล่งเรียนรู้' }
    ], { spaceAfter: 120 }));

    // === การประเมินผล ===
    children.push(self._bodyPara([
      { text: '5. การประเมินผล ', bold: true },
      { text: '5.1 ประเมินก่อนเรียน (Pre-test)\n5.2 ประเมินระหว่างเรียน (สังเกตพฤติกรรม)\n5.3 ประเมินหลังเรียน (Post-test / ใบงาน)' }
    ], { spaceAfter: 120 }));

    // === เกณฑ์การให้คะแนน ===
    children.push(self._bodyPara([
      { text: '6. เกณฑ์การให้คะแนน ', bold: true },
      { text: 'คะแนนเก็บ 60% : สอบปลายภาค 40% (ตามเกณฑ์ รร.)' }
    ], { spaceAfter: 200 }));

    // === ลงชื่อ ===
    children.push(self._divider());
    children = children.concat(self._signature({ showDate: true }));

    // === สร้างไฟล์ ===
    var doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: self.FONT, size: self.BODY_SIZE },
            paragraph: { spacing: { line: self.LINE_SPACING } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: self.MARGIN_TOP, right: self.MARGIN_RIGHT, bottom: self.MARGIN_BOTTOM, left: self.MARGIN_LEFT }
          }
        },
        children: children
      }]
    });

    return docx.Packer.toBlob(doc).then(function(blob) {
      var filename = 'แผนการสอน_' + grade + '_' + topic + '_' + self._thaiDateShort() + '.docx';
      return self._saveToStore(blob, filename, 'แผนการสอน');
    });
  },

  _tableBorders: function() {
    var border = { style: docx.BorderStyle.SINGLE, size: 1, color: '000000', space: 0 };
    return { top: border, bottom: border, left: border, right: border };
  },

  // ==================================================
  // 2. หนังสือราชการ (ตาม ระเบียบสารบรรณ)
  // ==================================================
  generateOfficialLetter: function(params) {
    var subject = params.subject || 'เรื่อง ขอความเห็นชอบ';
    var to = params.to || '';
    var contentText = params.content || 'ขอความเห็นชอบในการดำเนินงาน';
    var now = new Date();
    var self = this;
    var seqNum = now.getFullYear() + Math.floor(Math.random() * 900 + 100);

    var children = self._officialHeader('นย. ' + seqNum + ' 001');

    // หัวเรื่อง
    children.push(self._bodyPara('เรื่อง  ' + subject, { firstLine: 0, bold: true, spaceAfter: 80 }));
    children.push(self._bodyPara('เรียน  ' + to, { firstLine: 0, spaceAfter: 200 }));

    children.push(self._divider());

    // เนื้อหา
    children.push(self._bodyPara('ด้วย' + contentText, { spaceAfter: 80 }));
    children.push(self._bodyPara('จึงเรียนมาเพื่อโปรดพิจารณาและให้ความเห็นชอบต่อไป', { spaceAfter: 200 }));

    // ลงชื่อ
    children = children.concat(self._signature({ showDate: false }));
    children.push(self._bodyPara('วันที่ ' + self._thaiDate(), { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 0 }));

    var doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: self.FONT, size: self.BODY_SIZE },
            paragraph: { spacing: { line: self.LINE_SPACING } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: self.MARGIN_TOP, right: self.MARGIN_RIGHT, bottom: self.MARGIN_BOTTOM, left: self.MARGIN_LEFT }
          }
        },
        children: children
      }]
    });

    return docx.Packer.toBlob(doc).then(function(blob) {
      var filename = 'หนังสือราชการ_' + subject.substring(0, 25) + '.docx';
      return self._saveToStore(blob, filename, 'หนังสือราชการ');
    });
  },

  // ==================================================
  // 3. บันทึกข้อความ
  // ==================================================
  generateMemo: function(params) {
    var subject = params.subject || 'บันทึกข้อความ';
    var to = params.to || 'รองผู้อำนวยการ';
    var contentText = params.content || 'บันทึกข้อความ';
    var self = this;

    var children = [];

    children.push(new docx.Paragraph({
      alignment: docx.AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new docx.TextRun({ text: 'บันทึกข้อความ', bold: true, size: self.TITLE_SIZE, font: self.FONT_TITLE })]
    }));

    children.push(self._bodyPara('ส่วนราชการ  ' + self.school.name, { firstLine: 0, spaceAfter: 40 }));
    children.push(self._bodyPara('ที่  ........................................', { firstLine: 0, spaceAfter: 40 }));
    children.push(self._bodyPara('วันที่  ' + self._thaiDate(), { firstLine: 0, spaceAfter: 120 }));
    children.push(self._bodyPara('เรื่อง  ' + subject, { firstLine: 0, bold: true, spaceAfter: 80 }));
    children.push(self._bodyPara('เรียน  ' + to, { firstLine: 0, spaceAfter: 200 }));

    children.push(self._divider());

    children.push(self._bodyPara(contentText, { spaceAfter: 80 }));
    children.push(self._bodyPara('จึงเรียนมาเพื่อทราบ', { spaceAfter: 200 }));

    children = children.concat(self._signature());

    var doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: self.FONT, size: self.BODY_SIZE },
            paragraph: { spacing: { line: self.LINE_SPACING } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: self.MARGIN_TOP, right: self.MARGIN_RIGHT, bottom: self.MARGIN_BOTTOM, left: self.MARGIN_LEFT }
          }
        },
        children: children
      }]
    });

    return docx.Packer.toBlob(doc).then(function(blob) {
      var filename = 'บันทึกข้อความ_' + subject.substring(0, 25) + '.docx';
      return self._saveToStore(blob, filename, 'บันทึกข้อความ');
    });
  },

  // ==================================================
  // 4. รายงาน
  // ==================================================
  generateReport: function(params) {
    var subject = params.subject || 'รายงานผลการปฏิบัติงาน';
    var contentText = params.content || 'รายงานผลการดำเนินงาน';
    var self = this;

    var children = self._officialHeader();

    children.push(self._heading('รายงาน ' + subject, 2));

    children.push(self._bodyPara([
      { text: '1. ความเป็นมา', bold: true }
    ], { firstLine: 0, spaceAfter: 80 }));

    children.push(self._bodyPara(contentText, { spaceAfter: 160 }));

    children.push(self._bodyPara([
      { text: '2. วัตถุประสงค์', bold: true }
    ], { firstLine: 0, spaceAfter: 80 }));

    children.push(self._bodyPara('เพื่อรายงานผลการดำเนินงานให้ผู้บังคับบัญชาทราบ', { spaceAfter: 160 }));

    children.push(self._bodyPara([
      { text: '3. ผลการดำเนินงาน', bold: true }
    ], { firstLine: 0, spaceAfter: 80 }));

    children.push(self._bodyPara([
      { text: '(กรอกผลการดำเนินงาน)', italics: true, color: '888888' }
    ], { spaceAfter: 160 }));

    children.push(self._bodyPara([
      { text: '4. ปัญหาและอุปสรรค', bold: true }
    ], { firstLine: 0, spaceAfter: 80 }));

    children.push(self._bodyPara([
      { text: '(กรอกปัญหาและอุปสรรค)', italics: true, color: '888888' }
    ], { spaceAfter: 160 }));

    children.push(self._bodyPara([
      { text: '5. ข้อเสนอแนะ', bold: true }
    ], { firstLine: 0, spaceAfter: 80 }));

    children.push(self._bodyPara([
      { text: '(กรอกข้อเสนอแนะ)', italics: true, color: '888888' }
    ], { spaceAfter: 200 }));

    children.push(self._divider());
    children = children.concat(self._signature({ showDate: true }));

    var doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: self.FONT, size: self.BODY_SIZE },
            paragraph: { spacing: { line: self.LINE_SPACING } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: self.MARGIN_TOP, right: self.MARGIN_RIGHT, bottom: self.MARGIN_BOTTOM, left: self.MARGIN_LEFT }
          }
        },
        children: children
      }]
    });

    return docx.Packer.toBlob(doc).then(function(blob) {
      var filename = 'รายงาน_' + subject.substring(0, 25) + '.docx';
      return self._saveToStore(blob, filename, 'รายงาน');
    });
  },

  // ==================================================
  // 5. คำขอจัดสรรงบประมาณ
  // ==================================================
  generateBudgetRequest: function(params) {
    var subject = params.subject || 'ขอจัดสรรงบประมาณ';
    var amount = params.amount || '(กรอกจำนวนเงิน)';
    var purpose = params.purpose || '(กรอกวัตถุประสงค์)';
    var self = this;

    var children = self._officialHeader();

    children.push(self._heading('ใบขอจัดสรรงบประมาณ', 2));
    children.push(self._bodyPara('เรื่อง  ' + subject, { firstLine: 0, bold: true, spaceAfter: 80 }));

    // ตารางงบประมาณ
    var budgetData = [
      ['รายการ', 'จำนวนเงิน (บาท)', 'หมายเหตุ'],
      ['1. ' + purpose, amount, ''],
      ['รวมทั้งสิ้น', amount, ''],
    ];

    var budgetRows = budgetData.map(function(row, i) {
      var isHeader = i === 0;
      var isTotal = i === budgetData.length - 1;
      return new docx.TableRow({
        children: row.map(function(cell) {
          return new docx.TableCell({
            borders: self._tableBorders(),
            shading: isHeader ? { fill: 'E8EAF6' } : (isTotal ? { fill: 'FFF9C4' } : undefined),
            children: [new docx.Paragraph({
              spacing: { before: 60, after: 60, line: 300 },
              indent: { left: 100 },
              alignment: cell === amount ? docx.AlignmentType.RIGHT : docx.AlignmentType.LEFT,
              children: [new docx.TextRun({ text: cell, bold: isHeader || isTotal, size: self.BODY_SIZE, font: self.FONT })]
            })]
          });
        })
      });
    });

    children.push(new docx.Table({
      width: { size: 9000, type: docx.WidthType.DXA },
      rows: budgetRows
    }));

    children.push(new docx.Paragraph({ spacing: { after: 200 }, children: [] }));

    children.push(self._bodyPara([
      { text: 'วัตถุประสงค์: ', bold: true },
      { text: purpose }
    ], { spaceAfter: 160 }));

    children.push(self._bodyPara('จึงเรียนมาเพื่อขอความเห็นชอบและอนุมัติงบประมาณ', { spaceAfter: 200 }));

    children.push(self._divider());
    children = children.concat(self._signature({ showDate: true }));

    var doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: self.FONT, size: self.BODY_SIZE },
            paragraph: { spacing: { line: self.LINE_SPACING } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: self.MARGIN_TOP, right: self.MARGIN_RIGHT, bottom: self.MARGIN_BOTTOM, left: self.MARGIN_LEFT }
          }
        },
        children: children
      }]
    });

    return docx.Packer.toBlob(doc).then(function(blob) {
      var filename = 'ใบขอจัดสรรงบประมาณ_' + subject.substring(0, 20) + '.docx';
      return self._saveToStore(blob, filename, 'งบประมาณ');
    });
  },

  // ==================================================
  // 6. คำสั่งโรงเรียน
  // ==================================================
  generateOrder: function(params) {
    var subject = params.subject || 'คำสั่งโรงเรียน';
    var content = params.content || '(กรอกเนื้อหาคำสั่ง)';
    var self = this;
    var seqNum = new Date().getFullYear() + '' + (new Date().getMonth() + 1) + '' + Math.floor(Math.random() * 900 + 100);

    var children = self._officialHeader();

    children.push(self._heading('คำสั่งโรงเรียน', 2));
    children.push(self._bodyPara('ที่  สข. ' + seqNum, { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 40 }));
    children.push(self._bodyPara('วันที่  ' + self._thaiDate(), { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 80 }));
    children.push(self._bodyPara('เรื่อง  ' + subject, { firstLine: 0, bold: true, spaceAfter: 200 }));

    children.push(self._divider());

    children.push(self._bodyPara(content, { spaceAfter: 200 }));

    // ลงชื่อ ผอ.
    children = children.concat(self._blank(2));
    children.push(self._bodyPara('ลงชื่อ ..........................', { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 40 }));
    children.push(self._bodyPara(self.school.director, { firstLine: 0, align: docx.AlignmentType.RIGHT, bold: true, spaceAfter: 40 }));
    children.push(self._bodyPara('ผู้อำนวยการโรงเรียน', { firstLine: 0, align: docx.AlignmentType.RIGHT, spaceAfter: 40 }));

    var doc = new docx.Document({
      styles: {
        default: {
          document: {
            run: { font: self.FONT, size: self.BODY_SIZE },
            paragraph: { spacing: { line: self.LINE_SPACING } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: { top: self.MARGIN_TOP, right: self.MARGIN_RIGHT, bottom: self.MARGIN_BOTTOM, left: self.MARGIN_LEFT }
          }
        },
        children: children
      }]
    });

    return docx.Packer.toBlob(doc).then(function(blob) {
      var filename = 'คำสั่งโรงเรียน_' + subject.substring(0, 20) + '.docx';
      return self._saveToStore(blob, filename, 'คำสั่ง');
    });
  },

  // ==================================================
  // 7. สร้าง PDF (ผ่าน html2pdf.js หรือ print)
  // ==================================================
  generatePDF: function(content, title) {
    title = title || 'เอกสาร';
    var printWindow = window.open('', '_blank');
    printWindow.document.write('<!DOCTYPE html><html><head><meta charset="utf-8">');
    printWindow.document.write('<title>' + title + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: "TH Sarabun New", sans-serif; font-size: 16pt; line-height: 1.5; margin: 2cm; }');
    printWindow.document.write('h1 { font-size: 22pt; text-align: center; }');
    printWindow.document.write('h2 { font-size: 18pt; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin: 10px 0; }');
    printWindow.document.write('td, th { border: 1px solid #000; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background: #f0f0f0; }');
    printWindow.document.write('@media print { .no-print { display: none; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>' + this.school.name + '</h1>');
    printWindow.document.write('<p style="text-align:center">' + this.school.affiliation + '</p>');
    printWindow.document.write('<hr>');
    printWindow.document.write('<h2>' + title + '</h2>');
    printWindow.document.write(content);
    printWindow.document.write('<p style="text-align:right;margin-top:40px">ลงชื่อ ..........................</p>');
    printWindow.document.write('<p style="text-align:right">' + this.school.teacher + '</p>');
    printWindow.document.write('<p style="text-align:right">' + this.school.position + '</p>');
    printWindow.document.write('<div class="no-print" style="text-align:center;margin-top:30px">');
    printWindow.document.write('<button onclick="window.print()" style="padding:10px 30px;font-size:14pt">พิมพ์ / บันทึก PDF</button>');
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  },

  // ==================================================
  // 8. สร้าง Excel (ผ่าน SheetJS)
  // ==================================================
  generateExcel: function(data, title) {
    title = title || 'ข้อมูล';
    if (typeof XLSX === 'undefined') {
      alert('ไม่พบไลบรารี XLSX');
      return;
    }
    var ws = XLSX.utils.aoa_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));

    var fileName = title + '_' + new Date().toISOString().substring(0, 10) + '.xlsx';
    XLSX.writeFile(wb, fileName);
    DataStore.saveDocument({ title: fileName, content: '', type: 'Excel' });
  },

  // ==================================================
  // 9. ตารางกีฬา (Excel)
  // ==================================================
  generateSportsScheduleExcel: function(competition) {
    var rows = [['ลำดับ', 'ประเภทกีฬา', 'สนาม', 'เวลา', 'ทีม A', 'ทีม B', 'ผลการแข่งขัน']];

    if (competition && competition.events) {
      competition.events.forEach(function(evt, i) {
        rows.push([i + 1, evt.sport, evt.venue, evt.time, evt.teamA || '', evt.teamB || '', '']);
      });
    }

    return this.generateExcel(rows, 'ตารางแข่งขันกีฬา');
  },

  // ==================================================
  // 10. สถิตินักเรียน (Excel)
  // ==================================================
  generateStudentStatsExcel: function(students) {
    var rows = [['ลำดับ', 'ชื่อ-สกุล', 'ห้อง', 'คะแนนเก็บ', 'สอบปลายภาค', 'เกรดเฉลี่ย']];

    if (students && students.length) {
      students.forEach(function(s, i) {
        rows.push([i + 1, s.name, s.room, s.midterm || '', s.final || '', s.gpa || '']);
      });
    } else {
      rows.push(['', '(กรอกข้อมูล)', '', '', '', '']);
    }

    return this.generateExcel(rows, 'สถิตินักเรียน');
  },

  // ==================================================
  // วิเคราะห์คำสั่ง & เลือกประเภทเอกสาร
  // ==================================================
  processCommand: function(department, command) {
    var cmd = command.toLowerCase();
    var params = { subject: command, content: command };

    if (cmd.indexOf('แผนการสอน') !== -1 || cmd.indexOf('lesson plan') !== -1 || cmd.indexOf('แผนการจัดการเรียนรู้') !== -1) {
      var gradeMatch = cmd.match(/(ป\.\d|อนุบาล|ม\.\d)/);
      var topic = command.replace(/แผนการสอน/g, '').replace(/แผนการจัดการเรียนรู้/g, '').replace(/สุขศึกษา/g, '').replace(/พลศึกษา/g, '').replace(/ป\.\d/g, '').replace(/เรื่อง/g, '').replace(/และพลศึกษา/g, '').trim();
      params.subject = 'สุขศึกษาและพลศึกษา';
      params.grade = gradeMatch ? gradeMatch[0] : 'ป.5';
      params.topic = topic || 'สุขศึกษา';
      return this.generateTeachingPlan(params);
    }
    else if (cmd.indexOf('งบประมาณ') !== -1 || cmd.indexOf('ขอจัดสรร') !== -1 || cmd.indexOf('ใบเบิก') !== -1 || cmd.indexOf('tor') !== -1 || cmd.indexOf('จัดซื้อ') !== -1) {
      var amountMatch = cmd.match(/(\d[\d,\.]*)\s*(บาท|บ\/|บาท|฿)/);
      params.amount = amountMatch ? amountMatch[1] : '(กรอกจำนวนเงิน)';
      params.purpose = command;
      return this.generateBudgetRequest(params);
    }
    else if (cmd.indexOf('คำสั่ง') !== -1 || cmd.indexOf('แต่งตั้ง') !== -1 || cmd.indexOf('มอบหมาย') !== -1) {
      params.content = command;
      return this.generateOrder(params);
    }
    else if (cmd.indexOf('หนังสือ') !== -1 || cmd.indexOf('ขอความเห็นชอบ') !== -1 || cmd.indexOf('ขออนุญาต') !== -1 || cmd.indexOf('เรียน ท่าน') !== -1 || cmd.indexOf('หนังสือเชิญ') !== -1) {
      return this.generateOfficialLetter(params);
    }
    else if (cmd.indexOf('บันทึก') !== -1 || cmd.indexOf('memo') !== -1) {
      return this.generateMemo(params);
    }
    else if (cmd.indexOf('รายงาน') !== -1 || cmd.indexOf('report') !== -1) {
      return this.generateReport(params);
    }
    else if (department === 'docs-officer' || department === 'clerical') {
      return this.generateOfficialLetter(params);
    }
    else if (department === 'classroom-admin' || department === 'registry_student') {
      return this.generateMemo(params);
    }
    else if (department === 'budget_plan' || department === 'procurement') {
      return this.generateBudgetRequest(params);
    }
    else {
      return this.generateReport(params);
    }
  }
};
