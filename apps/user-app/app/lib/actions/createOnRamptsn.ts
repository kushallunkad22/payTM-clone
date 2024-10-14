"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function  createOnRampTransction(amount : number , provider : string) {
 // 1 -> I need to find out who the user is , but I should not pass it as a parameter 
 // If passed as parameter , it can be modified . Hence we should extract user id using next auth using get server session 

 const session = await getServerSession(authOptions)
 const token = Math.random().toString();
 // this token will come from a fetch request form banking api 
//  const token = await axios.get("https://api.hdfcbank.com/getToken", {
//     amount : 
//  })
 const userId = session.user.id;

 if(!userId){
    return {
        message : "User not logged in"
    }
 }
 await prisma.onRampTransaction.create({
    data : {
        userId : Number(userId),
        amount : amount,
        status : "Processing",
        startTime : new Date(),
        provider,
        token : token
    }
 })
 return {
    message : "On Ramp Transaction added"
 }
}