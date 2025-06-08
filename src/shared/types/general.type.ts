export type GenderType = 'male' | 'female' | 'other';
export type ChatType = 'private' | 'group' | 'public';
export type ObjectLiteral = {
    [key: string]: any;
  };

export type LoginForm = {
  email: string;
  password: string
}

export type MessageType = {
    userId: string,
    text: string,
    sentAt: Date,
    read: boolean
}

export type CommentType = {
    userId: string,
    username: string,
    text: string,
    likes: number,
}

export type UploadPostDTO = {
    userId: string,
    quoteId?: string, 
    title: string,
    text?: string,
    uploads?: any,
    hashtags?: string[],
    tags?: string[],
}