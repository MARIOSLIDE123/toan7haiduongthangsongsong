/**
 * =========================================================================================
 * GOOGLE APPS SCRIPT CHO ỨNG DỤNG HÌNH HỌC TOÁN 7 - BÀI 9: HAI ĐƯỜNG THẲNG SONG SONG
 * Tự động đồng bộ:
 * 1. Danh sách học sinh đăng ký (Sheet: Danh_Sach_Hoc_Sinh)
 * 2. Kết quả 3 phân hệ (Dau_Truong_Tri_Tue, Van_Dung_Cao, Luyen_Tap_SGK)
 * 3. Bảng xếp hạng tổng hợp theo thời gian thực (Sheet: Bang_Xep_Hang_Tong)
 * 4. Nhật ký hoạt động & thời gian sử dụng (Sheet: Nhat_Ky_Hoat_Dong)
 * =========================================================================================
 */

// 1. HÀM XỬ LÝ POST
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // Khóa tránh xung đột đồng thời

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'Không có dữ liệu gửi lên' });
    }

    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data || payload;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "yyyy-MM-dd HH:mm:ss");

    // =========================================================================
    // CASE 1: ĐĂNG KÝ HỌC SINH MỚI (Ngay khi vừa điền thông tin cá nhân)
    // =========================================================================
    if (action === "REGISTER_STUDENT") {
      var studentSheet = getOrCreateSheet(ss, "Danh_Sach_Hoc_Sinh", [
        "Thời gian tham gia",
        "Mã học sinh",
        "Họ và tên học sinh",
        "Lớp",
        "Trường THCS",
        "Ảnh đại diện",
        "Số lần vào học",
        "Lần truy cập gần nhất",
        "Trạng thái"
      ], "#1D4ED8");

      var sData = studentSheet.getDataRange().getValues();
      var foundRow = -1;
      for (var i = 1; i < sData.length; i++) {
        if (String(sData[i][2]).trim().toLowerCase() === String(data.studentName).trim().toLowerCase() &&
            String(sData[i][3]).trim().toLowerCase() === String(data.className).trim().toLowerCase()) {
          foundRow = i + 1;
          break;
        }
      }

      if (foundRow > 0) {
        var currentVisits = parseInt(studentSheet.getRange(foundRow, 7).getValue(), 10) || 1;
        studentSheet.getRange(foundRow, 7).setValue(currentVisits + 1);
        studentSheet.getRange(foundRow, 8).setValue(formattedDate);
        studentSheet.getRange(foundRow, 9).setValue("Đang học tập");
      } else {
        studentSheet.appendRow([
          formattedDate,
          data.studentId || ("STD_" + new Date().getTime()),
          data.studentName || "Học sinh mới",
          data.className || "7A",
          data.school || "THCS",
          data.avatar || "👨‍🎓",
          1,
          formattedDate,
          "Đã kích hoạt"
        ]);
      }

      // Khởi tạo học sinh trong Bảng Xếp Hạng Tổng Hợp nếu chưa có
      updateLeaderboardSummary(ss, data.studentName, data.className, data.school, data.avatar, null, null, null, 0);

      // Ghi nhật ký
      logActivity(ss, formattedDate, data.studentName, data.className, data.school, "Đăng ký thông tin và bắt đầu phiên học", "Hệ thống", "0s");

      return jsonResponse({
        status: "success",
        message: "Đã lưu học sinh vào Google Sheets thành công!",
        studentName: data.studentName
      });
    }

    // =========================================================================
    // CASE 2: GHI NHẬT KÝ HOẠT ĐỘNG VÀ THỜI GIAN SỬ DỤNG
    // =========================================================================
    if (action === "LOG_ACTIVITY") {
      logActivity(
        ss,
        formattedDate,
        data.studentName || "Học sinh",
        data.className || "7A",
        data.school || "THCS",
        data.activity || "Học tập",
        data.module || "Toán 7 Bài 9",
        data.durationSeconds ? data.durationSeconds + "s" : (data.timeSpent || "0s"),
        data.details || ""
      );

      return jsonResponse({ status: "success", message: "Đã ghi nhật ký hoạt động" });
    }

    // =========================================================================
    // CASE 3: GHI ĐIỂM HỌC SINH (KHI HOÀN THÀNH PHÂN HỆ)
    // =========================================================================
    if (action === "RECORD_STUDENT_RESULT" || !action) {
      var sheetName = "Dau_Truong_Tri_Tue";
      var moduleLabel = "Đấu trường trí tuệ (20 câu)";
      var maxPossibleScore = 100;

      if (data.moduleId === "BAI9_VAN_DUNG_CAO") {
        sheetName = "Van_Dung_Cao";
        moduleLabel = "Vận dụng cao (10 câu)";
        maxPossibleScore = 100;
      } else if (data.moduleId === "BAI9_LUYEN_TAP_SGK") {
        sheetName = "Luyen_Tap_SGK";
        moduleLabel = "Luyện tập SGK";
        maxPossibleScore = 120;
      }

      var moduleSheet = getOrCreateSheet(ss, sheetName, [
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
      ], "#2563EB");

      var rowData = [
        formattedDate,
        data.studentName || "Học sinh ẩn danh",
        data.className || "7A",
        data.school || "THCS",
        moduleLabel,
        data.score !== undefined ? data.score : 0,
        data.maxScore !== undefined ? data.maxScore : maxPossibleScore,
        data.percentage || "0%",
        data.firstTryCorrectCount || 0,
        data.retryCorrectCount || 0,
        data.wrongCount || 0,
        data.timeSpent || "0s",
        data.sessionId || ""
      ];

      moduleSheet.appendRow(rowData);
      var lastRow = moduleSheet.getLastRow();
      moduleSheet.getRange(lastRow, 6).setHorizontalAlignment("right");
      moduleSheet.getRange(lastRow, 8).setHorizontalAlignment("right");

      // Cập nhật Bảng Xếp Hạng Tổng Hợp theo thời gian thực
      var timeSec = parseInt(String(data.timeSpent || "0").replace("s", ""), 10) || 30;
      updateLeaderboardSummary(
        ss,
        data.studentName,
        data.className,
        data.school,
        data.avatar || "👨‍🎓",
        data.moduleId,
        data.score,
        data.maxScore,
        timeSec
      );

      // Ghi nhật ký hoàn thành
      logActivity(
        ss,
        formattedDate,
        data.studentName,
        data.className,
        data.school,
        "Hoàn thành " + moduleLabel + " - Đạt " + data.score + "/" + (data.maxScore || maxPossibleScore) + " điểm",
        sheetName,
        data.timeSpent || "0s"
      );

      return jsonResponse({
        status: "success",
        message: "Đã ghi điểm và cập nhật bảng xếp hạng thời gian thực thành công!",
        sheet: sheetName,
        row: lastRow
      });
    }

    return jsonResponse({ status: 'error', message: 'Hành động không xác định' });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// 2. HÀM XỬ LÝ GET (LẤY DỮ LIỆU BẢNG XẾP HẠNG & HỒ SƠ THỜI GIAN THỰC)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var paramAction = (e && e.parameter && e.parameter.action) || "getLeaderboard";
    var moduleId = (e && e.parameter && e.parameter.moduleId) || "ALL";

    // A. Lấy bảng xếp hạng tổng hợp hoặc theo phân hệ
    if (paramAction === "getLeaderboard") {
      if (moduleId === "ALL") {
        var summarySheet = ss.getSheetByName("Bang_Xep_Hang_Tong");
        if (!summarySheet || summarySheet.getLastRow() <= 1) {
          return jsonResponse({ status: "success", leaderboard: [] });
        }
        var data = summarySheet.getDataRange().getValues().slice(1);
        var resultList = [];
        for (var i = 0; i < data.length; i++) {
          var r = data[i];
          if (!r[1]) continue;
          resultList.push({
            rank: r[0] || (i + 1),
            name: r[1],
            className: r[2] || "7A",
            school: r[3] || "THCS",
            avatar: r[4] || "👨‍🎓",
            scoreArena: parseFloat(r[5]) || 0,
            scoreVDC: parseFloat(r[6]) || 0,
            scoreSGK: parseFloat(r[7]) || 0,
            score: parseFloat(r[8]) || 0, // Tổng điểm
            maxScore: 320,
            percentage: parseFloat(String(r[9]).replace("%", "")) || 0,
            timeSpentSeconds: parseInt(r[10], 10) || 60,
            completedAt: String(r[11] || ""),
            moduleId: "ALL"
          });
        }
        return jsonResponse({ status: "success", leaderboard: resultList.slice(0, 50) });
      }

      // Lấy theo phân hệ riêng biệt
      var sheetName = "Dau_Truong_Tri_Tue";
      if (moduleId === "BAI9_VAN_DUNG_CAO") sheetName = "Van_Dung_Cao";
      else if (moduleId === "BAI9_LUYEN_TAP_SGK") sheetName = "Luyen_Tap_SGK";

      var sheet = ss.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() <= 1) {
        return jsonResponse({ status: "success", leaderboard: [] });
      }

      var rows = sheet.getDataRange().getValues().slice(1);
      var list = [];
      for (var j = 0; j < rows.length; j++) {
        var row = rows[j];
        if (!row[1]) continue;
        var tSec = parseInt(String(row[11] || "0s").replace("s", ""), 10) || 0;
        list.push({
          id: "gs_" + j,
          name: row[1],
          className: row[2] || "7A",
          school: row[3] || "THCS",
          moduleId: moduleId,
          score: parseFloat(row[5]) || 0,
          maxScore: parseFloat(row[6]) || 100,
          percentage: parseFloat(String(row[7]).replace("%", "")) || 0,
          timeSpentSeconds: tSec,
          completedAt: String(row[0] || "")
        });
      }

      list.sort(function(a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeSpentSeconds - b.timeSpentSeconds;
      });

      return jsonResponse({ status: "success", leaderboard: list.slice(0, 50) });
    }

    return jsonResponse({ status: "success", message: "Google Apps Script Toán 7 sẵn sàng." });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// =============================================================================
// HÀM BỔ TRỢ: CẬP NHẬT BẢNG XẾP HẠNG TỔNG HỢP THEO THỜI GIAN THỰC
// =============================================================================
function updateLeaderboardSummary(ss, studentName, className, school, avatar, moduleId, score, maxScore, timeSpentSec) {
  var summarySheet = getOrCreateSheet(ss, "Bang_Xep_Hang_Tong", [
    "Hạng",
    "Họ và tên học sinh",
    "Lớp",
    "Trường THCS",
    "Ảnh",
    "Điểm Đấu trường (/100)",
    "Điểm Vận dụng cao (/100)",
    "Điểm SGK (/120)",
    "TỔNG ĐIỂM (/320)",
    "Tỷ lệ đạt (%)",
    "Tổng thời gian (s)",
    "Cập nhật lúc"
  ], "#B45309");

  var data = summarySheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toLowerCase() === String(studentName).trim().toLowerCase() &&
        String(data[i][2]).trim().toLowerCase() === String(className).trim().toLowerCase()) {
      foundRow = i + 1;
      break;
    }
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd HH:mm:ss");

  if (foundRow > 0) {
    var rowValues = summarySheet.getRange(foundRow, 1, 1, 12).getValues()[0];
    var currentArena = parseFloat(rowValues[5]) || 0;
    var currentVdc = parseFloat(rowValues[6]) || 0;
    var currentSgk = parseFloat(rowValues[7]) || 0;
    var currentTime = parseInt(rowValues[10], 10) || 0;

    if (moduleId === "BAI9_DAU_TRUONG_TRI_TUE" && score !== null) currentArena = Math.max(currentArena, score);
    if (moduleId === "BAI9_VAN_DUNG_CAO" && score !== null) currentVdc = Math.max(currentVdc, score);
    if (moduleId === "BAI9_LUYEN_TAP_SGK" && score !== null) currentSgk = Math.max(currentSgk, score);

    var totalScore = currentArena + currentVdc + currentSgk;
    var percentage = Math.round((totalScore / 320) * 1000) / 10;
    var updatedTime = currentTime + (timeSpentSec || 0);

    summarySheet.getRange(foundRow, 5, 1, 8).setValues([[
      avatar || rowValues[4] || "👨‍🎓",
      currentArena,
      currentVdc,
      currentSgk,
      totalScore,
      percentage + "%",
      updatedTime,
      nowStr
    ]]);
  } else {
    var initArena = (moduleId === "BAI9_DAU_TRUONG_TRI_TUE" && score !== null) ? score : 0;
    var initVdc = (moduleId === "BAI9_VAN_DUNG_CAO" && score !== null) ? score : 0;
    var initSgk = (moduleId === "BAI9_LUYEN_TAP_SGK" && score !== null) ? score : 0;
    var initTotal = initArena + initVdc + initSgk;
    var initPercent = Math.round((initTotal / 320) * 1000) / 10;

    summarySheet.appendRow([
      summarySheet.getLastRow(), // Hạng tạm thời
      studentName,
      className || "7A",
      school || "THCS",
      avatar || "👨‍🎓",
      initArena,
      initVdc,
      initSgk,
      initTotal,
      initPercent + "%",
      timeSpentSec || 30,
      nowStr
    ]);
  }

  // SẮP XẾP BẢNG XẾP HẠNG THEO THỜI GIAN THỰC (Cột 9 Tổng điểm giảm dần, Cột 11 Thời gian tăng dần)
  if (summarySheet.getLastRow() > 2) {
    var sortRange = summarySheet.getRange(2, 1, summarySheet.getLastRow() - 1, 12);
    sortRange.sort([
      { column: 9, ascending: false }, // Tổng điểm cao nhất
      { column: 11, ascending: true }   // Thời gian ngắn nhất
    ]);

    // Đánh số lại thứ hạng chuẩn 1, 2, 3...
    var sortedRows = sortRange.getValues();
    for (var k = 0; k < sortedRows.length; k++) {
      sortedRows[k][0] = k + 1;
    }
    sortRange.setValues(sortedRows);
  }
}

// =============================================================================
// HÀM BỔ TRỢ: GHI NHẬT KÝ HOẠT ĐỘNG
// =============================================================================
function logActivity(ss, timestamp, studentName, className, school, activity, moduleName, timeSpent, details) {
  var logSheet = getOrCreateSheet(ss, "Nhat_Ky_Hoat_Dong", [
    "Thời gian",
    "Họ và tên học sinh",
    "Lớp",
    "Trường THCS",
    "Hoạt động thực hiện",
    "Phân hệ",
    "Thời lượng",
    "Chi tiết"
  ], "#4B5563");

  logSheet.appendRow([
    timestamp,
    studentName,
    className,
    school,
    activity,
    moduleName || "",
    timeSpent || "",
    details || ""
  ]);
}

// =============================================================================
// HÀM BỔ TRỢ: LẤY HOẶC TẠO SHEET ĐẸP VỚI HEADER
// =============================================================================
function getOrCreateSheet(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground(headerColor || "#2563EB");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
