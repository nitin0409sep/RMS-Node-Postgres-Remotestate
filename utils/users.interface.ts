export interface User {
    user_id: string,
    user_name: string,
    user_email: string,
    user_password: string,
    created_by: number,
    user_roles: number[],
    created_at: Date,
    updated_at: Date,
}