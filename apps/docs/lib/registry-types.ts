export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

export interface Registry {
  $schema?: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}
