"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTranfer(to : string, amount : number){
    const session = await getServerSession(authOptions)
    const from = session.user?.id;

    if(!from){
       return {
           message : "User not logged in"
       }
    }
    const toUser = await prisma.user.findFirst({
        where : {
            number : to
        }
    });

    if(!toUser){
        return {
            message : "User not found"
        }
    }
    
    await prisma.$transaction(async(tx) => {
        // using locks in the postgres database . 
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
        //locks this row in the db until the transction completes.  -> the transctions will happen sequentially for the same user 

        const fromBalance = await tx.balance.findUnique({
            where : {userId : Number(from)},
        });
        if(!fromBalance || fromBalance.amount  < amount) {
            throw new Error('Insufficent funds')
        }
        await tx.balance.update({
            where : {userId : Number(from)},
            data : {amount : {decrement : amount}},
        })
        await tx.balance.update({
            where : {userId : toUser.id},
            data : {amount : {increment : amount}},
        });
        
        await tx.p2pTransfer.create({
            data : {
                fromUserId : Number(from),
                toUserId   : toUser.id,
                amount,
                timestamp : new Date()
            }
        })
    });
}