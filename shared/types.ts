export interface WordEntry {
  id?: string;
  word: string;
  definitions: any[];
  context?: string;
  sourceUrl?: string;
  dateSaved: string;
  tags: string[];
  notes?: string;
}
