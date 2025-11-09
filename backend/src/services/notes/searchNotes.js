import { Op } from "sequelize";
import NoteData from "../../models/Note.js";

export async function searchNotes(user_uuid,keyword){
    if (!user_uuid) throw new Error("User ID is required");

    if (!keyword || keyword.trim().length===0) throw new Error ("Search keyword cannot be empty")

        const results = await NoteData.findAll({
            where:{
                user_uuid,
                [Op.or]:[
                     { title: { [Op.iLike]: `%${keyword}%` } },
                     { content: { [Op.iLike]: `%${keyword}%` } },
                ]
            },
            order: [["updatedAt", "DESC"]],
        });
        return results;
}

