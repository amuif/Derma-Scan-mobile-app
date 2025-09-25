export interface ScanHistory {
  id: string;
  userId: string;
  imageUrl: string;
  imageQuality: string;
  confidence: number;
  risk: 'HIGH' | 'LOW' | 'MEDIUM';
  notes: string;
  timestamp: string;
}
