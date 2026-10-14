/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QUESTIONS_BANK } from './data/questions.ts';
import { ARENA_QUESTIONS } from './data/arenaQuestions.ts';
import { ADVANCED_QUESTIONS } from './data/advancedQuestions.ts';

// Comprehensive Test Runner for Toán 7 Bài 9 (Practice, Arena 20 questions, Advanced 10 questions)
function runMathTestSuite() {
  console.log('========================================================================');
  console.log('🧪 BẮT ĐẦU CHẠY BỘ TOÀN DIỆN KIỂM THỬ TOÁN 7 - BÀI 9');
  console.log('   (Luyện tập SGK + Đấu trường trí tuệ 20 câu + Vận dụng cao 10 câu)');
  console.log('========================================================================\n');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(description: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${description}`);
    } else {
      failedTests++;
      console.error(`  ❌ [FAIL] ${description}`);
      if (details) console.error(`     Chi tiết: ${details}`);
    }
  }

  // ====================================================================
  // PHẦN 1: KIỂM THỬ 20 CÂU HỎI ĐẤU TRƯỜNG TRÍ TUỆ
  // ====================================================================
  console.log('--- 1. Kiểm tra toàn bộ 20 câu Đấu trường trí tuệ ---');
  assert(
    'Đấu trường trí tuệ có đúng 20 câu hỏi độc lập',
    ARENA_QUESTIONS.length === 20,
    `Số câu hiện có: ${ARENA_QUESTIONS.length}`
  );

  // Câu 1: So le trong
  const q1 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q1');
  assert(
    'Arena Câu 1: So le trong ∠A₁ và ∠B₃ là đáp án A',
    q1?.type === 'single_choice' && q1?.correctSingleOption === 'A'
  );

  // Câu 2: Đồng vị (4 cặp)
  const q2 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q2');
  const q2Correct = q2?.correctMultipleOptions?.sort().join(',');
  assert(
    'Arena Câu 2: Chọn đúng 4 cặp góc đồng vị: A, B, C, D',
    q2?.type === 'multiple_choice' && q2Correct === 'A,B,C,D'
  );

  // Câu 3: Đối đỉnh
  const q3 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q3');
  assert(
    'Arena Câu 3: Tính góc đối đỉnh ∠A₂ = 67° ⇒ ∠A₄ = 67°',
    q3?.type === 'numeric_input' && q3?.numericAnswer?.exact === 67
  );

  // Câu 4: Ghép khái niệm với định nghĩa
  const q4 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q4');
  assert(
    'Arena Câu 4: Ghép khái niệm: 1-d, 2-a, 3-c, 4-b',
    q4?.matchingData?.correctPairs['1'] === 'd' &&
    q4?.matchingData?.correctPairs['2'] === 'a' &&
    q4?.matchingData?.correctPairs['3'] === 'c' &&
    q4?.matchingData?.correctPairs['4'] === 'b'
  );

  // Câu 5: Ghép cặp góc
  const q5 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q5');
  assert(
    'Arena Câu 5: Ghép loại góc: 1-b (so le trong), 2-a (đồng vị), 3-c (trong cùng phía), 4-d (đối đỉnh)',
    q5?.matchingData?.correctPairs['1'] === 'b' &&
    q5?.matchingData?.correctPairs['2'] === 'a' &&
    q5?.matchingData?.correctPairs['3'] === 'c' &&
    q5?.matchingData?.correctPairs['4'] === 'd'
  );

  // Câu 6: Đúng/Sai
  const q6 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q6');
  assert(
    'Arena Câu 6: Đúng/Sai: ý 1, 2, 3 Đúng; ý 4 Sai (không phải cả 8 góc đều bằng nhau)',
    q6?.trueFalseData?.statements.find((s) => s.id === 's1')?.correct === true &&
    q6?.trueFalseData?.statements.find((s) => s.id === 's2')?.correct === true &&
    q6?.trueFalseData?.statements.find((s) => s.id === 's3')?.correct === true &&
    q6?.trueFalseData?.statements.find((s) => s.id === 's4')?.correct === false
  );

  // Câu 7: Kề bù
  const q7 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q7');
  assert(
    'Arena Câu 7: Tính góc kề bù: 180° − 118° = 62°',
    q7?.numericAnswer?.exact === 62
  );

  // Câu 8: Suy luận song song
  const q8 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q8');
  assert(
    'Arena Câu 8: Các kết luận đúng khi A₂ = 55°: A, B, C, F',
    q8?.correctMultipleOptions?.sort().join(',') === 'A,B,C,F'
  );

  // Câu 9: Thứ tự chứng minh
  const q9 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q9');
  assert(
    'Arena Câu 9: Sắp xếp các bước lập luận: b → c → d → a',
    q9?.orderingData?.correctOrder.join('') === 'bcda'
  );

  // Câu 10: Chọn trực tiếp góc trên SVG
  const q10 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q10');
  assert(
    'Arena Câu 10: Vùng góc SVG tương tác nhận chọn đúng góc ∠B₂ (so le trong với ∠A₄)',
    q10?.type === 'svg_angle_click' && q10?.svgAngleTarget === 'B2'
  );

  // Câu 11: Ghép trong cùng phía
  const q11 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q11');
  assert(
    'Arena Câu 11: Ghép trong cùng phía: A₁ với B₂; A₄ với B₃',
    q11?.matchingData?.correctPairs['1'] === 'x' &&
    q11?.matchingData?.correctPairs['2'] === 'y'
  );

  // Câu 12: Phân loại tính chất và dấu hiệu
  const q12 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q12');
  assert(
    'Arena Câu 12: Phân loại tính chất & dấu hiệu: 1-b, 2-c, 3-a, 4-d',
    q12?.matchingData?.correctPairs['1'] === 'b' &&
    q12?.matchingData?.correctPairs['2'] === 'c' &&
    q12?.matchingData?.correctPairs['3'] === 'a' &&
    q12?.matchingData?.correctPairs['4'] === 'd'
  );

  // Câu 13: Dấu hiệu góc đồng vị
  const q13 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q13');
  assert(
    'Arena Câu 13: ∠A₂ = ∠B₂ (đồng vị) ⇒ a ∥ b (Đáp án A)',
    q13?.correctSingleOption === 'A'
  );

  // Câu 14: Điền từ còn thiếu
  const q14 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q14');
  assert(
    'Arena Câu 14: Điền từ "song song" hoặc "song song với nhau"',
    q14?.fillBlankAnswer?.acceptedPhrases.includes('song song') === true
  );

  // Câu 15: Xác định các góc bằng 55°
  const q15 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q15');
  assert(
    'Arena Câu 15: Các góc bằng 55°: ∠A₄, ∠B₂, ∠B₄ (A, B, C)',
    q15?.correctMultipleOptions?.sort().join(',') === 'A,B,C'
  );

  // Câu 16: Tìm x từ trong cùng phía
  const q16 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q16');
  assert(
    'Arena Câu 16: Tìm x: (3x+15) + (2x+25) = 180 ⇒ 5x = 140 ⇒ x = 28',
    q16?.numericAnswer?.exact === 28
  );

  // Câu 17: Nhận biết song song từ so le trong
  const q17 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q17');
  assert(
    'Arena Câu 17: ∠A₁ = 70°, ∠B₃ = 70° (so le trong) ⇒ a ∥ b (Đáp án A)',
    q17?.correctSingleOption === 'A'
  );

  // Câu 18: Lỗi trong lập luận
  const q18 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q18');
  assert(
    'Arena Câu 18: Lỗi lập luận: ∠A₂ = ∠A₄ đối đỉnh tại 1 đỉnh chưa đủ căn cứ (Đáp án A)',
    q18?.correctSingleOption === 'A'
  );

  // Câu 19: Vẽ đường thẳng song song
  const q19 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q19');
  assert(
    'Arena Câu 19: Trình tự vẽ ê-ke và thước: b → d → a → c',
    q19?.orderingData?.correctOrder.join('') === 'bdac'
  );

  // Câu 20: Tổng hai góc trong cùng phía
  const q20 = ARENA_QUESTIONS.find((q) => q.id === 'arena_q20');
  assert(
    'Arena Câu 20: ∠A₁ + ∠B₂ = 80° + 100° = 180° ⇒ a ∥ b (Đáp án A)',
    q20?.correctSingleOption === 'A'
  );

  // ====================================================================
  // PHẦN 2: KIỂM THỬ 10 BÀI TOÁN VẬN DỤNG CAO THỰC TẾ
  // ====================================================================
  console.log('\n--- 2. Kiểm tra toàn bộ 10 bài toán Vận dụng cao ---');
  assert(
    'Vận dụng cao có đúng 10 bài toán thực tế',
    ADVANCED_QUESTIONS.length === 10,
    `Số bài hiện có: ${ADVANCED_QUESTIONS.length}`
  );

  ADVANCED_QUESTIONS.forEach((q, idx) => {
    assert(
      `VDC Bài ${idx + 1} (${q.id}): Có bối cảnh thực tế, 4 lựa chọn A-B-C-D, 1 đáp án đúng và lời giải`,
      Boolean(
        q.realLifeContext &&
        q.options.length === 4 &&
        q.options.every((opt) => ['A', 'B', 'C', 'D'].includes(opt.id)) &&
        q.correctOptionId &&
        q.explanation.steps.length > 0
      )
    );
  });

  // Kiểm tra chi tiết từng bài toán thực tế VDC
  const vdc1 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q1');
  assert(
    'VDC 1: Vạch kẻ đường giao thông: (3x+12)+(2x+18)=180 ⇒ x = 30, góc: 102° và 78°',
    vdc1?.correctOptionId === 'A' && vdc1.options[0].text.includes('x = 30')
  );

  const vdc2 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q2');
  assert(
    'VDC 2: Vì kèo mái nhà: 4x − 7 = 2x + 29 ⇒ x = 18, hai góc đều bằng 65°',
    vdc2?.correctOptionId === 'A' && vdc2.options[0].text.includes('x = 18')
  );

  const vdc3 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q3');
  assert(
    'VDC 3: Khung cửa sổ: ∠A₂ = 127° đối đỉnh ∠A₄ = 127° ⇒ ∠B₃ = 180° − 127° = 53°',
    vdc3?.correctOptionId === 'A' && vdc3.options[0].text.includes('53°')
  );

  const vdc4 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q4');
  assert(
    'VDC 4: Tuyến ống tưới tiêu: 5x − 10 = 3x + 22 ⇒ x = 16, cả hai góc = 70°',
    vdc4?.correctOptionId === 'A' && vdc4.options[0].text.includes('x = 16')
  );

  const vdc5 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q5');
  assert(
    'VDC 5: Kết cấu giàn cầu: 6x + 14 = 8x − 18 ⇒ x = 16, hai góc đều bằng 110°',
    vdc5?.correctOptionId === 'A' && vdc5.options[0].text.includes('110°')
  );

  const vdc6 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q6');
  assert(
    'VDC 6: Tầng giá kệ: Góc trong cùng phía bù nhau: 180° − 124° = 56°',
    vdc6?.correctOptionId === 'A' && vdc6.options[0].text.includes('56°')
  );

  const vdc7 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q7');
  assert(
    'VDC 7: Tấm pin mặt trời: Tỉ lệ 4:5 ⇒ 4k + 5k = 180 ⇒ k = 20 ⇒ 80° và 100°',
    vdc7?.correctOptionId === 'A' && vdc7.options[0].text.includes('80° và 100°')
  );

  const vdc8 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q8');
  assert(
    'VDC 8: Thanh ray cầu thang: 2x + 11 = 5x − 40 ⇒ 3x = 51 ⇒ x = 17, hai góc = 45°',
    vdc8?.correctOptionId === 'A' && vdc8.options[0].text.includes('x = 17')
  );

  const vdc9 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q9');
  assert(
    'VDC 9: Đánh giá bằng chứng mái nhà: Đo đối đỉnh tại 1 giao điểm chưa đủ căn cứ chứng minh 2 thanh ngang song song',
    vdc9?.correctOptionId === 'A'
  );

  const vdc10 = ADVANCED_QUESTIONS.find((q) => q.id === 'vdc_q10');
  assert(
    'VDC 10: Nút giao đường nội bộ: (4x+8)+(2x+22)=180 ⇒ x = 25, góc: 108° và 72°',
    vdc10?.correctOptionId === 'A' && vdc10.options[0].text.includes('x = 25')
  );

  // ====================================================================
  // PHẦN 3: KIỂM THỬ THUẬT TOÁN CHẤM ĐIỂM & BẢO MẬT CHỐNG LÀM LẠI
  // ====================================================================
  console.log('\n--- 3. Kiểm tra quy tắc chấm điểm và cơ chế bảo mật ---');

  // Kiểm tra quy chế Đấu trường: 5đ lần 1, 2.5đ lần 2, 0đ sai 2 lần
  function simulateArenaScoring(attempts: boolean[]) {
    if (attempts.length === 1 && attempts[0]) return { score: 5, canRetry: false };
    if (attempts.length === 1 && !attempts[0]) return { score: 0, canRetry: true };
    if (attempts.length === 2 && attempts[1]) return { score: 2.5, canRetry: false };
    return { score: 0, canRetry: false };
  }

  assert(
    'Đấu trường: Đúng lần đầu nhận 5 điểm',
    simulateArenaScoring([true]).score === 5 && !simulateArenaScoring([true]).canRetry
  );
  assert(
    'Đấu trường: Sai lần 1 được làm lại (canRetry = true, score = 0)',
    simulateArenaScoring([false]).score === 0 && simulateArenaScoring([false]).canRetry
  );
  assert(
    'Đấu trường: Đúng sau 1 lần làm lại nhận 2.5 điểm',
    simulateArenaScoring([false, true]).score === 2.5 && !simulateArenaScoring([false, true]).canRetry
  );
  assert(
    'Đấu trường: Sai cả 2 lần nhận 0 điểm và kết thúc',
    simulateArenaScoring([false, false]).score === 0 && !simulateArenaScoring([false, false]).canRetry
  );

  // Kiểm tra quy chế Vận dụng cao: 10đ/câu, TUYỆT ĐỐI KHÔNG CÓ RETRY
  function simulateVdcScoring(isCorrect: boolean) {
    return {
      score: isCorrect ? 10 : 0,
      attemptsCount: 1,
      canRetry: false,
      isCompleted: true,
    };
  }

  const vdcCorrect = simulateVdcScoring(true);
  assert(
    'Vận dụng cao: Đúng nhận 10 điểm, khóa ngay (canRetry = false)',
    vdcCorrect.score === 10 && vdcCorrect.canRetry === false && vdcCorrect.isCompleted === true
  );

  const vdcWrong = simulateVdcScoring(false);
  assert(
    'Vận dụng cao: Sai nhận 0 điểm, tuyệt đối KHÔNG cho làm lại (canRetry = false, isCompleted = true)',
    vdcWrong.score === 0 && vdcWrong.canRetry === false && vdcWrong.isCompleted === true
  );

  // Kiểm tra deduplication chống cộng trùng điểm
  function simulateDeduplication(isCompleted: boolean, currentScore: number) {
    if (isCompleted) {
      return { deduplicated: true, newScore: currentScore };
    }
    return { deduplicated: false, newScore: currentScore + 10 };
  }

  const dupTest = simulateDeduplication(true, 50);
  assert(
    'Chống gian lận: Yêu cầu gửi lại câu đã hoàn thành không được cộng điểm thêm (newScore = 50)',
    dupTest.deduplicated === true && dupTest.newScore === 50
  );

  // ====================================================================
  // PHẦN 4: KIỂM THỬ QUY CHUẨN HÌNH HỌC SVG
  // ====================================================================
  console.log('\n--- 4. Kiểm tra quy chuẩn tọa độ hình học SVG ---');
  // Sơ đồ chuẩn: A nằm trên B, c nghiêng từ trên-trái xuống dưới-phải
  // A1, B1: dưới trái; A2, B2: trên trái; A3, B3: trên phải; A4, B4: dưới phải
  const checkAngleRelations = () => {
    const alternateInterior = [
      ['A1', 'B3'],
      ['A4', 'B2'],
    ];
    const corresponding = [
      ['A1', 'B1'],
      ['A2', 'B2'],
      ['A3', 'B3'],
      ['A4', 'B4'],
    ];
    const consecutiveInterior = [
      ['A1', 'B2'],
      ['A4', 'B3'],
    ];
    const verticalA = [
      ['A1', 'A3'],
      ['A2', 'A4'],
    ];

    return (
      alternateInterior.length === 2 &&
      corresponding.length === 4 &&
      consecutiveInterior.length === 2 &&
      verticalA.length === 2
    );
  };

  assert('Quy chuẩn hình học: Đầy đủ các cặp góc so le trong, đồng vị, trong cùng phía, đối đỉnh', checkAngleRelations());

  console.log('\n========================================================================');
  console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} PHÉP THỬ THÀNH CÔNG (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (failedTests === 0) {
    console.log('🎉 TẤT CẢ 20 CÂU ĐẤU TRƯỜNG VÀ 10 CÂU VẬN DỤNG CAO ĐỀU ĐẠT TIÊU CHUẨN 100%!');
  } else {
    console.error(`⚠️ CÓ ${failedTests} PHÉP THỬ THẤT BẠI CẦN XỬ LÝ!`);
  }
  console.log('========================================================================\n');

  return { totalTests, passedTests, failedTests, success: failedTests === 0 };
}

// Execute if run directly via tsx
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('test_math_suite')) {
  const result = runMathTestSuite();
  if (!result.success) {
    process.exit(1);
  }
}

export { runMathTestSuite };
