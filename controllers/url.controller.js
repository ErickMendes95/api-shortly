import { nanoid } from "nanoid";
import {db} from "../database/database.js";

export async function urlShorten(req,res){

    const auth = req.headers.authorization;
    const token = auth.replace('Bearer ','');
    const {url} = req.body
    const shortUrl = nanoid(12);

    try {

        const user = await db.query(`select * from session where token= '${token}'`)
        
        if(user.rowCount === 0){
            return res.sendStatus(401);
        }
        
        await db.query(`insert into "shortenedUrls" ("userId",url,"shortUrl","visitCount") values ('${user.rows[0].userId}','${url}','${shortUrl},0)`);
        
        const sendObject = await db.query(`select id,"shortUrl" from "shortenedUrls" where "shortUrl"= '${shortUrl}`);

        return res.status(201).send(sendObject.rows[0]);

    } catch (error) {
        return res.status(500).send(console.log(error.message));
    }

}

export async function getUrls(req,res){

    try {

        const {id} = req.params

        const url = await db.query(`select * from "shortenedUrls" where id= ${id}`);

        if(url.rowCount === 0){
            return res.sendStatus(404);
        }

        const sendObject = {
            id: url.rows[0].id,
            shortUrl: url.rows[0].shortUrl,
            url: url.rows[0].url
        }

        return res.status(200).send(sendObject);
        
    } catch (error) {
        return res.status(500).send(console.log(error.message));
    }
}

export async function openUrl(req,res){

    const {shortUrl} = req.params

    try {

        const url = (`select * from "shortenedUrls" where "shortUrl"= '${shortUrl}'`)

        if(url.rowCount === 0){
            return res.sendStatus(404)
        }

        const visitcount = url.rows[0].visitCount + 1;

        await db.query(`update "shortenedUrls" set "visitCount" = '${visitcount}' where id= '${url.rows[0].id}'`)

        return res.redirect(`${url.rows[0].url}`);

    } catch (error) {
        return res.status(500).send(console.log(error.message));
    }
}

export async function deleteUrl(req,res){

    const {id} = req.params
    const auth = req.headers.authorization;
    const token = auth.replace("Bearer ","");

    try {
        
        const user = await db.query(`select * from sessions where token= '${token}'`);
        
        if(!user.rowCount === 0){
            return res.sendStatus(401);
        }

        const url = (`select * from "shortenedUrls" where id= '${id}'`);

        if(url.rowCount === 0){
            return res.sendStatus(404)
        }
        if(user.rows[0].userId !== url.rows[0].userId){
            return res.sendStatus(401);
        }
        

        await db.query(`delete from "shortenedUrls" where id= '${id}'`)

        return res.sendStatus(204);

    } catch (error) {
        return res.status(500).send(console.log(error.message));
    }
}