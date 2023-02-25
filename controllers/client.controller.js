import {db} from "../database/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res){

    const user = req.body;

    try {
        
        const userExist = await db.query(`select * from users where email= '${user.email}'`)

        if(userExist){
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

        if(userExist.rowCount === 0 || (bcrypt.compareSync(user.password,userExist.rows[0].password))){
            return res.status(401).send("usuário/senha incorretos");
        }

        await db.query(`insert into sessions (userId,token) values ('${userExist.rows[0].id}','${token}')`);

        return res.status(200).send(token);

    } catch (error) {
        return res.status(500).send(console.log(err.message));
    }
}

export async function usersMe(req, res){

    const auth = req.headers.authorization;
    const token = auth.replace("Bearer ","");

    try {
    
        if(!auth){
            return res.sendStatus(401);
        }

        

    } catch (error) {
        return res.status(500).send(console.log(err.message));
    }
}