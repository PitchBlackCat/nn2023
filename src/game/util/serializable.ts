export interface ISerializable<T = any> {
  serialize(): Promise<{
    type: string,
    config: T
  }>;
}
