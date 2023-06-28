import * as fs from "fs";
const prompt = require("prompt-sync")();
import Account from "./Account"
import Transaction from "./Transaction"
import {json} from "stream/consumers";
const log4js = require("log4js");
const Accounts : Account[] = [];
const Transactions : Transaction[] = []


log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger("SupportBank.ts");
logger.debug("\n\n\nDebugging SupportBank")

function supportBank() {

    let transactions;
    fs.readFile('DoggyTransactions2014.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            logger.fatal("Error reading file!")
            return;
        }

        transactions = data.split("\n");
        transactions.shift(); //Removes the headers

        for(let x=0; x<transactions.length;x++){
            transactions[x]=transactions[x].replace("\r", "");
            transactions[x] = transactions[x].split(",");
        }
        createAccounts(transactions);
        createTransactions(transactions);

        fs.readFile('Transactions2013.json', 'utf-8', (err, data) => {
            console.log("Reading JSON");
            if (err) {
                console.error(err);
                logger.fatal("Error reading file!")
                return;
            }
            const object = JSON.parse(data);
            createAccounts(object)

            // main();
        })



    });
}

function createAccounts(transactions){
    if(!Array.isArray(transactions)){
        console.log("Its a JSON")
    }
    else {
        console.log("Its a Array")
        let names = transactions.map(line => {
            return [line[1], line[2]];
        })

        for (let i = 0; i < names.length; i++) {
            for (let x = 0; x < names[i].length; x++) {
                logger.debug("Creating account with " + names[i][x]);
                if (!findAccount(names[i][x])) Accounts.push(new Account(names[i][x]));
                else {
                    logger.debug("Account " + names[i][x] + " already exists!")
                }
            }
        }
    }
}

function findAccount(name){
    //Use this to parse in a name, and it will search and return the account or false if not exists
    for(let x = 0; x<Accounts.length;x++) {
        if (Accounts[x].getName() === name) return Accounts[x];
    }
    return false;
}

function createTransactions(transactions){

    transactions.map(transaction => {
        try{
            if(transaction.length != 5) throw "Incorrect Number of Inputs";
            let sender : Account | false = findAccount(transaction[1]);
            let recipient : Account | false = findAccount(transaction[2]);
            if(isNaN(Number(transaction[4]))) throw "Invalid Price Entered"
            let price : number = Number(transaction[4]);
            if(!sender || !recipient) {console.log("Invalid Accounts")
                logger.warn("Transaction made with non-existing accounts. Accounts: "+transaction[1].concat(transaction[2]))}
            else {
                sender.changeBalance((price * -1));
                recipient.changeBalance(price);
                logger.debug("Transaction Created with info: " + transaction)
                Transactions.push(new Transaction(transaction[0], sender, recipient, transaction[3], price));
            }
        }catch(error){
            logger.error("Transaction failed with error "+error);
        }
    })
}

function listAll(){
    console.log("Listing all accounts!")
    for(let x in Accounts) console.log(Accounts[x].toString());
}

function list(usrInput){
    usrInput = usrInput.split(",");
    usrInput.shift();
    let name = usrInput.join(" ");
    let Account : Account | false = findAccount(name);
    if(!Account) {
        console.log("Account doesnt exist!");
        return;
    }else{
        console.log("Listing Transactions made by "+name);
        for(let x = 0; x<Transactions.length; x++){
            let sender = Transactions[x].getSender().getName()
            let recipient = Transactions[x].getRecipient().getName()
            if(sender === name || recipient === name){
                console.log(Transactions[x].toString());
            }
        }

    }

}

function main(){
    console.log("Welcome to SupportBank™\n There are currently two options:\n1.List All \n2.List[Account]")
    let input = prompt("Enter your input: ").split(" ");

    while(input[0] != "List"){
        input = prompt("Enter a valid input!").split(" ");
    }
    let command = input.join();
    if(command === "List,All") listAll();
    else{
        list(command);
    }




}

supportBank();