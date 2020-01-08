const fs = require("fs");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let username;
let gotIn = false;
let logins = require("./Logins.json");
fs.writeFile("./Logins.json", JSON.stringify(logins, 0, 2), err => {
    if (err) throw err
});

let lastLogin;

function newUser() {
    rl.question("What do you want your username to be?", (answer) => {
        username = answer;
        if(username.length > 10){
            console.log("Please make the username less than 10 characters!");
            return start()
        }
        if (logins[username.toLowerCase()]) {
             console.log("That user already exists!");
            return start()
        }

        rl.question("What do you want your password to be?", (answer) => {
            if(answer.length > 10){
                console.log("Please make the password less than 10 characters!");
                return start()
            }
            let today = new Date();
            logins[username.toLowerCase()] = {
                password: answer,
                lastLogin: `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}-${today.getHours()}:${today.getMinutes()}`
            };
            console.log(`Created user(Username: ${username}, Password: ${answer})`);

             fs.writeFile("./Logins.json", JSON.stringify(logins, 0, 2), err => {
                if (err) throw err
            });
            console.log(`Thanks for joining ${username}! Next!`);
            return start();
        })
    })
}

async function login() {
    rl.question('What is your username?', (answer) => {
        username = answer;
        if (logins[answer.toLowerCase()]) {
            loginPassword();
        } else {
            console.log("You need to use the correct login!");
            return login();
        }
    });
}

async function loginPassword() {
    rl.question('What is your Password?', (answer) => {
        if (answer === logins[username.toLowerCase()].password) {
            gotIn = true;
            console.log(`Welcome back ${username}! You have not logged in since ${logins[username.toLowerCase()].lastLogin}! Next!`);
            let today = new Date();
            logins[username.toLowerCase()].lastLogin = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}-${today.getHours()}:${today.getMinutes()}`;
            fs.writeFile("./Logins.json", JSON.stringify(logins, 0, 2), err => {
                if (err) throw err
            });
            return start();
        } else {
            console.log("Wrong Password! Try again!");
            return loginPassword(answer);
        }
    })

}

function start() {
    rl.question("New user?", (answer) => {
        if (answer === "Yes" || answer === "yes" || answer === "y") {
            return newUser()
        }
        if (answer === "No" || answer === "no" || answer === "n") {
            return login()
        } else {
            console.log("The answers are yes and no.");
            return start();
        }

    })
}
return start();