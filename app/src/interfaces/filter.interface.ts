export interface Filter extends Omit<any, "id" | "complete"> {
  complete: number | undefined;
  enabled: boolean;
}