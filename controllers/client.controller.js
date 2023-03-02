import {db} from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res){

    const user = req.body;

    try {
        
        const userExist = await db.query(`select * from users where email= '${user.email}'`)

        if(userExist.rowCount === 1){
            return res.status(409).send("usuário já cadastrado")
        }

        const hashPassword = bcrypt.hashSync(user.password,10);

        await db.query(`insert into users (name,email,password) values ('${user.name}','${user.email}','${hashPassword}')`);

        return res.status(201).send("usuário cadastrado com sucesso")

    } catch (error) {
        return res.status(500).send(console.log(err.message));
    }
}

export async function signIn(req, res){

    const user = req.body;
    const token = uuid()

    try {
        
        const userExist = await db.query(`select * from users where email= '${user.email}'`);

        if(userExist.rowCount === 0 || bcrypt.compareSync(user.password,userExist.rows[0].password) === false){
            return res.status(401).send("usuário/senha incorretos");
        }

        await db.query(`insert into session ("userId",token) values ('${userExist.rows[0].id}','${token}')`);

        return res.status(200).send({token});

    } catch (error) {
        return res.status(500).send(console.log(err.message));
    }
}

export async function usersMe(req, res){

    const auth = req.headers.authorization;
    const token = auth.replace("Bearer ","");

    try {

        const session = await db.query(`select * from session where token= '${token}'`);

        if(session.rowCount === 0){
            return res.sendStatus(401);
        }

        const user = await db.query(`select * from users where id= '${session.rows[0].userId}'`);

        const userUrls = await db.query(`select * from "shortenedUrls" where "userId"= '${user.rows[0].id}' order by "shortenedUrls".id`)

        const visitCount = await db.query(`select SUM("visitCount") from "shortenedUrls" where "userId"= '${user.rows[0].id}'`)

        const array = userUrls.rows.map((u) => ({
                id: u.id,
                shortUrl: u.shortUrl,
                url: u.url,
                visitCount: u.visitCount
            }))

        const sendObject = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitCount: visitCount.rows[0],
            shortenedUrls: array
        }

        return res.status(200).send(sendObject)

    } catch (error) {
        return res.status(500).send(console.log(err.message));
    }
}

export async function ranking(req,res){

    try {

        const users = await db.query(`select users.id,users.name,"shortenedUrls".count("userId") AS "linksCount",
        "shortenedUrls".count("visitCount") AS "visitCount" from users left join "shortenedUrls" on "userId"= users.id
        order by visit_count desc limit 10`);

        res.status(200).send(users.rows);
        
    } catch (error) {
        return res.status(500).send(console.log(err.message));
    }
}