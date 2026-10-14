/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdvancedQuestion } from '../types.ts';

export const ADVANCED_QUESTIONS: AdvancedQuestion[] = [
  // CÂU VDC 1
  {
    id: 'vdc_q1',
    questionNumber: 1,
    title: 'Câu 1: Vạch kẻ đường giao thông',
    realLifeContext:
      'Trong công tác nghiệm thu công trình giao thông đô thị, các kỹ sư cần xác định độ song song tuyệt đối giữa hai vạch sơn mép đường để đảm bảo an toàn lưu thông xe cộ.',
    prompt:
      'Một kỹ sư đang kiểm tra hai vạch kẻ đường thẳng a và b. Một đường thẳng c cắt hai vạch tại A và B. Để xác định hai vạch có song song hay không, kỹ sư đo được hai góc trong cùng phía:\n\n' +
      '∠A₁ = (3x + 12)°\n' +
      '∠B₂ = (2x + 18)°\n\n' +
      'Giả sử hai vạch a và b song song. Giá trị nào dưới đây của x và số đo hai góc là chính xác?',
    options: [
      { id: 'A', text: 'A. x = 30; hai góc bằng 102° và 78°.' },
      { id: 'B', text: 'B. x = 30; hai góc bằng 90° và 90°.' },
      { id: 'C', text: 'C. x = 24; hai góc bằng 84° và 66°.' },
      { id: 'D', text: 'D. x = 36; hai góc bằng 120° và 90°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Vì hai góc trong cùng phía của hai đường thẳng song song bù nhau nên tổng số đo của chúng bằng 180°.',
      steps: [
        'Bước 1: Thiết lập phương trình từ tính chất hai góc trong cùng phía bù nhau: (3x + 12) + (2x + 18) = 180.',
        'Bước 2: Thu gọn biểu thức đại số: 5x + 30 = 180 ⇒ 5x = 150 ⇒ x = 30.',
        'Bước 3: Tính số đo từng góc: ∠A₁ = 3 × 30 + 12 = 102°; ∠B₂ = 2 × 30 + 18 = 78°.',
        'Bước 4: Kiểm tra lại tổng: 102° + 78° = 180° (thỏa mãn tính chất bù nhau).',
      ],
      conclusion: 'Vậy x = 30 và hai góc trong cùng phía có số đo lần lượt là 102° và 78°.',
    },
    diagramConfig: {
      baseAngle: 78,
      isParallel: true,
      highlightAngles: ['A1', 'B2'],
      customLabels: { A1: '102°', B2: '78°' },
    },
  },

  // CÂU VDC 2
  {
    id: 'vdc_q2',
    questionNumber: 2,
    title: 'Câu 2: Kiểm tra vì kèo mái nhà',
    realLifeContext:
      'Hệ thống vì kèo thép trong xây dựng dân dụng đòi hỏi các thanh ngang phải song song với nhau nhằm phân bổ đều tải trọng của mái ngói.',
    prompt:
      'Hai thanh ngang a, b của một hệ vì kèo mái nhà được cắt bởi thanh giằng chéo c. Hai góc đồng vị đo được lần lượt là:\n\n' +
      '(4x − 7)° và (2x + 29)°.\n\n' +
      'Kỹ sư muốn xác định giá trị x để hai thanh ngang có thể được xác nhận song song bằng dấu hiệu góc đồng vị. Em hãy chọn phương án chính xác:',
    options: [
      { id: 'A', text: 'A. x = 18; hai góc đều bằng 65° và a ∥ b.' },
      { id: 'B', text: 'B. x = 16; hai góc đều bằng 57° và a ∥ b.' },
      { id: 'C', text: 'C. x = 18; một góc bằng 65°, góc còn lại bằng 55°.' },
      { id: 'D', text: 'D. x = 20; hai góc đều bằng 73° và a ∥ b.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Để hai thanh ngang song song theo dấu hiệu góc đồng vị, hai góc đồng vị tương ứng phải có số đo bằng nhau.',
      steps: [
        'Bước 1: Đặt hai góc đồng vị bằng nhau: 4x − 7 = 2x + 29.',
        'Bước 2: Giải phương trình bậc nhất: 4x − 2x = 29 + 7 ⇒ 2x = 36 ⇒ x = 18.',
        'Bước 3: Thay x = 18 vào hai biểu thức: 4 × 18 − 7 = 65° và 2 × 18 + 29 = 65°.',
        'Bước 4: Hai góc đồng vị cùng bằng 65° nên kết luận a ∥ b theo dấu hiệu nhận biết.',
      ],
      conclusion: 'Vậy x = 18; hai góc đồng vị cùng bằng 65° và khẳng định a ∥ b.',
    },
    diagramConfig: {
      baseAngle: 65,
      isParallel: true,
      highlightAngles: ['A2', 'B2'],
      customLabels: { A2: '65°', B2: '65°' },
    },
  },

  // CÂU VDC 3
  {
    id: 'vdc_q3',
    questionNumber: 3,
    title: 'Câu 3: Khung cửa sổ có thanh chéo',
    realLifeContext:
      'Thiết kế khung cửa sắt mỹ thuật thường gia cố thêm các thanh nan chéo tăng cường khả năng chịu lực chống xô lệch gió bão.',
    prompt:
      'Một khung cửa sổ có hai thanh ngang a và b được cắt bởi một thanh chéo c. Biết a và b dự kiến song song. Tại giao điểm A, một góc ngoài có số đo:\n\n' +
      '∠A₂ = 127°.\n\n' +
      'Theo quy ước sơ đồ chuẩn, hãy xác định số đo góc trong cùng phía ∠B₃ ở giao điểm còn lại.',
    options: [
      { id: 'A', text: 'A. 53°.' },
      { id: 'B', text: 'B. 127°.' },
      { id: 'C', text: 'C. 63°.' },
      { id: 'D', text: 'D. 37°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Kết hợp tính chất hai góc đối đỉnh tại đỉnh A và tính chất hai góc trong cùng phía bù nhau giữa a và b.',
      steps: [
        'Bước 1: Tại giao điểm A, góc ngoài ∠A₂ (phía trên bên trái) và góc trong ∠A₄ (phía dưới bên phải) là hai góc đối đỉnh.',
        'Bước 2: Suy ra: ∠A₄ = ∠A₂ = 127°.',
        'Bước 3: Vì a ∥ b, hai góc trong cùng phía ∠A₄ và ∠B₃ có tổng bằng 180°: ∠A₄ + ∠B₃ = 180°.',
        'Bước 4: Do đó: ∠B₃ = 180° − ∠A₄ = 180° − 127° = 53°.',
      ],
      conclusion: 'Vậy góc trong cùng phía ∠B₃ có số đo chính xác bằng 53°.',
    },
    diagramConfig: {
      baseAngle: 127,
      isParallel: true,
      highlightAngles: ['A2', 'A4', 'B3'],
      customLabels: { A2: '127°', A4: '127°', B3: '53°' },
    },
  },

  // CÂU VDC 4
  {
    id: 'vdc_q4',
    questionNumber: 4,
    title: 'Câu 4: Kiểm tra hai tuyến ống tưới tiêu',
    realLifeContext:
      'Trong hệ thống tưới tiêu nông nghiệp công nghệ cao, các đường ống nhánh cần bố trí song song song để áp lực nước phun phân bổ đồng đều trên luống cây.',
    prompt:
      'Hai tuyến ống thẳng a và b được một tuyến phụ cắt ngang. Để thiết kế bảo đảm các tuyến ống song song, kỹ thuật viên xác định hai góc so le trong có số đo:\n\n' +
      '(5x − 10)° và (3x + 22)°.\n\n' +
      'Giá trị nào làm cho điều kiện song song được thỏa mãn?',
    options: [
      { id: 'A', text: 'A. x = 16; cả hai góc đều bằng 70°.' },
      { id: 'B', text: 'B. x = 21; hai góc lần lượt bằng 95° và 85°.' },
      { id: 'C', text: 'C. x = 12; cả hai góc đều bằng 50°.' },
      { id: 'D', text: 'D. x = 20; hai góc lần lượt bằng 90° và 82°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Để hai đường ống song song theo dấu hiệu so le trong, số đo của hai góc so le trong phải bằng nhau.',
      steps: [
        'Bước 1: Thiết lập đẳng thức: 5x − 10 = 3x + 22.',
        'Bước 2: Chuyển vế giải tìm x: 5x − 3x = 22 + 10 ⇒ 2x = 32 ⇒ x = 16.',
        'Bước 3: Tính số đo hai góc: 5(16) − 10 = 70° và 3(16) + 22 = 70°.',
        'Bước 4: Cả hai góc đều bằng 70°, thỏa mãn dấu hiệu so le trong bằng nhau ⇒ a ∥ b.',
      ],
      conclusion: 'Vậy x = 16 và cả hai góc so le trong đều có số đo bằng 70°.',
    },
    diagramConfig: {
      baseAngle: 70,
      isParallel: true,
      highlightAngles: ['A1', 'B3'],
      customLabels: { A1: '70°', B3: '70°' },
    },
  },

  // CÂU VDC 5
  {
    id: 'vdc_q5',
    questionNumber: 5,
    title: 'Câu 5: Kết cấu giàn cầu',
    realLifeContext:
      'Dầm thép giàn cầu chịu rung chấn lớn từ các đoàn tàu hỏa chạy qua. Các thanh giằng dọc cần giữ song song tuyệt đối theo thiết kế cơ học kết cấu.',
    prompt:
      'Một kết cấu giàn cầu có hai thanh giằng a, b bị cắt bởi thanh chéo c. Hai góc đồng vị được xác định theo các biểu thức:\n\n' +
      '(6x + 14)° và (8x − 18)°.\n\n' +
      'Để hai thanh giằng song song theo dấu hiệu góc đồng vị, cần chọn kết quả nào?',
    options: [
      { id: 'A', text: 'A. x = 16; hai góc đều bằng 110°.' },
      { id: 'B', text: 'B. x = 14; hai góc đều bằng 98°.' },
      { id: 'C', text: 'C. x = 16; góc thứ nhất bằng 110°, góc thứ hai bằng 100°.' },
      { id: 'D', text: 'D. x = 18; hai góc đều bằng 122°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Áp dụng dấu hiệu nhận biết: nếu hai góc đồng vị bằng nhau thì hai đường thẳng song song.',
      steps: [
        'Bước 1: Đặt phương trình đồng vị: 6x + 14 = 8x − 18.',
        'Bước 2: Biến đổi: 14 + 18 = 8x − 6x ⇒ 32 = 2x ⇒ x = 16.',
        'Bước 3: Thay lại để tìm số đo: 6 × 16 + 14 = 110° và 8 × 16 − 18 = 110°.',
        'Bước 4: Cả hai góc đều bằng 110° nên thỏa mãn a ∥ b.',
      ],
      conclusion: 'Vậy x = 16 và hai góc đồng vị đều bằng 110°.',
    },
    diagramConfig: {
      baseAngle: 110,
      isParallel: true,
      highlightAngles: ['A2', 'B2'],
      customLabels: { A2: '110°', B2: '110°' },
    },
  },

  // CÂU VDC 6
  {
    id: 'vdc_q6',
    questionNumber: 6,
    title: 'Câu 6: Bố trí các tầng giá kệ',
    realLifeContext:
      'Trong nhà kho thông minh, các đợt tầng kệ hàng phải tuyệt đối song song với mặt sàn và với nhau để cánh tay robot tự động lấy hàng chuẩn xác.',
    prompt:
      'Một hệ giá kệ có hai thanh ngang a, b song song. Một thanh chéo c cắt hai thanh ngang. Tại giao điểm A, góc trong nằm về một phía của thanh chéo có số đo 124°. Hỏi góc trong cùng phía với nó tại giao điểm B bằng bao nhiêu?',
    options: [
      { id: 'A', text: 'A. 56°.' },
      { id: 'B', text: 'B. 124°.' },
      { id: 'C', text: 'C. 66°.' },
      { id: 'D', text: 'D. 46°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Tính chất hai đường thẳng song song: Hai góc trong cùng phía có tổng số đo bằng 180° (bù nhau).',
      steps: [
        'Bước 1: Nhận diện giả thiết: a ∥ b và hai góc cần xét là cặp góc trong cùng phía.',
        'Bước 2: Áp dụng định lý: tổng số đo của hai góc trong cùng phía bằng 180°.',
        'Bước 3: Gọi số đo góc cần tìm là y: 124° + y = 180° ⇒ y = 180° − 124° = 56°.',
      ],
      conclusion: 'Vậy góc trong cùng phía tại giao điểm B bằng 56°.',
    },
    diagramConfig: {
      baseAngle: 124,
      isParallel: true,
      highlightAngles: ['A4', 'B3'],
      customLabels: { A4: '124°', B3: '56°' },
    },
  },

  // CÂU VDC 7
  {
    id: 'vdc_q7',
    questionNumber: 7,
    title: 'Câu 7: Lắp đặt hệ thống tấm pin mặt trời',
    realLifeContext:
      'Hệ thống dàn khung pin năng lượng mặt trời áp mái được cân chỉnh góc nghiêng tối ưu đón ánh sáng tự nhiên.',
    prompt:
      'Các thanh đỡ của một hệ thống pin mặt trời được lắp song song. Một thanh chéo cắt hai thanh đỡ và tạo thành hai góc trong cùng phía có số đo theo tỉ lệ 4 : 5.\n\n' +
      'Hỏi hai góc đó có số đo là bao nhiêu?',
    options: [
      { id: 'A', text: 'A. 80° và 100°.' },
      { id: 'B', text: 'B. 72° và 108°.' },
      { id: 'C', text: 'C. 60° và 120°.' },
      { id: 'D', text: 'D. 90° và 90°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Sử dụng phương pháp đại số tỉ lệ thức kết hợp tính chất tổng hai góc trong cùng phía bằng 180°.',
      steps: [
        'Bước 1: Do các thanh đỡ song song, hai góc trong cùng phía bù nhau: Tổng số đo = 180°.',
        'Bước 2: Gọi số đo hai góc lần lượt là 4k và 5k (với k > 0).',
        'Bước 3: Lập phương trình: 4k + 5k = 180 ⇒ 9k = 180 ⇒ k = 20.',
        'Bước 4: Tính từng góc: Góc thứ nhất = 4 × 20 = 80°; Góc thứ hai = 5 × 20 = 100°.',
      ],
      conclusion: 'Vậy hai góc trong cùng phía có số đo lần lượt là 80° và 100°.',
    },
    diagramConfig: {
      baseAngle: 80,
      isParallel: true,
      highlightAngles: ['A1', 'B2'],
      customLabels: { A1: '80°', B2: '100°' },
    },
  },

  // CÂU VDC 8
  {
    id: 'vdc_q8',
    questionNumber: 8,
    title: 'Câu 8: Lắp đặt hai thanh ray cầu thang',
    realLifeContext:
      'Tay vịn và thanh trượt ray cầu thang cần được kiểm tra độ nghiêng ăn khớp chính xác để người dùng vịn tay an toàn và tiện lợi.',
    prompt:
      'Hai thanh ray a, b của cầu thang được một thanh giằng c cắt ngang. Hai góc đồng vị được biểu diễn bằng:\n\n' +
      '(2x + 11)° và (5x − 40)°.\n\n' +
      'Kỹ thuật viên muốn chọn x sao cho các góc đồng vị bằng nhau, qua đó xác nhận hai thanh ray song song. Đáp án nào đúng?',
    options: [
      { id: 'A', text: 'A. x = 17; hai góc đều bằng 45°; a ∥ b.' },
      { id: 'B', text: 'B. x = 15; hai góc đều bằng 41°; a ∥ b.' },
      { id: 'C', text: 'C. x = 17; góc thứ nhất bằng 45°, góc thứ hai bằng 40°.' },
      { id: 'D', text: 'D. x = 20; hai góc đều bằng 51°; a ∥ b.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Cân bằng phương trình góc đồng vị để tìm x và kiểm tra số đo khẳng định quan hệ song song.',
      steps: [
        'Bước 1: Thiết lập phương trình góc đồng vị: 2x + 11 = 5x − 40.',
        'Bước 2: Giải phương trình: 11 + 40 = 5x − 2x ⇒ 51 = 3x ⇒ x = 17.',
        'Bước 3: Tính số đo các góc: 2 × 17 + 11 = 45° và 5 × 17 − 40 = 45°.',
        'Bước 4: Vì hai góc đồng vị bằng nhau (= 45°) nên theo dấu hiệu nhận biết ta có a ∥ b.',
      ],
      conclusion: 'Vậy x = 17; hai góc đều bằng 45° và hai thanh ray a ∥ b.',
    },
    diagramConfig: {
      baseAngle: 45,
      isParallel: true,
      highlightAngles: ['A4', 'B4'],
      customLabels: { A4: '45°', B4: '45°' },
    },
  },

  // CÂU VDC 9
  {
    id: 'vdc_q9',
    questionNumber: 9,
    title: 'Câu 9: Đánh giá bằng chứng trong thi công mái nhà',
    realLifeContext:
      'Đánh giá tính hợp lý và chặt chẽ trong suy luận kỹ thuật công trình là năng lực tư duy then chốt của người kỹ sư.',
    prompt:
      'Một người thợ đo hai góc đối đỉnh tại cùng một giao điểm của thanh giằng và thanh ngang. Kết quả đo cho thấy cả hai góc đều bằng 73°. Người thợ kết luận hai thanh ngang ở hai vị trí khác nhau trên mái nhà song song với nhau.\n\n' +
      'Nhận xét nào dưới đây là chính xác nhất?',
    options: [
      {
        id: 'A',
        text: 'A. Kết luận chưa có đủ căn cứ vì hai góc đối đỉnh tại cùng một giao điểm luôn bằng nhau, không đủ để chứng minh hai thanh ngang khác nhau song song.',
      },
      {
        id: 'B',
        text: 'B. Kết luận chắc chắn đúng vì hai góc bằng nhau luôn chứng minh hai đường thẳng song song.',
      },
      {
        id: 'C',
        text: 'C. Kết luận chắc chắn đúng vì 73° là góc nhọn.',
      },
      {
        id: 'D',
        text: 'D. Hai thanh ngang chắc chắn vuông góc vì 73° gần 90°.',
      },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Phân biệt rõ tính chất nội tại tại một giao điểm (góc đối đỉnh) với dấu hiệu so sánh giữa hai giao điểm của cát tuyến với hai đường thẳng phân biệt.',
      steps: [
        'Bước 1: Hai góc đối đỉnh tại một giao điểm luôn bằng nhau theo tính chất hình học cơ bản (bất kể các thanh khác có song song hay không).',
        'Bước 2: Muốn chứng minh hai đường thẳng a và b phân biệt song song, phải có dữ kiện so sánh mối quan hệ góc tại cả hai giao điểm A và B (như một cặp góc so le trong bằng nhau, hoặc đồng vị bằng nhau, hoặc trong cùng phía bù nhau).',
        'Bước 3: Chỉ đo hai góc đối đỉnh tại 1 giao điểm duy nhất thì hoàn toàn chưa có bất kỳ thông tin nào về vị trí của thanh ngang thứ hai.',
      ],
      conclusion:
        'Vậy kết luận của người thợ chưa có căn cứ toán học vững chắc.',
    },
    diagramConfig: {
      baseAngle: 73,
      isParallel: false,
      tiltB: 15,
      highlightAngles: ['A2', 'A4'],
      customLabels: { A2: '73°', A4: '73°' },
    },
  },

  // CÂU VDC 10
  {
    id: 'vdc_q10',
    questionNumber: 10,
    title: 'Câu 10: Đo góc tại nút giao đường nội bộ',
    realLifeContext:
      'Quy hoạch các cung đường nội bộ trong khu đô thị sinh thái đòi hỏi bề rộng làn đường cố định, tương đương với hai mép đường luôn duy trì khoảng cách song song.',
    prompt:
      'Hai đường biên của một lối đi thẳng được biểu diễn bởi hai đường thẳng a và b. Một đường cắt chéo c cắt cả hai đường biên. Hai góc trong cùng phía được đo và biểu diễn:\n\n' +
      '(4x + 8)° và (2x + 22)°.\n\n' +
      'Nếu hai đường biên song song, giá trị nào của x và hai số đo góc là chính xác?',
    options: [
      { id: 'A', text: 'A. x = 25; hai góc bằng 108° và 72°.' },
      { id: 'B', text: 'B. x = 20; hai góc bằng 88° và 62°.' },
      { id: 'C', text: 'C. x = 25; hai góc bằng 100° và 80°.' },
      { id: 'D', text: 'D. x = 30; hai góc bằng 128° và 82°.' },
    ],
    correctOptionId: 'A',
    explanation: {
      summary:
        'Tổng hai góc trong cùng phía của hai đường biên song song bằng 180°.',
      steps: [
        'Bước 1: Do hai đường biên song song, lập phương trình bù nhau: (4x + 8) + (2x + 22) = 180.',
        'Bước 2: Thu gọn: 6x + 30 = 180 ⇒ 6x = 150 ⇒ x = 25.',
        'Bước 3: Tính số đo từng góc: Góc thứ nhất = 4(25) + 8 = 108°; Góc thứ hai = 2(25) + 22 = 72°.',
        'Bước 4: Thử lại: 108° + 72° = 180° (chính xác).',
      ],
      conclusion: 'Vậy x = 25; hai góc trong cùng phía có số đo lần lượt là 108° và 72°.',
    },
    diagramConfig: {
      baseAngle: 72,
      isParallel: true,
      highlightAngles: ['A1', 'B2'],
      customLabels: { A1: '108°', B2: '72°' },
    },
  },
];
