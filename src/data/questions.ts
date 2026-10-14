/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types.ts';

export const QUESTIONS_BANK: Question[] = [
  // --- BỘ CÂU HỎI VÍ DỤ 60° ---
  {
    id: 'q_60_soletrong',
    category: 'alternate_corresponding',
    title: 'Câu 1: Góc so le trong với số đo 60°',
    prompt: 'Quan sát hình vẽ, cho biết đường thẳng a song song với đường thẳng b (a // b). Biết góc A₄ = 60°. Hãy xác định góc so le trong với góc A₄ và số đo của góc đó.',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A4', 'B2'],
      knownAngles: { A4: 60 },
      lineALabel: 'a',
      lineBLabel: 'b',
      lineCLabel: 'c',
    },
    options: [
      { id: 'opt_a', text: 'Góc B₂ là góc so le trong với A₄ và B₂ = 60°' },
      { id: 'opt_b', text: 'Góc B₁ là góc so le trong với A₄ và B₁ = 120°' },
      { id: 'opt_c', text: 'Góc B₄ là góc so le trong với A₄ và B₄ = 60°' },
      { id: 'opt_d', text: 'Góc A₂ là góc so le trong với A₄ và A₂ = 60°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Góc A₄ và góc B₂ là cặp góc so le trong, vì a // b nên A₄ = B₂ = 60°.',
      steps: [
        'Bước 1: Góc A₄ nằm ở miền trong (giữa a và b), phía bên phải của cát tuyến c.',
        'Bước 2: Góc B₂ nằm ở miền trong (giữa a và b), phía bên trái của cát tuyến c.',
        'Bước 3: Do đó, A₄ và B₂ là hai góc so le trong.',
        'Bước 4: Vì a // b, theo tính chất hai đường thẳng song song: hai góc so le trong bằng nhau, nên B₂ = A₄ = 60°.',
      ],
      geometricRule: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc so le trong bằng nhau.',
    },
    mathematicalProof: {
      given: 'a // b, c cắt a tại A, c cắt b tại B, A₄ = 60°',
      formula: 'B₂ = A₄ (hai góc so le trong)',
      conclusion: 'B₂ = 60°',
    },
  },

  {
    id: 'q_60_dongvi',
    category: 'alternate_corresponding',
    title: 'Câu 2: Góc đồng vị với số đo 60°',
    prompt: 'Cho hình vẽ với a // b. Biết góc A₄ = 60°. Góc nào sau đây đồng vị với góc A₄ và có số đo bao nhiêu?',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A4', 'B4'],
      knownAngles: { A4: 60 },
    },
    options: [
      { id: 'opt_a', text: 'Góc B₄ đồng vị với A₄ và B₄ = 60°' },
      { id: 'opt_b', text: 'Góc B₂ đồng vị với A₄ và B₂ = 60°' },
      { id: 'opt_c', text: 'Góc B₁ đồng vị với A₄ và B₁ = 120°' },
      { id: 'opt_d', text: 'Góc B₃ đồng vị với A₄ và B₃ = 120°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Góc A₄ và góc B₄ ở vị trí đồng vị (cùng phía dưới bên phải). Do a // b nên B₄ = A₄ = 60°.',
      steps: [
        'Bước 1: Góc A₄ nằm ở phía dưới đường thẳng a, bên phải cát tuyến c.',
        'Bước 2: Góc B₄ nằm ở phía dưới đường thẳng b, bên phải cát tuyến c.',
        'Bước 3: Vì cùng vị trí tương ứng so với cát tuyến và hai đường thẳng nên A₄ và B₄ là hai góc đồng vị.',
        'Bước 4: Vì a // b nên B₄ = A₄ = 60°.',
      ],
      geometricRule: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc đồng vị bằng nhau.',
    },
    mathematicalProof: {
      given: 'a // b, A₄ = 60°',
      formula: 'B₄ = A₄ (hai góc đồng vị)',
      conclusion: 'B₄ = 60°',
    },
  },

  {
    id: 'q_60_doidinh_kebu',
    category: 'special_angles',
    title: 'Câu 3: Góc đối đỉnh và kề bù tại đỉnh A (60°)',
    prompt: 'Quan sát giao điểm A, biết góc A₄ = 60°. Số đo của góc đối đỉnh với A₄ và góc kề bù với A₄ lần lượt là:',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A4', 'A2', 'A1'],
      knownAngles: { A4: 60 },
    },
    options: [
      { id: 'opt_a', text: 'Góc đối đỉnh A₂ = 60°, góc kề bù A₁ = 120°' },
      { id: 'opt_b', text: 'Góc đối đỉnh A₃ = 60°, góc kề bù A₂ = 120°' },
      { id: 'opt_c', text: 'Góc đối đỉnh A₁ = 120°, góc kề bù A₂ = 60°' },
      { id: 'opt_d', text: 'Góc đối đỉnh A₂ = 120°, góc kề bù A₃ = 60°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Góc đối đỉnh với A₄ là A₂ = 60°. Góc kề bù với A₄ là A₁ (hoặc A₃) có số đo 180° - 60° = 120°.',
      steps: [
        'Bước 1: Tia của góc A₂ là tia đối của góc A₄, do đó A₂ đối đỉnh với A₄ nên A₂ = A₄ = 60°.',
        'Bước 2: Góc A₁ kề bù với A₄ tạo thành góc bẹt 180°.',
        'Bước 3: A₁ + A₄ = 180° ⇒ A₁ = 180° - 60° = 120°.',
      ],
      geometricRule: 'Hai góc đối đỉnh thì bằng nhau. Hai góc kề bù có tổng số đo bằng 180°.',
    },
    mathematicalProof: {
      given: 'Góc A₄ = 60°',
      formula: 'A₂ = A₄ = 60°; A₁ = 180° - A₄ = 120°',
      conclusion: 'A₂ = 60°, A₁ = 120°',
    },
  },

  {
    id: 'q_60_trongcungphia',
    category: 'consecutive_interior',
    title: 'Câu 4: Cặp góc trong cùng phía (60° và 120°)',
    prompt: 'Cho a // b, biết góc A₄ = 60°. Cặp góc nào là cặp góc trong cùng phía với A₄ và tổng số đo của chúng bằng bao nhiêu?',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A4', 'B1'],
      knownAngles: { A4: 60, B1: 120 },
    },
    options: [
      { id: 'opt_a', text: 'Góc B₁, tổng A₄ + B₁ = 60° + 120° = 180°' },
      { id: 'opt_b', text: 'Góc B₂, tổng A₄ + B₂ = 60° + 60° = 120°' },
      { id: 'opt_c', text: 'Góc B₃, tổng A₄ + B₃ = 60° + 120° = 180°' },
      { id: 'opt_d', text: 'Góc B₄, tổng A₄ + B₄ = 60° + 60° = 120°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'A₄ và B₁ là hai góc trong cùng phía (cùng ở miền trong và cùng bên phải cát tuyến). Vì a // b nên chúng bù nhau: A₄ + B₁ = 180°.',
      steps: [
        'Bước 1: A₄ và B₁ đều nằm ở miền trong giữa hai đường thẳng a và b.',
        'Bước 2: Cả hai góc đều nằm về phía bên phải của cát tuyến c.',
        'Bước 3: Vậy A₄ và B₁ là cặp góc trong cùng phía.',
        'Bước 4: Vì a // b nên hai góc trong cùng phía bù nhau: A₄ + B₁ = 60° + 120° = 180°.',
      ],
      geometricRule: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc trong cùng phía bù nhau (tổng bằng 180°).',
    },
    mathematicalProof: {
      given: 'a // b, A₄ = 60°, B₁ = 120°',
      formula: 'A₄ + B₁ = 180° (hai góc trong cùng phía)',
      conclusion: 'A₄ + B₁ = 180°',
    },
  },

  // --- BỘ CÂU HỎI VÍ DỤ 40° VÀ 140° ---
  {
    id: 'q_40_140_kebu',
    category: 'special_angles',
    title: 'Câu 5: Quan hệ kề bù giữa 40° và 140°',
    prompt: 'Tại đỉnh A, cho biết góc A₄ = 40°. Góc A₃ kề bù với góc A₄. Hỏi số đo góc A₃ là bao nhiêu?',
    diagramConfig: {
      baseAngle: 40,
      isParallel: true,
      highlightAngles: ['A4', 'A3'],
      knownAngles: { A4: 40 },
    },
    options: [
      { id: 'opt_a', text: 'A₃ = 140° (vì A₃ + A₄ = 180°)' },
      { id: 'opt_b', text: 'A₃ = 40° (vì hai góc bằng nhau)' },
      { id: 'opt_c', text: 'A₃ = 50° (vì phụ nhau)' },
      { id: 'opt_d', text: 'A₃ = 90°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Hai góc kề bù có tổng số đo bằng 180°. Do đó A₃ = 180° - 40° = 140°.',
      steps: [
        'Bước 1: A₃ và A₄ là hai góc kề nhau có hai cạnh ngoài là hai tia đối nhau trên đường thẳng a.',
        'Bước 2: Do đó A₃ và A₄ là hai góc kề bù.',
        'Bước 3: Ta có công thức: A₃ + A₄ = 180°.',
        'Bước 4: Thay số: A₃ = 180° - 40° = 140°.',
      ],
      geometricRule: 'Hai góc kề bù có tổng số đo bằng 180°.',
    },
    mathematicalProof: {
      given: 'A₄ = 40°, A₃ kề bù với A₄',
      formula: 'A₃ = 180° - A₄ = 180° - 40°',
      conclusion: 'A₃ = 140°',
    },
  },

  {
    id: 'q_40_soletrong_tinhtoan',
    category: 'calculation_60_40_140',
    title: 'Câu 6: Tính góc khi biết a // b và góc 40°',
    prompt: 'Cho a // b, đường thẳng c cắt a tại A và cắt b tại B. Biết A₄ = 40°. Hãy tính số đo của góc B₃.',
    diagramConfig: {
      baseAngle: 40,
      isParallel: true,
      highlightAngles: ['A4', 'B3'],
      knownAngles: { A4: 40 },
    },
    options: [
      { id: 'opt_a', text: 'B₃ = 140°' },
      { id: 'opt_b', text: 'B₃ = 40°' },
      { id: 'opt_c', text: 'B₃ = 80°' },
      { id: 'opt_d', text: 'B₃ = 100°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Vì a // b, B₂ so le trong với A₄ nên B₂ = 40°. Góc B₃ kề bù với B₂ nên B₃ = 180° - 40° = 140° (hoặc B₃ đồng vị với A₃ = 140°).',
      steps: [
        'Cách 1: Vì a // b nên góc so le trong B₂ = A₄ = 40°.',
        'Góc B₃ kề bù với B₂ nên B₃ = 180° - B₂ = 180° - 40° = 140°.',
        'Cách 2: Góc A₃ kề bù với A₄ nên A₃ = 180° - 40° = 140°. Vì a // b nên góc đồng vị B₃ = A₃ = 140°.',
      ],
      geometricRule: 'Kết hợp tính chất góc so le trong/đồng vị của hai đường thẳng song song và tính chất góc kề bù.',
    },
    mathematicalProof: {
      given: 'a // b, A₄ = 40°',
      formula: 'B₂ = A₄ = 40° (so le trong); B₃ = 180° - B₂ = 180° - 40° = 140°',
      conclusion: 'B₃ = 140°',
    },
  },

  {
    id: 'q_dauhieu_40_140',
    category: 'parallel_criteria',
    title: 'Câu 7: Dấu hiệu nhận biết song song từ góc 40° và 140°',
    prompt: 'Đường thẳng c cắt hai đường thẳng a và b tại A và B. Biết góc A₄ = 40° và góc B₁ = 140°. Hai đường thẳng a và b có song song không? Vì sao?',
    diagramConfig: {
      baseAngle: 40,
      isParallel: true,
      highlightAngles: ['A4', 'B1'],
      knownAngles: { A4: 40, B1: 140 },
    },
    options: [
      { id: 'opt_a', text: 'Có, vì A₄ và B₁ là hai góc trong cùng phía bù nhau (40° + 140° = 180°)' },
      { id: 'opt_b', text: 'Không, vì 40° khác 140°' },
      { id: 'opt_c', text: 'Có, vì A₄ và B₁ là hai góc so le trong bằng nhau' },
      { id: 'opt_d', text: 'Không đủ điều kiện để kết luận' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'a // b vì đường thẳng c tạo với a và b một cặp góc trong cùng phía bù nhau (40° + 140° = 180°).',
      steps: [
        'Bước 1: Góc A₄ và B₁ nằm ở miền trong và cùng phía bên phải cát tuyến c ⇒ là cặp góc trong cùng phía.',
        'Bước 2: Tính tổng: A₄ + B₁ = 40° + 140° = 180°.',
        'Bước 3: Theo dấu hiệu nhận biết hai đường thẳng song song: Nếu một đường thẳng cắt hai đường thẳng phân biệt mà trong các góc tạo thành có một cặp góc trong cùng phía bù nhau thì hai đường thẳng đó song song.',
        'Bước 4: Kết luận: a // b.',
      ],
      geometricRule: 'Dấu hiệu nhận biết: Một cặp góc trong cùng phía bù nhau thì hai đường thẳng song song.',
    },
    mathematicalProof: {
      given: 'A₄ = 40°, B₁ = 140° (trong cùng phía)',
      formula: 'A₄ + B₁ = 40° + 140° = 180° (bù nhau)',
      conclusion: 'a // b',
    },
  },

  {
    id: 'q_dauhieu_soletrong_bangnhau',
    category: 'parallel_criteria',
    title: 'Câu 8: Dấu hiệu nhận biết qua góc so le trong 60°',
    prompt: 'Cho hình vẽ có góc A₄ = 60° và góc B₂ = 60°. Khẳng định nào sau đây là đúng nhất?',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['A4', 'B2'],
      knownAngles: { A4: 60, B2: 60 },
    },
    options: [
      { id: 'opt_a', text: 'a // b vì có một cặp góc so le trong bằng nhau (A₄ = B₂ = 60°)' },
      { id: 'opt_b', text: 'a cắt b vì hai góc này đối đỉnh' },
      { id: 'opt_c', text: 'a // b vì có hai góc đồng vị bằng 60°' },
      { id: 'opt_d', text: 'Chưa đủ dữ kiện để khẳng định a // b' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Nếu hai góc so le trong bằng nhau (A₄ = B₂ = 60°) thì hai đường thẳng a và b song song.',
      steps: [
        'Bước 1: Nhận diện: A₄ và B₂ là hai góc so le trong.',
        'Bước 2: Đề bài cho: A₄ = 60° và B₂ = 60°, suy ra A₄ = B₂.',
        'Bước 3: Dấu hiệu nhận biết: Khi một cát tuyến cắt hai đường thẳng mà tạo ra cặp góc so le trong bằng nhau thì hai đường thẳng đó song song.',
        'Bước 4: Do đó, a // b.',
      ],
      geometricRule: 'Dấu hiệu nhận biết: Một cặp góc so le trong bằng nhau thì hai đường thẳng song song.',
    },
    mathematicalProof: {
      given: 'A₄ = 60°, B₂ = 60° (so le trong)',
      formula: 'A₄ = B₂ = 60°',
      conclusion: 'a // b',
    },
  },

  {
    id: 'q_dauhieu_dongvi_140',
    category: 'parallel_criteria',
    title: 'Câu 9: Dấu hiệu nhận biết qua góc đồng vị 140°',
    prompt: 'Quan sát hình vẽ, biết góc A₁ = 140° và góc B₁ = 140°. Hai góc này ở vị trí nào và đường thẳng a, b có mối quan hệ gì?',
    diagramConfig: {
      baseAngle: 40,
      isParallel: true,
      highlightAngles: ['A1', 'B1'],
      knownAngles: { A1: 140, B1: 140 },
    },
    options: [
      { id: 'opt_a', text: 'A₁ và B₁ là hai góc đồng vị; suy ra a // b' },
      { id: 'opt_b', text: 'A₁ và B₁ là hai góc so le trong; suy ra a // b' },
      { id: 'opt_c', text: 'A₁ và B₁ là hai góc đối đỉnh; suy ra a cắt b' },
      { id: 'opt_d', text: 'A₁ và B₁ là hai góc trong cùng phía; suy ra a vuông góc với b' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'A₁ và B₁ là cặp góc đồng vị (cùng phía trên bên phải). Vì A₁ = B₁ = 140° nên a // b.',
      steps: [
        'Bước 1: Vị trí của A₁: phía trên đường a, bên phải cát tuyến c.',
        'Bước 2: Vị trí của B₁: phía trên đường b, bên phải cát tuyến c.',
        'Bước 3: Hai góc cùng vị trí tương ứng nên là hai góc đồng vị.',
        'Bước 4: Vì A₁ = B₁ = 140° nên a // b (dấu hiệu nhận biết qua góc đồng vị).',
      ],
      geometricRule: 'Dấu hiệu nhận biết: Một cặp góc đồng vị bằng nhau thì hai đường thẳng song song.',
    },
    mathematicalProof: {
      given: 'A₁ = 140°, B₁ = 140° (đồng vị)',
      formula: 'A₁ = B₁ = 140°',
      conclusion: 'a // b',
    },
  },

  {
    id: 'q_phan_vi_du_khong_song_song',
    category: 'parallel_criteria',
    title: 'Câu 10: Phản ví dụ - Khi nào hai đường thẳng KHÔNG song song?',
    prompt: 'Đường thẳng c cắt hai đường thẳng a và b tại A và B. Biết góc A₄ = 40° và góc so le trong B₂ = 45°. Đường thẳng a và b có song song không?',
    diagramConfig: {
      baseAngle: 40,
      isParallel: false,
      tiltB: 8,
      highlightAngles: ['A4', 'B2'],
      knownAngles: { A4: 40, B2: 45 },
    },
    options: [
      { id: 'opt_a', text: 'Không song song, vì cặp góc so le trong không bằng nhau (40° ≠ 45°)' },
      { id: 'opt_b', text: 'Có song song, vì hai góc chênh nhau không đáng kể' },
      { id: 'opt_c', text: 'Có song song, vì chúng là hai góc nhọn' },
      { id: 'opt_d', text: 'Hai đường thẳng vuông góc với nhau' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Vì cặp góc so le trong không bằng nhau (A₄ = 40° ≠ B₂ = 45°) nên a và b không song song mà sẽ cắt nhau.',
      steps: [
        'Bước 1: A₄ và B₂ là cặp góc so le trong.',
        'Bước 2: Số đo A₄ = 40° và B₂ = 45° ⇒ A₄ ≠ B₂.',
        'Bước 3: Nếu a // b thì bắt buộc hai góc so le trong phải bằng nhau.',
        'Bước 4: Do đó, a và b không song song với nhau.',
      ],
      geometricRule: 'Hai đường thẳng phân biệt bị một cát tuyến cắt mà các cặp góc so le trong không bằng nhau thì không song song.',
    },
    mathematicalProof: {
      given: 'A₄ = 40°, B₂ = 45° (so le trong)',
      formula: 'A₄ ≠ B₂ (40° ≠ 45°)',
      conclusion: 'a không song song với b (a cắt b)',
    },
  },

  {
    id: 'q_tinh_tat_ca_goc_60',
    category: 'calculation_60_40_140',
    title: 'Câu 11: Tính tất cả các góc tại đỉnh B khi biết góc 60°',
    prompt: 'Cho a // b, biết góc A₄ = 60°. Hãy chọn bộ 4 số đo chính xác của (B₁, B₂, B₃, B₄) tại đỉnh B:',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      highlightAngles: ['B1', 'B2', 'B3', 'B4'],
      knownAngles: { A4: 60 },
    },
    options: [
      { id: 'opt_a', text: 'B₁ = 120°, B₂ = 60°, B₃ = 120°, B₄ = 60°' },
      { id: 'opt_b', text: 'B₁ = 60°, B₂ = 120°, B₃ = 60°, B₄ = 120°' },
      { id: 'opt_c', text: 'B₁ = 120°, B₂ = 120°, B₃ = 60°, B₄ = 60°' },
      { id: 'opt_d', text: 'B₁ = 60°, B₂ = 60°, B₃ = 120°, B₄ = 120°' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Tại đỉnh B: B₂ = A₄ = 60° (so le trong), B₄ = B₂ = 60° (đối đỉnh); B₁ = 180° - 60° = 120° (kề bù), B₃ = B₁ = 120° (đối đỉnh).',
      steps: [
        'Bước 1: Góc so le trong B₂ = A₄ = 60°.',
        'Bước 2: Góc đối đỉnh B₄ = B₂ = 60°.',
        'Bước 3: Góc kề bù B₁ = 180° - B₂ = 180° - 60° = 120°.',
        'Bước 4: Góc đối đỉnh B₃ = B₁ = 120°.',
        'Vậy (B₁, B₂, B₃, B₄) = (120°, 60°, 120°, 60°).',
      ],
      geometricRule: 'Tính chất hai đường thẳng song song kết hợp đối đỉnh và kề bù.',
    },
    mathematicalProof: {
      given: 'a // b, A₄ = 60°',
      formula: 'B₂ = 60°, B₁ = 120°, B₃ = 120°, B₄ = 60°',
      conclusion: '(120°, 60°, 120°, 60°)',
    },
  },

  {
    id: 'q_dinh_ly_cung_song_song',
    category: 'parallel_criteria',
    title: 'Câu 12: Định lý từ vuông góc đến song song & cùng song song',
    prompt: 'Cho ba đường thẳng phân biệt a, b, d. Biết a // d và b // d. Kết luận nào sau đây là chính xác?',
    diagramConfig: {
      baseAngle: 60,
      isParallel: true,
      lineALabel: 'a',
      lineBLabel: 'b',
      lineCLabel: 'd',
    },
    options: [
      { id: 'opt_a', text: 'a // b (Hai đường thẳng phân biệt cùng song song với đường thẳng thứ ba thì song song với nhau)' },
      { id: 'opt_b', text: 'a cắt b tại một điểm' },
      { id: 'opt_c', text: 'a vuông góc với b' },
      { id: 'opt_d', text: 'a trùng với b' },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      summary: 'Theo định lý toán 7: Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì chúng song song với nhau.',
      steps: [
        'Đề bài cho a và b là hai đường thẳng phân biệt.',
        'Cả a và b đều song song với đường thẳng thứ ba d (a // d và b // d).',
        'Theo tính chất bắc cầu của quan hệ song song (hệ quả tiên đề Euclid): a // b.',
      ],
      geometricRule: 'Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì song song với nhau.',
    },
    mathematicalProof: {
      given: 'a, b, d phân biệt; a // d và b // d',
      formula: 'Theo định lý bắc cầu đường song song',
      conclusion: 'a // b',
    },
  },
];
