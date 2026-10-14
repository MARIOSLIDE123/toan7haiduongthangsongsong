/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Centralized Google Sheets Real-Time Synchronization & Activity Logging
 */

import { StudentProfile } from '../types.ts';

export const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbwONwRDH8xAMIG3D6ebJJjPhQqfxOXMSyyUmdqBOrYdhTsKStSv4T3_dHrJXsisQVmH/exec';

export interface LocalActivityLog {
  id: string;
  timestamp: string;
  activity: string;
  details?: string;
  module?: string;
}

/**
 * 1. ĐĂNG KÝ HỌC SINH LÊN GOOGLE SHEETS NGAY KHI VỪA ĐIỀN THÔNG TIN
 */
export async function registerStudentOnline(student: StudentProfile): Promise<boolean> {
  if (!student.name || !student.name.trim()) return false;

  const payload = {
    action: 'REGISTER_STUDENT',
    data: {
      timestamp: new Date().toISOString(),
      studentId: student.id,
      studentName: student.name.trim(),
      className: student.className.trim(),
      school: student.school.trim(),
      avatar: student.avatar || '👨‍🎓',
      registeredAt: new Date().toLocaleString('vi-VN'),
    },
  };

  // Lưu hoạt động nội bộ
  saveLocalActivity(student, 'Đăng ký tài khoản & Bắt đầu học', `Lớp ${student.className} - ${student.school}`);

  // Gửi đồng bộ lên Google Sheets
  try {
    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    // Đồng bộ lên API Serverless
    fetch('/api/student/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload.data),
    }).catch(() => {});

    return true;
  } catch (err) {
    console.warn('Lỗi gửi đăng ký học sinh:', err);
    return false;
  }
}

/**
 * 2. GHI NHẬT KÝ VÀ THỜI GIAN SỬ DỤNG CỦA HỌC SINH THEO THỜI GIAN THỰC
 */
export async function logStudentActivityOnline(
  student: StudentProfile,
  activity: string,
  details: string = '',
  module: string = '',
  durationSeconds: number = 0
): Promise<void> {
  if (!student.name || !student.name.trim()) return;

  saveLocalActivity(student, activity, details, module);

  const payload = {
    action: 'LOG_ACTIVITY',
    data: {
      timestamp: new Date().toISOString(),
      studentId: student.id,
      studentName: student.name.trim(),
      className: student.className.trim(),
      school: student.school.trim(),
      activity,
      details,
      module,
      durationSeconds,
      formattedTime: new Date().toLocaleString('vi-VN'),
    },
  };

  try {
    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}
}

/**
 * Lưu lịch sử hoạt động vào LocalStorage để hiển thị ngay trên Hồ sơ học sinh
 */
export function saveLocalActivity(
  _student: StudentProfile,
  activity: string,
  details: string = '',
  module: string = ''
) {
  try {
    const key = 'toan7_activity_logs';
    const logs: LocalActivityLog[] = JSON.parse(localStorage.getItem(key) || '[]');
    const newLog: LocalActivityLog = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      activity,
      details,
      module,
    };
    // Giữ tối đa 20 hoạt động mới nhất
    const updated = [newLog, ...logs].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}
}

export function getLocalActivities(): LocalActivityLog[] {
  try {
    return JSON.parse(localStorage.getItem('toan7_activity_logs') || '[]');
  } catch {
    return [];
  }
}
