/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare module 'uuid' {
  export function v1(options?: any, buffer?: any, offset?: number): string;
  export function v4(options?: any, buffer?: any, offset?: number): string;
  export function v3(name: string | number[], namespace: string | number[]): string;
  export function v5(name: string | number[], namespace: string | number[]): string;
}
