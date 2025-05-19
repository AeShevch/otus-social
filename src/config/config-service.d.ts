import type { EConfig } from '@otus-social/config/types';

type TConfigKeyTypeMap = {
  [EConfig.DATABASE_HOST]: string;
  [EConfig.DATABASE_PORT]: number;
  [EConfig.DATABASE_USER]: string;
  [EConfig.DATABASE_PASSWORD]: string;
  [EConfig.DATABASE_NAME]: string;
  [EConfig.JWT_SECRET]: string;
  [EConfig.JWT_EXPIRES_IN]: string;
};

declare module '@nestjs/config' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ConfigService {
    get<K extends EConfig>(key: K): TConfigKeyTypeMap[K];
    get<K extends EConfig, D>(
      key: K,
      defaultValue: D,
    ): TConfigKeyTypeMap[K] | D;
  }
}
