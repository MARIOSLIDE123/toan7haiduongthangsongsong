/**
 * =========================================================================================
 * GOOGLE APPS SCRIPT CHO ỨNG DỤNG HÌNH HỌC TOÁN 7 - BÀI 9: HAI ĐƯỜNG THẲNG SONG SONG
 * Tự động đồng bộ kết quả học sinh & Bảng xếp hạng 2 chiều về Google Sheets
 * =========================================================================================
 */

// 1. HÀM XỬ LÝ POST (GHI ĐIỂM HỌC SINH TỪ APP VÀO GOOGLE SHEETS)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa tránh xung đột khi nhiều học sinh nộp bài cùng lúc

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'Không có dữ liệu gửi lên' });
    }

    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data || payload;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tên sheet theo từng phân hệ để giáo viên quản lý khoa học
    var sheetName = "Dau_Truong_Tri_Tue";
    if (data.moduleId === "BAI9_VAN_DUNG_CAO") {
      sheetName = "Van_Dung_Cao";
    } else if (data.moduleId === "BAI9_LUYEN_TAP_SGK") {
      sheetName = "Luyen_Tap_SGK";
    }

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Nếu sheet mới tạo hoặc còn trống, tự động tạo Header chuẩn
    if (sheet.getLastRow() === 0) {
      var header = [
        "Thời gian nộp bài",
        "Họ và tên học sinh",
        "Lớp",
        "Trường THCS",
        "Phân hệ thử thách",
        "Điểm đạt được",
        "Điểm tối đa",
        "Tỷ lệ hoàn thành (%)",
        "Đúng lần đầu (câu)",
        "Đúng khi làm lại (câu)",
        "Số câu sai (câu)",
        "Thời gian làm bài",
        "Mã phiên (Session ID)"
      ];
      sheet.appendRow(header);
      
      // Định dạng dòng tiêu đề: in đậm, màu nền xanh dương, căn giữa
      var headerRange = sheet.getRange(1, 1, 1, header.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#2563EB");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Tên phân hệ hiển thị tiếng Việt rõ ràng
    var moduleLabel = "Đấu trường trí tuệ (20 câu)";
    if (data.moduleId === "BAI9_VAN_DUNG_CAO") {
      moduleLabel = "Vận dụng cao (10 câu - không làm lại)";
    } else if (data.moduleId === "BAI9_LUYEN_TAP_SGK") {
      moduleLabel = "Luyện tập SGK";
    }

    var now = new Date();
    var formattedDate = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "yyyy-MM-dd HH:mm:ss");

    var rowData = [
      formattedDate,
      data.studentName || "Học sinh ẩn danh",
      data.className || "7A",
      data.school || "THCS",
      moduleLabel,
      data.score !== undefined ? data.score : 0,
      data.maxScore !== undefined ? data.maxScore : 100,
      data.percentage || "0%",
      data.firstTryCorrectCount || 0,
      data.retryCorrectCount || 0,
      data.wrongCount || 0,
      data.timeSpent || "0s",
      data.sessionId || ""
    ];

    sheet.appendRow(rowData);

    // Căn chỉnh cột tự động và định dạng dữ liệu
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 6).setHorizontalAlignment("right"); // Điểm
    sheet.getRange(lastRow, 8).setHorizontalAlignment("right"); // %

    return jsonResponse({
      status: "success",
      message: "Đã ghi điểm học sinh thành công vào sheet " + sheetName,
      row: lastRow
    });

  } catch (err) {
    return jsonResponse({
      status: "error",
      message: err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// 2. HÀM XỬ LÝ GET (LẤY DỮ LIỆU BẢNG XẾP HẠNG ĐỒNG BỘ LÊN APP)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var moduleId = (e && e.parameter && e.parameter.moduleId) || "BAI9_DAU_TRUONG_TRI_TUE";

    var sheetName = "Dau_Truong_Tri_Tue";
    if (moduleId === "BAI9_VAN_DUNG_CAO") {
      sheetName = "Van_Dung_Cao";
    } else if (moduleId === "BAI9_LUYEN_TAP_SGK") {
      sheetName = "Luyen_Tap_SGK";
    }

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() <= 1) {
      return jsonResponse({
        status: "success",
        leaderboard: []
      });
    }

    var data = sheet.getDataRange().getValues();
    var rows = data.slice(1); // Bỏ qua tiêu đề

    var list = [];
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var name = r[1];
      if (!name) continue;

      var timeStr = String(r[11] || "0s").replace("s", "");
      var timeSec = parseInt(timeStr, 10) || 0;

      list.push({
        id: "gs_" + i,
        name: name,
        className: r[2] || "7A",
        school: r[3] || "THCS",
        moduleId: moduleId,
        score: parseFloat(r[5]) || 0,
        maxScore: parseFloat(r[6]) || 100,
        percentage: parseFloat(String(r[7]).replace("%", "")) || 0,
        timeSpentSeconds: timeSec,
        completedAt: String(r[0] || "")
      });
    }

    // Sắp xếp: Điểm cao nhất đứng trước, nếu bằng điểm thì thời gian ngắn hơn đứng trước
    list.sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpentSeconds - b.timeSpentSeconds;
    });

    return jsonResponse({
      status: "success",
      leaderboard: list.slice(0, 50) // Lấy top 50
    });

  } catch (err) {
    return jsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

// Hàm bổ trợ trả về định dạng JSON và mở CORS
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
