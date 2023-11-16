import db from '../config/mysql.js';

export const selectUser = async (username, password) => {
    try {
        const [user] = await db.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password]
        );
    
        return user[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}