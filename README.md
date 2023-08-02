## RSA Messaging App

In this app, users can send RSA-encrypted messages to each other.

Begin by choosing a username and creating a user. The app will create an RSAkey pair and send the public key to the server. Make sure to save the private key!!

After having created a user, you can choose another user from the list of users, and send a message to them. The message will be sent to the server where it is encrypted using the appropriate public key, and the resulting ciphertext is displayed in the list.

You can attempt to decrypt any message by entering your private key next to a ciphertext. However, it is very unlikely that you will successfully decipher a message that was not addressed to you.