#About#
This is a project that uses Amazon Alexa on the Echo Dot to send a request to a server that uses the blockchain to transmit a file to a 3D-Printer. This project was realized during the hackathon "Factory Hack" by Lasse Rieß, Tobias Vitt and Johannes Vitt. 
#How to use#
An Alexa skill consists of two parts. The voice interaction schema that is set up when creating a new Alexa skill on developer.amazon.com and the Code that is executed when the skill is triggered. In this project AWS Lambda is used to process the skill. You need to compress the nodemodules directory and the index.js file to a .zip directory and upload this to AWS Lambda. Then you can connect it to your Alexa Skill.
