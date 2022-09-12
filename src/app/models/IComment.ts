export interface IComment {
    avatarURL: string;
    isOwner: boolean;
    canModify: boolean;
    name: string;
    email: string;
    date: string;
    id?: string;
    author: string;
    color: string;
    message: string;
}