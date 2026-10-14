/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AngleName = 'A1' | 'A2' | 'A3' | 'A4' | 'B1' | 'B2' | 'B3' | 'B4';

export type ModuleId =
  | 'BAI9_LUYEN_TAP_SGK'
  | 'BAI9_DAU_TRUONG_TRI_TUE'
  | 'BAI9_VAN_DUNG_CAO';

export interface AngleSpec {
  id: AngleName;
  vertex: 'A' | 'B';
  index: 1 | 2 | 3 | 4;
  label: string;
  quadrant: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right';
  description: string;
  isInterior: boolean;
  sideOfTransversal: 'left' | 'right';
}

export type AngleRelationType =
  | 'alternate_interior' // So le trong
  | 'corresponding'      // Đồng vị
  | 'consecutive_interior' // Trong cùng phía
  | 'vertical'           // Đối đỉnh
  | 'adjacent_supplementary'; // Kề bù

export interface Question {
  id: string;
  category: 'special_angles' | 'alternate_corresponding' | 'consecutive_interior' | 'parallel_criteria' | 'calculation_60_40_140';
  title: string;
  prompt: string;
  diagramConfig: {
    baseAngle: number; // e.g. 60 or 40 or 140
    isParallel: boolean;
    highlightAngles?: AngleName[];
    knownAngles?: { [key in AngleName]?: number };
    customLabels?: { [key in AngleName]?: string };
    showProtractor?: boolean;
    tiltB?: number;
    lineALabel?: string;
    lineBLabel?: string;
    lineCLabel?: string;
  };
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: {
    summary: string;
    steps: string[];
    geometricRule: string;
  };
  mathematicalProof: {
    given: string;
    formula: string;
    conclusion: string;
  };
}

export type InteractionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'numeric_input'
  | 'fill_blank'
  | 'matching'
  | 'true_false'
  | 'ordering'
  | 'svg_angle_click';

export interface ArenaQuestion {
  id: string;
  questionNumber: number; // 1 -> 20
  type: InteractionType;
  title: string;
  prompt: string;
  hint: string;
  explanation: string;
  positiveFeedback: string;
  encouragingFeedback: string;
  knowledgeTopic: string;
  diagramConfig?: {
    baseAngle: number;
    isParallel: boolean;
    highlightAngles?: AngleName[];
    knownAngles?: { [key in AngleName]?: number };
    customLabels?: { [key in AngleName]?: string };
    interactive?: boolean;
  };
  options?: { id: string; text: string }[];
  correctSingleOption?: string;
  correctMultipleOptions?: string[];
  numericAnswer?: {
    exact: number;
    acceptedStrings: string[];
    unit?: string;
  };
  fillBlankAnswer?: {
    acceptedPhrases: string[];
  };
  matchingData?: {
    colA: { id: string; text: string }[];
    colB: { id: string; text: string }[];
    correctPairs: { [key: string]: string }; // idA -> idB
  };
  trueFalseData?: {
    statements: { id: string; text: string; correct: boolean }[];
  };
  orderingData?: {
    items: { id: string; text: string }[];
    correctOrder: string[]; // e.g. ['b', 'c', 'd', 'a']
  };
  svgAngleTarget?: AngleName;
}

export interface AdvancedQuestion {
  id: string;
  questionNumber: number; // 1 -> 10
  title: string;
  realLifeContext: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: {
    summary: string;
    steps: string[];
    conclusion: string;
  };
  diagramConfig?: {
    baseAngle: number;
    isParallel: boolean;
    tiltB?: number;
    highlightAngles?: AngleName[];
    knownAngles?: { [key in AngleName]?: number };
    customLabels?: { [key in AngleName]?: string };
  };
}

export interface StudentProfile {
  id: string;
  name: string;
  school: string;
  className: string;
  avatar: string;
}

export interface AttemptState {
  questionId: string;
  attemptsCount: number; // 0, 1, 2
  isCompleted: boolean;
  isCorrect: boolean;
  earnedScore: number;
  userSelectedOptions: any;
  completedAt?: string;
  canRetry?: boolean;
}

export interface SessionData {
  sessionId: string;
  moduleId: ModuleId;
  student: StudentProfile;
  startTime: number;
  attempts: Record<string, AttemptState>;
  totalScore: number;
  maxScore: number;
  isFinished: boolean;
  firstTryCorrectCount?: number;
  retryCorrectCount?: number;
  wrongCount?: number;
}

export interface LeaderboardEntry {
  id: string;
  moduleId?: ModuleId;
  name: string;
  school: string;
  className: string;
  avatar: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  isCurrentSession?: boolean;
}

export interface SheetsConfig {
  webAppUrl: string;
  isConnected: boolean;
  status: 'demo' | 'connected' | 'error';
  lastSyncTime?: string;
  pendingRecordsCount: number;
}

export interface MathTestRunResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}
