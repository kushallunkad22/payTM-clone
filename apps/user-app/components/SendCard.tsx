"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/Center";
import { TextInput } from "@repo/ui/TextInput";
import { useState } from "react";
import { p2pTranfer } from "../app/lib/actions/p2ptransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState(0);

    return <div className="h-[90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(Number(value))
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                                await p2pTranfer(number, amount * 100)
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}