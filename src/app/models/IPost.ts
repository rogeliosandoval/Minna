export interface IPost {
    newComment?: boolean;
    commentCount?: number;
    isEdited?: boolean;
    id?: string;
    name: string;
    email: string;
    date: string;
    author: string;
    color: string;
    title: string;
    message: string;
}