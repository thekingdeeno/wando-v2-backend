export type GenderType = 'male' | 'female' | 'other';
export type ChatType = 'private' | 'group' | 'public';
export type ObjectLiteral = {
    [key: string]: any;
  };

export type LoginForm = {
  email: string;
  password: string
}