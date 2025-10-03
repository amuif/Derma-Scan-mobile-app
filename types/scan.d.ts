export interface Scan {
  id: string;
  userId: string;
  imageUrl: string;
  imageQuality: string;
  confidence: number;
  conditions: ScanCondition;
  risk: 'HIGH' | 'LOW' | 'MEDIUM';
  notes: string;
  timestamp: string;
}

export interface ScanCondition {
  id: string;
  scanId: string;
  conditionId: string;
  scan: Scan;
  condition: Condition;
  confidence: number;
}
export interface Condition {
  id: string;
  name: string[];
  description: string;
  scans: ScanCondition[];
}

export interface CheckImage {
  conditions: string[];
  confidence: number;
  message: string;
  timestamp: string;
}
export interface CheckImageResponse {
  conditions: string[];
  confidence: number;
  message: string;
  timestamp: string;
}

export interface PredictionResult {
  conditions: string[];
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  symptomNote: string;
  timestamp: string;
  message?: string;
}
