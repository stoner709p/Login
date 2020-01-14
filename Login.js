// Require needed packages and jsons.
const fs = require("fs");
const readline = require("readline");
const Crypter = require("cryptr");
let logins = require("./Logins.json");

// Setup readline as "rl"
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Create start() function to ask if the user has logged in before
function start() {
    // Use readline to ask if the person is a new user
    rl.question("New user? ", (answer) => {
        // If the person says yes, run the newUser() function and return
        if (answer === "Yes" || answer === "yes" || answer === "y") {
            return newUser()
        }

        // If the person says no, run the login() function and return
        if (answer === "No" || answer === "no" || answer === "n") {
            return checkUsername()
        }

        // If the person did not respond with yes or no, restart the program
        else {
            console.log("The answers are yes and no.");
            return start();
        }

    })
}

// Create function newUser() to add new users to the json
function newUser() {
    // Use readline to ask the user what their username should be
    rl.question("What do you want your username to be? ", (answer) => {
        // Have username = answer so I can pass it to the next question
        let username = answer;

        // If the input username is larger than 10 characters, restart telling the person that it has to be less than 10 characters.
        if (username.length > 10) {
            console.log("Please make the username less than 10 characters!");
            return start()
        }

        // If the user's input is cancel, restart the program
        if (username.toLowerCase() === "cancel") {
            return start();
        }

        // If the input username is already part of the array, restart saying that the user already exists.
        if (logins[username.toLowerCase()]) {
            console.log("That user already exists!");
            return start()
        }

        // Use readline to ask the user what their password should be
        rl.question("What do you want your password to be? ", (answer) => {
            // If the input password is larger than 10 characters, restart telling the person that it has to be less than 10 characters.
            if (answer.length > 10) {
                console.log("Please make the password less than 10 characters!");
                return start()
            }

            // Have today equal to "new Date()" so that I can log the date of creation/last login
            let today = new Date();

            // Add the user to the logins array
            logins[username.toLowerCase()] = {
                password: answer,
                lastLogin: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}-${today.getHours()}:${today.getMinutes()}`
            };

            // Tell the user that their login has been created
            console.log(`Created user(Username: ${username}, Password: ${answer})`);

            // Write to the Logins.json with the strigified version of logins
            fs.writeFile("./Logins.json", JSON.stringify(logins, 0, 2), err => {
                if (err) throw err
            });

            // Thank the user for joining the login system
            console.log(`Thanks for joining ${username}!`);

            // Restart from the beginning of the program
            return start();
        })
    })
}

// Create the function "checkUsername()" to ask the user for their username
function checkUsername() {
    // Use readline to ask the user what their username is
    rl.question('What is your username? ', (answer) => {
        // Have username = answer for later reference
        let username = answer;

        // If the user's input is cancel, restart the program
        if (username.toLowerCase() === "cancel") {
            return start()
        }

        // If the username exists, run the loginpassword function passing the username through
        if (logins[answer.toLowerCase()]) {
            loginPassword(username);
        }

        // If the username doesn't exist, restart the login function
        else {
            console.log("You need to use the correct login! To cancel type 'cancel'!");
            return checkUsername();
        }
    });
}

// Create the function "loginPassword()" with the parameter "username"
function loginPassword(username) {
    // Use readline to ask what the user's password is
    rl.question('What is your Password? ', (answer) => {
        // If the password is correct, call the login function
        if (answer === logins[username.toLowerCase()].password) {
            login(username)

        // If the password is wrong restart the "loginPassword()" function and tell the user
        } else {
            console.log("Wrong Password! Try again!");
            return loginPassword(answer);
        }
    })
}

// Create the function "login()"
function login(username) {
    // Tell the user "Welcome back" and the last time they logged in
    console.log(`Welcome back ${username}! You have not logged in since ${logins[username.toLowerCase()].lastLogin}!`);

    // Set today equal to 'new Date()' for the saving last login
    let today = new Date();

    // Set the user's last login equal to the current date and time
    logins[username.toLowerCase()].lastLogin = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}-${today.getHours()}:${today.getMinutes()}`;

    // Save the new last login to Logins.json
    fs.writeFile("./Logins.json", JSON.stringify(logins, 0, 2), err => {
        if (err) throw err
    });

    // Pass the user to the "system()" function
    return system(username)
}

// Create the function "system()"
function system(username) {
    // Ask the user weather thy would like to encrypt or decrypt
    rl.question('Do you want to encrypt or decrypt?(Input "logout" to logout) ', (answer) => {
        // If the user inputs "encrypt" pass the user over to the "encrypt()" function
        if (answer.toLowerCase() === "encrypt") {
            encrypt(username);
        }

        // If the user inputs "decrypt" pass the user over to the "decrypt()" function
        if (answer.toLowerCase() === "decrypt") {
            decrypt(username)
        }

        // If the user inputs "logout()" say thank you and restart the program for the next user
        if (answer.toLowerCase() === "logout") {
            console.log(`Thank you for using my system ${username}!`);
            return start();
        }

        else {
            // If the user does not input any of the accepted strings, restart the "system()" function
            console.log("You can input 'logout', 'decrypt', or 'encrypt'!");
            return system(username)
        }
    })
}

// Create the "encrypt()" function
function encrypt(username) {
    // Ask the user what data they would like to encrypt
    rl.question('What do you want to encrypt? ', (text) => {
        // If the user responds "cancel" pass them back over to the "system()" function
        if (text.toLowerCase() === 'cancel') {
            return system(username)
        }

        // Ask what their key should be
        rl.question('What should your key be? ', (keyInput) => {
            // Pass the key input to cryptr to create a proper key from the string
            const key = new Crypter(keyInput);

            // Encrypt the string using the key made earlier
            const encrypted = key.encrypt(text);

            // Tell the user what the encrypted string is, aswell as their key
            console.log('Encrypted: ', encrypted);
            console.log('Selected Key:', keyInput);

            // Pass the user back to the "system()" function
            return system(username)
        })

    })
}

// Create the "decrypt()" function
function decrypt(username) {
    // Ask the user what data they would like to decrypt
    rl.question('What do you want to decrypt? ', (text) => {
        // If the user responds "cancel"
        if (text.toLowerCase() === 'cancel') {
            return system(username)
        }

        // Ask the user to input their selected key
        rl.question('What is your key? ', (keyInput) => {
            // Use a "try{}" so the program does not crash when it errors (It will error if the wrong key is input)
            try {
                // Pass the key input to crypter to create a proper key from the string
                const key = new Crypter(keyInput);

                // Decrypt the string using the key made earlier
                const Decrypted = key.decrypt(text);

                // Tell the user the decrypted string
                console.log('Decrypted: ', Decrypted);

                // Pass the user back to the "system()" function
                return system(username)

            } catch (error) {
                // If there is an error caught, console.log that there was an error and pass the user back to the "system()" function
                if (error) {
                    console.log("There was an error!");
                    return system(username)
                }
            }

        })
    })
}

// Start the program after creating the functions (Could be moved to the top)
return start();