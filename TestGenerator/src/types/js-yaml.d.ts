// types/js-yaml.d.ts
declare module 'js-yaml' {
  export function load<T = unknown>(input: string, options?: LoadOptions): T;
  export function dump(input: any, options?: DumpOptions): string;

  export interface LoadOptions {
    filename?: string;
    schema?: any;
    json?: boolean;
  }

  export interface DumpOptions {
    indent?: number;
    noArrayIndent?: boolean;
    skipInvalid?: boolean;
    flowLevel?: number;
    styles?: Record<string, any>;
  }
}
