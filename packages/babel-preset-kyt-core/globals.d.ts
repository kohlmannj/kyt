declare module NodeJS {
  interface ProcessEnv {
    KYT_ENV_TYPE?: 'client' | 'server' | 'test';
  }
}
