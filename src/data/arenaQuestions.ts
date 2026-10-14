/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArenaQuestion } from '../types.ts';

export const ARENA_QUESTIONS: ArenaQuestion[] = [
  // CÂU 1
  {
    id: 'arena_q1',
    questionNumber: 1,
    type: 'single_choice',
    title: 'Câu 1: Nhận diện góc so le trong',
    prompt:
      'Quan sát hình vẽ có đường thẳng c cắt hai đường thẳng a và b tại A và B theo quy ước hình học chuẩn. Cặp góc nào dưới đây là một cặp góc so le trong?',
    hint: 'Hai góc so le trong phải nằm giữa hai đường thẳng a, b và nằm ở hai phía đối diện nhau so với cát tuyến c.',
    options: [
      { id: 'A', text: 'A. ∠A₁ và ∠B₃' },
      { id: 'B', text: 'B. ∠A₂ và ∠B₂' },
      { id: 'C', text: 'C. ∠A₂ và ∠A₄' },
      { id: 'D', text: 'D. ∠A₁ và ∠B₂' },
    ],
    correctSingleOption: 'A',
    explanation:
      'Hai góc so le trong nằm giữa hai đường thẳng a và b, đồng thời nằm ở hai phía khác nhau của đường thẳng c. Theo hình vẽ chuẩn, ∠A₁ (dưới trái) và ∠B₃ (trên phải) thỏa mãn cả hai điều kiện trên.',
    positiveFeedback: 'Chính xác! Em đã nhận diện rất chuẩn cặp góc so le trong.',
    encouragingFeedback: 'Hãy kiểm tra cả vị trí nằm giữa hai đường thẳng và nằm về hai phía khác nhau của đường c nhé!',
    knowledgeTopic: 'Góc so le trong',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A1', 'B3'],
    },
  },

  // CÂU 2
  {
    id: 'arena_q2',
    questionNumber: 2,
    type: 'multiple_choice',
    title: 'Câu 2: Chọn tất cả các cặp góc đồng vị',
    prompt: 'Theo sơ đồ chuẩn, hãy chọn tất cả các cặp góc đồng vị trong các phương án dưới đây:',
    hint: 'Các góc đồng vị nằm ở cùng một vị trí tương đối (cùng trên-trái, cùng trên-phải, cùng dưới-trái, cùng dưới-phải). Có tất cả 4 cặp góc đồng vị.',
    options: [
      { id: 'A', text: 'A. ∠A₁ và ∠B₁' },
      { id: 'B', text: 'B. ∠A₂ và ∠B₂' },
      { id: 'C', text: 'C. ∠A₃ và ∠B₃' },
      { id: 'D', text: 'D. ∠A₄ và ∠B₄' },
      { id: 'E', text: 'E. ∠A₁ và ∠B₃' },
      { id: 'F', text: 'F. ∠A₄ và ∠B₂' },
    ],
    correctMultipleOptions: ['A', 'B', 'C', 'D'],
    explanation:
      'Các góc đồng vị nằm ở cùng vị trí tương đối tại hai giao điểm của đường thẳng c với hai đường thẳng a và b. Bốn cặp đồng vị là: ∠A₁–∠B₁ (cùng dưới trái), ∠A₂–∠B₂ (cùng trên trái), ∠A₃–∠B₃ (cùng trên phải) và ∠A₄–∠B₄ (cùng dưới phải).',
    positiveFeedback: 'Xuất sắc! Em đã tìm đủ cả 4 cặp góc đồng vị.',
    encouragingFeedback: 'Nhớ rằng có đúng 4 cặp góc đồng vị nằm ở 4 góc phần tương ứng nhé!',
    knowledgeTopic: 'Góc đồng vị',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'A4', 'B4'],
    },
  },

  // CÂU 3
  {
    id: 'arena_q3',
    questionNumber: 3,
    type: 'numeric_input',
    title: 'Câu 3: Tính góc đối đỉnh',
    prompt: 'Tại giao điểm A, biết ∠A₂ = 67°. Hãy tính số đo của ∠A₄.',
    hint: 'Quan sát vị trí của ∠A₂ (trên trái) và ∠A₄ (dưới phải). Chúng có quan hệ hình học gì tại cùng một giao điểm?',
    numericAnswer: {
      exact: 67,
      acceptedStrings: ['67', '67°', '67 độ', '67 deg'],
      unit: '°',
    },
    explanation:
      '∠A₂ và ∠A₄ là hai góc đối đỉnh tại giao điểm A nên chúng bằng nhau. Do đó ∠A₄ = ∠A₂ = 67°.',
    positiveFeedback: 'Chính xác! Hai góc đối đỉnh luôn có số đo bằng nhau.',
    encouragingFeedback: 'Hai góc đối đỉnh tại cùng một giao điểm thì có số đo như thế nào với nhau nhỉ?',
    knowledgeTopic: 'Góc đối đỉnh',
    diagramConfig: {
      baseAngle: 67,
      isParallel: true,
      highlightAngles: ['A2', 'A4'],
      knownAngles: { A2: 67 },
    },
  },

  // CÂU 4
  {
    id: 'arena_q4',
    questionNumber: 4,
    type: 'matching',
    title: 'Câu 4: Ghép khái niệm với định nghĩa',
    prompt: 'Em hãy ghép mỗi khái niệm ở Cột A với định nghĩa chính xác tương ứng ở Cột B:',
    hint: 'Đọc kỹ từ khóa: "hai phía khác nhau", "cùng một phía", "cùng vị trí tương đối", "đối diện nhau".',
    matchingData: {
      colA: [
        { id: '1', text: '1. Góc đồng vị' },
        { id: '2', text: '2. Góc so le trong' },
        { id: '3', text: '3. Góc trong cùng phía' },
        { id: '4', text: '4. Góc đối đỉnh' },
      ],
      colB: [
        { id: 'a', text: 'a. Hai góc nằm giữa hai đường thẳng và ở hai phía khác nhau của đường thẳng cắt chúng.' },
        { id: 'b', text: 'b. Hai góc đối diện nhau khi hai đường thẳng cắt nhau.' },
        { id: 'c', text: 'c. Hai góc nằm giữa hai đường thẳng và ở cùng một phía của đường thẳng cắt chúng.' },
        { id: 'd', text: 'd. Hai góc nằm ở cùng vị trí tương đối tại hai giao điểm.' },
      ],
      correctPairs: {
        '1': 'd',
        '2': 'a',
        '3': 'c',
        '4': 'b',
      },
    },
    explanation:
      'Định nghĩa chuẩn: 1–d (Đồng vị: cùng vị trí tương đối); 2–a (So le trong: miền giữa hai đường thẳng và khác phía cát tuyến); 3–c (Trong cùng phía: miền giữa hai đường thẳng và cùng một phía cát tuyến); 4–b (Đối đỉnh: hai góc đối diện nhau khi hai đường thẳng cắt nhau).',
    positiveFeedback: 'Tuyệt vời! Em đã phân biệt rất rõ ràng cả 4 khái niệm hình học.',
    encouragingFeedback: 'Hãy chú ý các từ khóa: "khác phía", "cùng phía", "cùng vị trí", "đối diện" để ghép đúng nhé!',
    knowledgeTopic: 'Khái niệm các loại góc',
  },

  // CÂU 5
  {
    id: 'arena_q5',
    questionNumber: 5,
    type: 'matching',
    title: 'Câu 5: Ghép cặp góc với loại góc tương ứng',
    prompt: 'Dựa vào hình vẽ chuẩn, hãy ghép mỗi cặp góc với tên loại góc thích hợp:',
    hint: 'Nhớ lại: A₁ dưới-trái, A₂ trên-trái, A₃ trên-phải, A₄ dưới-phải (tại B tương tự).',
    matchingData: {
      colA: [
        { id: '1', text: '1. ∠A₁ và ∠B₃' },
        { id: '2', text: '2. ∠A₂ và ∠B₂' },
        { id: '3', text: '3. ∠A₁ và ∠B₂' },
        { id: '4', text: '4. ∠A₂ và ∠A₄' },
      ],
      colB: [
        { id: 'a', text: 'a. Góc đồng vị' },
        { id: 'b', text: 'b. Góc so le trong' },
        { id: 'c', text: 'c. Góc trong cùng phía' },
        { id: 'd', text: 'd. Góc đối đỉnh' },
      ],
      correctPairs: {
        '1': 'b',
        '2': 'a',
        '3': 'c',
        '4': 'd',
      },
    },
    explanation:
      'Theo vị trí trên hình SVG chuẩn: ∠A₁ và ∠B₃ nằm ở miền trong, hai phía khác nhau của c ⇒ 1–b (So le trong); ∠A₂ và ∠B₂ cùng ở phía trên bên trái ⇒ 2–a (Đồng vị); ∠A₁ và ∠B₂ nằm ở miền trong, cùng bên trái của c ⇒ 3–c (Trong cùng phía); ∠A₂ và ∠A₄ đối diện qua đỉnh A ⇒ 4–d (Đối đỉnh).',
    positiveFeedback: 'Chính xác 100%! Em đã nắm rất vững vị trí các góc trên sơ đồ.',
    encouragingFeedback: 'Quan sát kỹ vị trí hình học của từng cặp góc trên hình vẽ em nhé!',
    knowledgeTopic: 'Nhận biết các cặp góc trên hình',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A1', 'A2', 'A4', 'B2', 'B3'],
    },
  },

  // CÂU 6
  {
    id: 'arena_q6',
    questionNumber: 6,
    type: 'true_false',
    title: 'Câu 6: Đúng hay sai về tính chất hai đường thẳng song song',
    prompt: 'Giả sử a ∥ b và đường thẳng c cắt cả a và b. Em hãy xác định tính Đúng/Sai của mỗi phát biểu sau:',
    hint: 'Khi hai đường thẳng song song bị cắt bởi một cát tuyến, có các mối quan hệ bằng nhau và bù nhau rõ ràng.',
    trueFalseData: {
      statements: [
        { id: 's1', text: 'Hai góc đồng vị bằng nhau.', correct: true },
        { id: 's2', text: 'Hai góc so le trong bằng nhau.', correct: true },
        { id: 's3', text: 'Hai góc trong cùng phía có tổng bằng 180°.', correct: true },
        { id: 's4', text: 'Tất cả tám góc tạo thành đều bằng nhau.', correct: false },
      ],
    },
    explanation:
      'Khi a ∥ b bị cắt bởi cát tuyến c, các góc đồng vị bằng nhau, các góc so le trong bằng nhau, các góc trong cùng phía bù nhau (tổng 180°). Tám góc tạo thành chỉ gồm 4 góc nhọn bằng nhau và 4 góc tù bằng nhau (hoặc cả 8 góc bằng 90° nếu c ⟂ a), không phải mọi trường hợp đều bằng nhau hết.',
    positiveFeedback: 'Rất sắc sảo! Em đã nhận biết chính xác tính chất song song và tránh được bẫy phát biểu 4.',
    encouragingFeedback: 'Hãy cẩn thận với phát biểu "Tất cả tám góc đều bằng nhau" nhé, góc nhọn và góc tù không bằng nhau!',
    knowledgeTopic: 'Tính chất hai đường thẳng song song',
  },

  // CÂU 7
  {
    id: 'arena_q7',
    questionNumber: 7,
    type: 'numeric_input',
    title: 'Câu 7: Tính góc kề bù',
    prompt: 'Tại giao điểm A, biết ∠A₂ = 118°. Hãy tính số đo của góc kề bù với nó là ∠A₃.',
    hint: 'Hai góc kề bù có tổng số đo bằng bao nhiêu độ?',
    numericAnswer: {
      exact: 62,
      acceptedStrings: ['62', '62°', '62 độ', '62 deg'],
      unit: '°',
    },
    explanation:
      'Vì ∠A₂ và ∠A₃ là hai góc kề bù trên đường thẳng a nên tổng của chúng bằng 180°. Do đó: ∠A₃ = 180° − ∠A₂ = 180° − 118° = 62°.',
    positiveFeedback: 'Quá chuẩn! 180° − 118° = 62°.',
    encouragingFeedback: 'Nhớ công thức: tổng hai góc kề bù luôn bằng 180° em nhé!',
    knowledgeTopic: 'Góc kề bù',
    diagramConfig: {
      baseAngle: 62,
      isParallel: true,
      highlightAngles: ['A2', 'A3'],
      knownAngles: { A2: 118 },
    },
  },

  // CÂU 8
  {
    id: 'arena_q8',
    questionNumber: 8,
    type: 'multiple_choice',
    title: 'Câu 8: Suy luận từ hai đường thẳng song song',
    prompt: 'Cho a ∥ b, đường thẳng c cắt a và b tại A và B. Biết ∠A₂ = 55°. Hãy chọn TẤT CẢ các kết luận đúng:',
    hint: 'Tính số đo các góc tại A (đối đỉnh, kề bù) rồi suy ra các góc tại B nhờ tính chất đồng vị, so le trong.',
    options: [
      { id: 'A', text: 'A. ∠A₄ = 55°' },
      { id: 'B', text: 'B. ∠B₂ = 55°' },
      { id: 'C', text: 'C. ∠B₄ = 55°' },
      { id: 'D', text: 'D. ∠A₁ = 55°' },
      { id: 'E', text: 'E. ∠B₃ = 55°' },
      { id: 'F', text: 'F. ∠A₃ = 125°' },
    ],
    correctMultipleOptions: ['A', 'B', 'C', 'F'],
    explanation:
      'Tại A: ∠A₄ đối đỉnh với ∠A₂ nên ∠A₄ = 55°. ∠A₃ kề bù với ∠A₂ nên ∠A₃ = 180° − 55° = 125°. ∠A₁ đối đỉnh với ∠A₃ nên ∠A₁ = 125°. Vì a ∥ b nên: ∠B₂ = ∠A₂ = 55° (đồng vị), ∠B₄ = ∠A₄ = 55° (đồng vị), ∠B₃ = ∠A₁ = 125° (so le trong). Vậy các kết luận đúng là A, B, C, F.',
    positiveFeedback: 'Trí tuệ tuyệt vời! Em đã suy luận đúng toàn bộ các góc.',
    encouragingFeedback: 'Hãy tính từng góc một theo tính chất đối đỉnh, kề bù và đồng vị/so le trong nhé!',
    knowledgeTopic: 'Suy luận số đo góc khi hai đường thẳng song song',
    diagramConfig: {
      baseAngle: 55,
      isParallel: true,
      highlightAngles: ['A2', 'A4', 'B2', 'B4', 'A3'],
      knownAngles: { A2: 55 },
    },
  },

  // CÂU 9
  {
    id: 'arena_q9',
    questionNumber: 9,
    type: 'ordering',
    title: 'Câu 9: Sắp xếp các bước chứng minh',
    prompt:
      'Cho đường thẳng c cắt hai đường thẳng phân biệt a và b tại A, B. Biết ∠A₁ = ∠B₃. Hãy sắp xếp các bước lập luận để chứng minh a ∥ b:',
    hint: 'Quy trình chứng minh hình học chuẩn: Nêu giả thiết → Chỉ ra vị trí góc → Dẫn chứng dấu hiệu nhận biết → Rút ra kết luận.',
    orderingData: {
      items: [
        { id: 'a', text: 'a. Suy ra a ∥ b.' },
        { id: 'b', text: 'b. ∠A₁ = ∠B₃ theo giả thiết.' },
        { id: 'c', text: 'c. ∠A₁ và ∠B₃ là hai góc so le trong.' },
        { id: 'd', text: 'd. Theo dấu hiệu nhận biết hai đường thẳng song song, nếu một cặp góc so le trong bằng nhau thì hai đường thẳng song song.' },
      ],
      correctOrder: ['b', 'c', 'd', 'a'],
    },
    explanation:
      'Thứ tự lập luận logic chặt chẽ: b (Nêu giả thiết) → c (Xác định vị trí hai góc là so le trong) → d (Áp dụng dấu hiệu nhận biết hai đường thẳng song song) → a (Đưa ra kết luận cuối cùng a ∥ b).',
    positiveFeedback: 'Xuất sắc! Lập luận toán học của em rất mạch lạc và chặt chẽ.',
    encouragingFeedback: 'Hãy nhớ quy tắc: Giả thiết → Vị trí hình học → Dấu hiệu định lý → Kết luận.',
    knowledgeTopic: 'Các bước lập luận chứng minh hình học',
  },

  // CÂU 10
  {
    id: 'arena_q10',
    questionNumber: 10,
    type: 'svg_angle_click',
    title: 'Câu 10: Chọn trực tiếp góc trên hình',
    prompt: 'Quan sát hình vẽ SVG bên dưới. Em hãy chạm/nhấn trực tiếp vào góc so le trong với ∠A₄:',
    hint: '∠A₄ nằm ở giao điểm A, phía dưới bên phải. Góc so le trong với nó phải nằm ở giao điểm B, phía trên bên trái!',
    svgAngleTarget: 'B2',
    explanation:
      '∠A₄ nằm ở miền trong, phía dưới bên phải của cát tuyến c. Góc so le trong với ∠A₄ phải nằm ở miền trong tại đỉnh B, phía đối diện (phía trên bên trái của cát tuyến c). Đó chính là góc ∠B₂.',
    positiveFeedback: 'Chính xác tuyệt đối! Em đã chọn đúng góc ∠B₂ trực tiếp trên hình.',
    encouragingFeedback: 'Hãy quan sát đỉnh B: góc nào nằm giữa hai đường thẳng và đối diện phía với ∠A₄?',
    knowledgeTopic: 'Tương tác trực tiếp trên hình học',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A4'],
      interactive: true,
    },
  },

  // CÂU 11
  {
    id: 'arena_q11',
    questionNumber: 11,
    type: 'matching',
    title: 'Câu 11: Ghép hai cặp góc trong cùng phía',
    prompt: 'Theo sơ đồ hình học chuẩn, em hãy ghép đúng hai cặp góc trong cùng phía:',
    hint: 'Cả hai góc phải nằm ở miền giữa a và b, và cùng nằm về một phía của cát tuyến c (cùng bên trái hoặc cùng bên phải).',
    matchingData: {
      colA: [
        { id: '1', text: '1. Góc trong bên trái: ∠A₁' },
        { id: '2', text: '2. Góc trong bên phải: ∠A₄' },
      ],
      colB: [
        { id: 'x', text: 'x. ∠B₂ (nằm ở phía trên bên trái)' },
        { id: 'y', text: 'y. ∠B₃ (nằm ở phía trên bên phải)' },
      ],
      correctPairs: {
        '1': 'x',
        '2': 'y',
      },
    },
    explanation:
      'Các cặp góc trong cùng phía là những cặp góc nằm trong khoảng giữa hai đường thẳng a và b, cùng ở một phía của đường thẳng c: Cặp bên trái là ∠A₁ và ∠B₂; cặp bên phải là ∠A₄ và ∠B₃. Nếu a ∥ b thì tổng số đo mỗi cặp này bằng 180°.',
    positiveFeedback: 'Hoàn hảo! Em đã ghép đúng cả hai cặp góc trong cùng phía.',
    encouragingFeedback: 'Nhớ xem góc nào cùng nằm bên trái c, góc nào cùng nằm bên phải c nhé!',
    knowledgeTopic: 'Cặp góc trong cùng phía',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A1', 'B2', 'A4', 'B3'],
    },
  },

  // CÂU 12
  {
    id: 'arena_q12',
    questionNumber: 12,
    type: 'matching',
    title: 'Câu 12: Phân loại tính chất và dấu hiệu nhận biết',
    prompt: 'Em hãy ghép mỗi giả thiết ở Cột 1 với kết luận tương ứng phù hợp ở Cột 2:',
    hint: 'Phân biệt: "Biết song song suy ra góc bằng nhau" (Tính chất) và "Biết góc bằng nhau suy ra song song" (Dấu hiệu).',
    matchingData: {
      colA: [
        { id: '1', text: '1. a ∥ b, c cắt hai đường thẳng đó' },
        { id: '2', text: '2. Có một cặp góc so le trong bằng nhau' },
        { id: '3', text: '3. Có một cặp góc đồng vị bằng nhau' },
        { id: '4', text: '4. Có một cặp góc trong cùng phía bù nhau' },
      ],
      colB: [
        { id: 'a', text: 'a. Có thể kết luận hai đường thẳng song song theo dấu hiệu góc đồng vị.' },
        { id: 'b', text: 'b. Các cặp góc đồng vị tương ứng bằng nhau.' },
        { id: 'c', text: 'c. Có thể kết luận hai đường thẳng song song theo dấu hiệu góc so le trong.' },
        { id: 'd', text: 'd. Có thể kết luận hai đường thẳng song song theo dấu hiệu hai góc trong cùng phía bù nhau.' },
      ],
      correctPairs: {
        '1': 'b',
        '2': 'c',
        '3': 'a',
        '4': 'd',
      },
    },
    explanation:
      'Ý 1 là tính chất hai đường thẳng song song: từ song song suy ra góc đồng vị bằng nhau (1–b). Các ý 2, 3, 4 là các dấu hiệu nhận biết hai đường thẳng song song: từ quan hệ góc suy ra hai đường thẳng song song (2–c, 3–a, 4–d).',
    positiveFeedback: 'Tuyệt vời! Em đã phân biệt rất sáng rõ giữa "Tính chất" và "Dấu hiệu nhận biết".',
    encouragingFeedback: 'Tính chất là từ song song suy ra góc, còn dấu hiệu là từ góc suy ra song song!',
    knowledgeTopic: 'Tính chất và dấu hiệu nhận biết',
  },

  // CÂU 13
  {
    id: 'arena_q13',
    questionNumber: 13,
    type: 'single_choice',
    title: 'Câu 13: Vận dụng dấu hiệu góc đồng vị',
    prompt:
      'Đường thẳng c cắt hai đường thẳng phân biệt a, b tại A và B. Nếu ∠A₂ = ∠B₂ thì kết luận nào dưới đây là đúng?',
    hint: 'Xác định vị trí tương đối của ∠A₂ và ∠B₂ trên sơ đồ chuẩn.',
    options: [
      { id: 'A', text: 'A. a ∥ b' },
      { id: 'B', text: 'B. a ⟂ b' },
      { id: 'C', text: 'C. a và b chắc chắn trùng nhau' },
      { id: 'D', text: 'D. Không thể kết luận bất cứ điều gì dù đã biết cắt tại A và B' },
    ],
    correctSingleOption: 'A',
    explanation:
      '∠A₂ và ∠B₂ là hai góc ở vị trí đồng vị (cùng phía trên bên trái). Theo dấu hiệu nhận biết hai đường thẳng song song: nếu một đường thẳng cắt hai đường thẳng phân biệt và trong các góc tạo thành có một cặp góc đồng vị bằng nhau thì hai đường thẳng đó song song. Do đó a ∥ b.',
    positiveFeedback: 'Rất chính xác! Dấu hiệu nhận biết qua góc đồng vị đã được áp dụng đúng.',
    encouragingFeedback: '∠A₂ và ∠B₂ là hai góc đồng vị bằng nhau, ta rút ra được điều gì về hai đường thẳng?',
    knowledgeTopic: 'Dấu hiệu nhận biết hai đường thẳng song song',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A2', 'B2'],
    },
  },

  // CÂU 14
  {
    id: 'arena_q14',
    questionNumber: 14,
    type: 'fill_blank',
    title: 'Câu 14: Điền thuật ngữ còn thiếu',
    prompt:
      'Điền cụm từ thích hợp vào chỗ trống để hoàn thành định lý nhận biết:\n\n“Nếu một đường thẳng cắt hai đường thẳng phân biệt a và b, trong các góc tạo thành có một cặp góc so le trong bằng nhau thì a và b ______.”',
    hint: 'Quan hệ hình học giữa hai đường thẳng a và b khi có một cặp góc so le trong bằng nhau.',
    fillBlankAnswer: {
      acceptedPhrases: [
        'song song',
        'song song với nhau',
        'song song.',
        'song song với nhau.',
        '//',
      ],
    },
    explanation:
      'Dấu hiệu nhận biết hai đường thẳng song song: Nếu một đường thẳng cắt hai đường thẳng phân biệt a và b, trong các góc tạo thành có một cặp góc so le trong bằng nhau thì a và b song song với nhau.',
    positiveFeedback: 'Chính xác! Thuật ngữ cần điền là "song song" (hoặc "song song với nhau").',
    encouragingFeedback: 'Hãy nhớ lại dấu hiệu nhận biết hai đường thẳng qua cặp góc so le trong bằng nhau nhé!',
    knowledgeTopic: 'Phát biểu dấu hiệu nhận biết',
  },

  // CÂU 15
  {
    id: 'arena_q15',
    questionNumber: 15,
    type: 'multiple_choice',
    title: 'Câu 15: Xác định các góc bằng 55°',
    prompt: 'Cho a ∥ b và ∠A₂ = 55°. Trong các góc sau, những góc nào chắc chắn có số đo bằng 55°?',
    hint: 'Góc đối đỉnh với A₂? Góc đồng vị với A₂? Góc đồng vị với góc đối đỉnh của A₂?',
    options: [
      { id: 'A', text: 'A. ∠A₄' },
      { id: 'B', text: 'B. ∠B₂' },
      { id: 'C', text: 'C. ∠B₄' },
      { id: 'D', text: 'D. ∠A₁' },
      { id: 'E', text: 'E. ∠B₃' },
    ],
    correctMultipleOptions: ['A', 'B', 'C'],
    explanation:
      'Vì ∠A₂ = 55°: ∠A₄ = ∠A₂ = 55° (đối đỉnh). Do a ∥ b: ∠B₂ = ∠A₂ = 55° (đồng vị), ∠B₄ = ∠A₄ = 55° (đồng vị). Còn các góc ∠A₁ và ∠B₃ là các góc kề bù nên bằng 180° − 55° = 125°, không phải 55°.',
    positiveFeedback: 'Chuẩn xác! Chỉ có 3 góc ∠A₄, ∠B₂, ∠B₄ là bằng 55°.',
    encouragingFeedback: 'Góc nhọn bằng 55°, còn góc tù bằng 180° − 55° = 125° nhé!',
    knowledgeTopic: 'Tìm các góc bằng nhau khi có hai đường thẳng song song',
    diagramConfig: {
      baseAngle: 55,
      isParallel: true,
      highlightAngles: ['A2', 'A4', 'B2', 'B4'],
      knownAngles: { A2: 55 },
    },
  },

  // CÂU 16
  {
    id: 'arena_q16',
    questionNumber: 16,
    type: 'numeric_input',
    title: 'Câu 16: Tìm x từ góc trong cùng phía',
    prompt:
      'Cho a ∥ b. Một cặp góc trong cùng phía có số đo lần lượt là: ∠A₁ = (3x + 15)° và ∠B₂ = (2x + 25)°. Em hãy tính giá trị của x.',
    hint: 'Hai góc trong cùng phía của hai đường thẳng song song thì bù nhau, tức là tổng của chúng bằng 180°.',
    numericAnswer: {
      exact: 28,
      acceptedStrings: ['28', 'x = 28', 'x=28'],
    },
    explanation:
      'Vì a ∥ b nên hai góc trong cùng phía bù nhau: (3x + 15) + (2x + 25) = 180 ⇒ 5x + 40 = 180 ⇒ 5x = 140 ⇒ x = 28. Khi đó ∠A₁ = 3(28) + 15 = 99° và ∠B₂ = 2(28) + 25 = 81° (99° + 81° = 180°).',
    positiveFeedback: 'Kỹ năng giải phương trình hình học của em quá tuyệt vời! x = 28.',
    encouragingFeedback: 'Lập phương trình: (3x + 15) + (2x + 25) = 180 rồi giải tìm x nhé!',
    knowledgeTopic: 'Đại số hóa hình học: tìm x từ góc trong cùng phía',
  },

  // CÂU 17
  {
    id: 'arena_q17',
    questionNumber: 17,
    type: 'single_choice',
    title: 'Câu 17: Nhận biết điều kiện song song',
    prompt:
      'Đường thẳng c cắt hai đường thẳng phân biệt a, b tại A và B. Biết ∠A₁ = 70° và ∠B₃ = 70°. Kết luận nào dưới đây là đúng?',
    hint: '∠A₁ và ∠B₃ ở vị trí gì đối với hai đường thẳng a, b và cát tuyến c?',
    options: [
      { id: 'A', text: 'A. a ∥ b' },
      { id: 'B', text: 'B. a ⟂ b' },
      { id: 'C', text: 'C. a và b chắc chắn cắt nhau tại một điểm thứ hai' },
      { id: 'D', text: 'D. Chưa thể kết luận vì góc so le trong không liên quan đến hai đường thẳng song song' },
    ],
    correctSingleOption: 'A',
    explanation:
      'Theo sơ đồ chuẩn, ∠A₁ (dưới trái) và ∠B₃ (trên phải) là hai góc so le trong. Vì ∠A₁ = ∠B₃ = 70°, theo dấu hiệu nhận biết hai đường thẳng song song, ta kết luận được a ∥ b.',
    positiveFeedback: 'Chính xác! Cặp góc so le trong bằng nhau chứng minh hai đường thẳng song song.',
    encouragingFeedback: '∠A₁ và ∠B₃ là hai góc so le trong bằng nhau đấy em!',
    knowledgeTopic: 'Dấu hiệu nhận biết qua góc so le trong',
    diagramConfig: {
      baseAngle: 70,
      isParallel: true,
      highlightAngles: ['A1', 'B3'],
      knownAngles: { A1: 70, B3: 70 },
    },
  },

  // CÂU 18
  {
    id: 'arena_q18',
    questionNumber: 18,
    type: 'single_choice',
    title: 'Câu 18: Tìm lỗi trong lập luận',
    prompt: 'Một học sinh lập luận như sau: “Ta có ∠A₂ = ∠A₄. Vậy a ∥ b.” Nhận xét nào dưới đây là chính xác nhất?',
    hint: 'Góc A₂ và A₄ cùng nằm tại một giao điểm A hay ở hai giao điểm khác nhau?',
    options: [
      { id: 'A', text: 'A. Lập luận chưa đủ căn cứ vì đây là hai góc đối đỉnh tại cùng một giao điểm.' },
      { id: 'B', text: 'B. Lập luận đúng vì bất kỳ hai góc bằng nhau nào cũng chứng minh hai đường thẳng song song.' },
      { id: 'C', text: 'C. Lập luận sai vì hai góc đối đỉnh luôn có tổng bằng 180°.' },
      { id: 'D', text: 'D. Lập luận đúng vì A và B là hai điểm phân biệt.' },
    ],
    correctSingleOption: 'A',
    explanation:
      'Hai góc đối đỉnh tại cùng một giao điểm luôn luôn bằng nhau dù hai đường thẳng a và b có song song hay không. Muốn kết luận a ∥ b, cần có dữ kiện liên kết giữa hai giao điểm phân biệt A và B (cặp góc so le trong, đồng vị hoặc trong cùng phía).',
    positiveFeedback: 'Rất sâu sắc! Em đã vạch rõ lỗi ngụy biện trong lập luận hình học.',
    encouragingFeedback: 'Hãy chú ý: hai góc này cùng tại đỉnh A thì luôn bằng nhau, không liên quan đến việc b có song song hay không!',
    knowledgeTopic: 'Tư duy phản biện và lỗi sai thường gặp',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A2', 'A4'],
    },
  },

  // CÂU 19
  {
    id: 'arena_q19',
    questionNumber: 19,
    type: 'ordering',
    title: 'Câu 19: Sắp xếp các bước vẽ đường thẳng song song',
    prompt:
      'Hãy sắp xếp đúng trình tự sử dụng ê-ke và thước thẳng để vẽ đường thẳng b song song với đường thẳng a cho trước:',
    hint: 'Đặt ê-ke vào a → Áp thước vào cạnh kia của ê-ke để làm thanh trượt → Trượt ê-ke → Kẻ đường thẳng b.',
    orderingData: {
      items: [
        { id: 'a', text: 'a. Trượt ê-ke dọc theo thước đang giữ cố định đến vị trí cần vẽ.' },
        { id: 'b', text: 'b. Đặt một cạnh của ê-ke trùng với đường thẳng a.' },
        { id: 'c', text: 'c. Kẻ đường thẳng b theo cạnh tương ứng của ê-ke.' },
        { id: 'd', text: 'd. Đặt thước thẳng sát với cạnh còn lại của ê-ke và giữ cố định thước.' },
      ],
      correctOrder: ['b', 'd', 'a', 'c'],
    },
    explanation:
      'Quy trình thực hành vẽ hai đường thẳng song song bằng ê-ke và thước thẳng: b (Đặt một cạnh ê-ke trùng đường thẳng a) → d (Đặt thước thẳng sát cạnh kia và giữ chặt làm ray trượt) → a (Trượt ê-ke dọc theo thước đến vị trí mong muốn) → c (Kẻ đường thẳng b theo cạnh ê-ke).',
    positiveFeedback: 'Chính xác! Em đã nắm rất vững kỹ năng thực hành vẽ hình học.',
    encouragingFeedback: 'Nhớ nguyên lý: Cạnh ê-ke tạo góc không đổi khi trượt dọc theo thước thẳng cố định!',
    knowledgeTopic: 'Kỹ năng vẽ hai đường thẳng song song bằng dụng cụ',
  },

  // CÂU 20
  {
    id: 'arena_q20',
    questionNumber: 20,
    type: 'single_choice',
    title: 'Câu 20: Tổng hai góc trong cùng phía',
    prompt:
      'Một đường thẳng c cắt hai đường thẳng phân biệt a, b tại A và B. Biết ∠A₁ = 80° và ∠B₂ = 100°. Theo sơ đồ chuẩn, hai góc này là hai góc trong cùng phía. Kết luận nào dưới đây là đúng?',
    hint: 'Tính tổng số đo của ∠A₁ và ∠B₂. Tổng đó bằng bao nhiêu độ?',
    options: [
      { id: 'A', text: 'A. a ∥ b' },
      { id: 'B', text: 'B. a ⟂ b' },
      { id: 'C', text: 'C. a và b chắc chắn trùng nhau' },
      { id: 'D', text: 'D. Không thể kết luận a ∥ b vì hai góc không bằng nhau' },
    ],
    correctSingleOption: 'A',
    explanation:
      'Ta có: ∠A₁ + ∠B₂ = 80° + 100° = 180°. Vì ∠A₁ và ∠B₂ là hai góc trong cùng phía và có tổng số đo bằng 180° (bù nhau), theo dấu hiệu nhận biết hai đường thẳng song song, suy ra a ∥ b.',
    positiveFeedback: 'Hoan hô! Em đã xuất sắc hoàn thành thử thách cuối cùng của Đấu trường trí tuệ!',
    encouragingFeedback: 'Hai góc trong cùng phía bù nhau (tổng bằng 180°) thì hai đường thẳng song song em nhé!',
    knowledgeTopic: 'Dấu hiệu hai góc trong cùng phía bù nhau',
    diagramConfig: {
      baseAngle: 80,
      isParallel: true,
      highlightAngles: ['A1', 'B2'],
      knownAngles: { A1: 80, B2: 100 },
    },
  },
];
