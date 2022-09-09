export interface IComment {
    isOwner: boolean;
    canModify: boolean;
    name: string;
    email: string;
    id?: string;
    author: string;
    color: string;
    message: string;
}