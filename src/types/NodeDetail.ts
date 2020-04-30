export interface NodeDetail {
  key: string;
  title: string;
  error?: string
}

export interface NodeDetailsMap {
  [key: string]: NodeDetail;
}
