# Scoreify

A web application inspired by Receiptify created by Michelle Liu - https://github.com/michellexliu/receiptify. It uses Spotify's API to display data about the user's listening habits.

This was created as a way to practice the Django and React frameworks.

Available at - https://scoreify.vercel.app/

Unfortunately, due to changes made to the Spotify API as of the 15th of May 2025, independent developers can no longer request a quota extensions. This means that only a whitelisted group of up to 25 users are able to make requests to the API through any specific web app. I finished development of this project ~2 weeks after this deadline without realising the changes that were coming. So most users are unfortunately unable to properly use the app. It did, however, achieve the primary goal of developing my Full-Stack skills and my understanding of web development. 

I have attached some screenshots below to show what the final version SHOULD have looked like to the average user: 

![ScoreifyMain](https://github.com/user-attachments/assets/c9b73d1c-661a-4b64-a361-59cda7f55a85)
![ScoreifySettings](https://github.com/user-attachments/assets/23e2219c-8629-4707-ae72-82d12a391a69)
![ScoreifyHelp](https://github.com/user-attachments/assets/270d420b-ddcb-482d-8e45-030d0ea54462)

Should you wish to run the app locally, you will have to create a web app on Spotify's developer dashboard (https://developer.spotify.com/dashboard/create). Then setting the callback URL to "http://127.0.0.1:8000/scoreify/callback/", or equivalent for localhost and port. Finally, you will need to take the Client ID and Client Secret given to you and store them in a .env file that the config file will use. 

To run the program, you will need two terminal windows, one for the frontend (which is run using "npm start") and one for the backend (which is run using python manage.py runserver)
