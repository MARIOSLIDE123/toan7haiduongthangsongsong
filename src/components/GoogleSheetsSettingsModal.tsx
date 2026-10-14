/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio.ts';
import {
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  X,
  Server,
  CloudOff,
} from 'lucide-react';

interface GoogleSheetsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsSettingsModal: React.FC<GoogleSheetsSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [webAppUrl, setWebAppUrl] = useState('');
  const [status, setStatus] = useState<'demo' | 'connected' | 'error'>('demo');
  const [pendingCount, setPendingCount] = useState(0);
  const [message, setMessage] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/sheets/config');
      const data = await res.json();
      setStatus(data.status);
      setPendingCount(data.pendingOfflineCount || 0);
      if (data.maskedUrl) {
        setWebAppUrl(data.maskedUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    sound.playClick();

    try {
      const res = await fetch('/api/sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webAppUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus(data.status);
        setMessage('Đã lưu cấu hình Google Sheets thành công!');
        sound.playCorrect();
      } else {
        setMessage(data.error || 'URL không hợp lệ. Hãy kiểm tra lại.');
        sound.playWrong();
      }
    } catch {
      setMessage('Không thể kết nối đến máy chủ.');
      sound.playWrong();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchToDemo = async () => {
    setWebAppUrl('');
    sound.playClick();
    try {
      const res = await fetch('/api/sheets/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webAppUrl: '' }),
      });
      const data = await res.json();
      setStatus('demo');
      setMessage(data.message || 'Đã chuyển về chế độ Demo');
    } catch (e) {
      console.error(e);
    }
  };

  const sampleAppsScriptCode = `// Google Apps Script - Đồng bộ 2 chiều Toán 7 Bài 9 (3 phân hệ & Bảng xếp hạng)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var payload = JSON.parse(e.postData.contents);
    var data = payload.data || payload;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    var sheetName = "Dau_Truong_Tri_Tue";
    if (data.moduleId === "BAI9_VAN_DUNG_CAO") sheetName = "Van_Dung_Cao";
    else if (data.moduleId === "BAI9_LUYEN_TAP_SGK") sheetName = "Luyen_Tap_SGK";

    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian", "Họ và tên", "Lớp", "Trường", "Phân hệ",
        "Điểm đạt", "Điểm tối đa", "Tỷ lệ (%)", "Đúng lần 1",
        "Đúng làm lại", "Số câu sai", "Thời gian làm", "Session ID"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#2563EB").setFontColor("#FFF");
    }

    var now = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([
      now, data.studentName, data.className, data.school, data.moduleId,
      data.score, data.maxScore, data.percentage, data.firstTryCorrectCount || 0,
      data.retryCorrectCount || 0, data.wrongCount || 0, data.timeSpent, data.sessionId
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var moduleId = (e && e.parameter && e.parameter.moduleId) || "BAI9_DAU_TRUONG_TRI_TUE";
    var sheetName = moduleId === "BAI9_VAN_DUNG_CAO" ? "Van_Dung_Cao" : (moduleId === "BAI9_LUYEN_TAP_SGK" ? "Luyen_Tap_SGK" : "Dau_Truong_Tri_Tue");
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", leaderboard: [] })).setMimeType(ContentService.MimeType.JSON);
    }
    var rows = sheet.getDataRange().getValues().slice(1);
    var list = rows.map(function(r, i) {
      return {
        id: "gs_" + i, name: r[1], className: r[2], school: r[3], moduleId: moduleId,
        score: parseFloat(r[5]) || 0, maxScore: parseFloat(r[6]) || 100,
        percentage: parseFloat(String(r[7]).replace("%","")) || 0,
        timeSpentSeconds: parseInt(String(r[11]).replace("s",""), 10) || 0, completedAt: String(r[0])
      };
    }).sort(function(a,b){ return (b.score - a.score) || (a.timeSpentSeconds - b.timeSpentSeconds); });
    return ContentService.createTextOutput(JSON.stringify({ status: "success", leaderboard: list.slice(0, 50) })).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: e.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScriptToClipboard = () => {
    sound.playClick();
    navigator.clipboard.writeText(sampleAppsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 space-y-5">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center text-2xl shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Kết nối Google Sheets & Apps Script
            </h3>
            <p className="text-xs text-slate-500">
              Quản lý đồng bộ điểm số, bảo mật dữ liệu và ghi kết quả của học sinh.
            </p>
          </div>
        </div>

        {/* Current Status Box */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            status === 'connected'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {status === 'connected' ? (
              <Server className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <CloudOff className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm">
                Trạng thái:{' '}
                {status === 'connected'
                  ? 'Đã kết nối với Google Sheets thật'
                  : 'Chế độ Demo / Bộ nhớ nội bộ (Offline Ready)'}
              </p>
              <p className="text-xs opacity-85">
                {status === 'connected'
                  ? 'Mọi kết quả nộp bài sẽ tự động gửi thẳng vào Google Sheet của thầy cô.'
                  : `Hệ thống vẫn ghi nhận kết quả và lưu offline an toàn (${pendingCount} bản ghi đã lưu).`}
              </p>
            </div>
          </div>
        </div>

        {/* Form Config */}
        <form onSubmit={handleSave} className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Google Apps Script Web App URL
          </label>
          <input
            type="text"
            value={webAppUrl}
            onChange={(e) => setWebAppUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />

          {message && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {message}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleSwitchToDemo}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            >
              Chuyển về chế độ Demo
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Đang kiểm tra...' : 'Lưu cấu hình'}
            </button>
          </div>
        </form>

        {/* Security & Anti-Cheat Notice */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Shield className="w-4 h-4 text-emerald-500" />
            Kiến trúc an toàn & Bảo mật điểm số
          </div>
          <p>
            • <b>Tính điểm phía máy chủ:</b> Trình duyệt không gửi điểm trực tiếp; máy chủ độc lập chấm điểm theo từng vòng (100% lần 1, 50% lần 2, 0% lần 3).
          </p>
          <p>
            • <b>Chống trùng lặp (Anti-duplication):</b> Bấm nhiều lần hoặc gửi lại cùng sessionId không làm sai lệch điểm số.
          </p>
          <p>
            • <b>Không để lộ API Token:</b> Kết nối Web App diễn ra an toàn qua proxy backend.
          </p>
        </div>

        {/* Sample Apps Script Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mã nguồn Google Apps Script mẫu (1-Click Copy)
            </span>
            <button
              type="button"
              onClick={copyScriptToClipboard}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedScript ? 'Đã sao chép!' : 'Sao chép mã'}
            </button>
          </div>

          <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-40 leading-relaxed border border-slate-800">
            {sampleAppsScriptCode}
          </pre>
          <p className="text-[11px] text-slate-400">
            Hướng dẫn: Mở Google Sheet &gt; Tiện ích mở rộng &gt; Apps Script &gt; Dán mã &gt; Triển khai &gt; Ứng dụng web mới &gt; Ai có quyền truy cập: "Bất kỳ ai".
          </p>
        </div>
      </div>
    </div>
  );
};
