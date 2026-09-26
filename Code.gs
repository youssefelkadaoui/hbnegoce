const HEADERS = ['الاسم', 'العنوان', 'الهاتف', 'حالة الرد', 'التاريخ والوقت'];

function doPost(e) {
  try {
    const parameters = Object.assign({}, e && e.parameter ? e.parameter : {});
    if (e && e.postData && e.postData.contents) {
      Object.assign(parameters, JSON.parse(e.postData.contents));
    }
    const name = getValue(parameters, ['name', 'fullName', 'customerName']);
    const address = getValue(parameters, ['address', 'customerAddress']);
    const phone = getValue(parameters, ['phone', 'customerPhone']);

    if (!name || !address || !phone) {
      const received = Object.keys(parameters).join(', ') || 'لا توجد حقول مستلمة';
      throw new Error('الاسم والعنوان والهاتف مطلوبة. الحقول المستلمة: ' + received);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      safeText(name),
      safeText(address),
      safeText(phone),
      'في الانتظار',
      new Date()
    ]);
    return ContentService.createTextOutput('تم حفظ الطلب بنجاح');
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput('ERROR: ' + error.message);
  }
}

function doGet() {
  return ContentService.createTextOutput('خدمة استقبال الطلبات تعمل');
}

function testDoPost() {
  return doPost({
    parameter: {
      name: 'اختبار',
      address: 'عنوان تجريبي',
      phone: '0600000000'
    }
  });
}

function getValue(parameters, names) {
  for (const name of names) {
    const value = String(parameters[name] || '').trim();
    if (value) return value;
  }
  return '';
}

function safeText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}