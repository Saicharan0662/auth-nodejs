# Node.js/Express.js Authentication system

This is an authentication system for signup and login with an email confirmation.
<br/> It uses nodemailer to send confirmation email.

## Set-up

Create .env file and add the following values:
1. connection string (mongo-uri)
2. jwt-lifetime
3. jwt-secret string
4. server-email -> from which email will be send.
5. server-password -> password for that email.

Note: You need to allow less secure app access from 
account setting (gmail) -> security -> allow less secure app access</br>
Then:
<br/>
```bash
npm install && npm start
```

## Contributing

Pull requests are welcome.

```bash
git clone <url>
git checkout -b <your branch>
```
After working on it.
```bash
git add .
git commit -m <commit message>
git push origin <your branch>
```
