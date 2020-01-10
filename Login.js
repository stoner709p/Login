// Require needed packages and jsons.
const fs = require("fs");
const readline = require('readline');
const NodeRSA = require('node-rsa')
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
		if(username.toLowerCase() === "cancel"){
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
			console.log(`Thanks for joining ${username}! Next!`);
			// Restart from the beginning of the program
			return start();
		})
	})
}
// Create the function "checkUsername()" to ask the user for their username
function checkUsername() {
    // Use readline to ask the user what their username is
	rl.question('What is your username? ', (answer) => {
	    // have username = answer for later reference
		let username = answer;
		// If the user's input is cancel, restart the program
		if(username.toLowerCase() === "cancel"){
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
		} else {
			console.log("Wrong Password! Try again!");
			return loginPassword(answer);
		}
	})
}
// Create the function "login()"
function login(username) {
    // Tell the user "Welcome back" and the last time they logged in
    console.log(`Welcome back ${username}! You have not logged in since ${logins[username.toLowerCase()].lastLogin}! Next!`);
    // Set today equal to 'new Date()' for the saving last login
    let today = new Date();
    // Set the user's last login equal to the current date and time
    logins[username.toLowerCase()].lastLogin = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}-${today.getHours()}:${today.getMinutes()}`;
    // Save the new last login to Logins.json
    fs.writeFile("./Logins.json", JSON.stringify(logins, 0, 2), err => {
        if (err) throw err
    });
    // Restart the program
    return system(username)
}

function system(username) {
    let key;
    if(logins[username.toLowerCase()].key !== "null"){
    	key = new NodeRSA(logins[username.toLowerCase()].key);
    	 key.importKey(key, "pkcs1")
	} else {
    	key = new NodeRSA(null, 'pkcs1')
	}
	if(key !== logins[username.toLowerCase()].key){
        logins[username.toLowerCase()].key = key
	}
	rl.question('Do you want to encrypt or decrypt?', (answer) => {
		if(answer.toLowerCase() === "encrypt"){
			encrypt(key, username);
		}
		if(answer.toLowerCase() === "decrypt"){
			decrypt(key)
		}
	})

}
function encrypt(key, username) {
    rl.question('What do you want to encrypt?', (text) => {
        const key = new NodeRSA({b: 512});
        text = 'Hello RSA!';
        const encrypted = key.encrypt(text, 'base64');
        console.log('encrypted: ', encrypted);
		fs.writeFile(`./${username}:Encrypted.txt`, encrypted, err =>{
			if(err) throw err
		})
    })
}

// Start the program
return start();