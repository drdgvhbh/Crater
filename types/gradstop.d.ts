declare module 'gradstop' {
  export interface GradStopParams {
    stops: number;
    inputFormat: 'hex';
    colorArray: string[];
  }
  export default function gradstop(params: GradStopParams): string[];
}
