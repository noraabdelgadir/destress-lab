# The Destress Lab for a Ruff Day

## Main Page
The main page includes the login or signup or you can simply play the games without logging in. To play one of the two games, the user must press the game’s picture. Underneath each game’s picture, there’s a set of instructions for how to play the game. To login, click login on the navigation tab on top. The same process is used for signing up. In this phase, we have integrated the backend, meaning now the user’s information will be stored once they sign up for future logins. The application is currently deployed on Heroku; to access it, use the link http://http://de-stress-lab.herokuapp.com/

## Settings View
When logged in a user should be able to access their account settings that includes the user’s stressors list and their saved favourite breeds. The user can also delete or add new stressors or breeds.  Stresses can be typed in directly but breeds are selected from a dropdown list.  Clicking the add button (+) will add the information and clicking the trash button will delete the respective setting from the account. If the user signs out and logs in again, their breeds and stressors persist.

## Stress Shooter Game Page
When the user selects this game, they will see two canvases along with a pink back button around top centre that will lead them back to the main page if pressed. One canvas will be the background (in dark blue), and the other will be the canvas for the game (in dark purple). In the background canvas, we used the dog API to present pictures of dogs within a blue circle to bounce within the canvas. The breeds of the dogs depend on whether the user logged in, signed up, or not. If they are logged or signed up, then the breeds will be beagles and retrievers, but if they are not then random breeds will be the ones to bounce around the screen. During gameplay, some dogs could be stationary and slightly off screen.

For the game canvas, the user has a character with a hat similar to the one on the game picture on the main screen. The user will also be able to see a tab for instructions of the game specify how the user should interact with the screen, including moving with the arrow keys and pressing space for shooting a bullet. The user can only fire one bullet at a time and they will be able to shoot again once the previous bullet has reached one end of the game canvas. The purpose of this game, Stress Shooter, is to shoot or attack all the stresses that are in the game canvas that will either be bouncing around or be stationary. Once each stress is shot, it disappears from the screen. Once all stresses are gone, a popup shows up telling the user, “You’ll get through this…” The only option afterwards is to press OK and when the user clicks that, it reloads the game.

## Pop! Game Page
When the user selects this game, they will see a canvas along with a pink back button around top centre that will lead them back to the main page if pressed. The purpose of this game is to click or tap on the dog circles as they bounce around the screen to make them disappear. Every time a dog bubble disappears, another one appears and bounces around the screen. The dogs were obtained from the Dog API and are based on the user’s preferences. If no one is signed in, then it’s a random collection of dogs. The game does not end so if the user wishes to exit, they can press the back button to go back to the main page.

## CRUD
The CRUD based extension to our chosen API is to allow a user to create a persisting account with preferences on Dog breeds made available by the Dog API.

### Create: POST
Make an account: The user may create an account to be stored on database which can only be accessed via username and password login.

### Read: GET
Account info: The user may retrieve account information through get requests to view their stored list of favourite breeds of Dog API and stressors that they have input into the account.

###  Update: PUT
Edit account info: The user may change their password, breed preference and stressors list.  Authentication is required.

### Delete: DELETE
Remove account: The user may delete their account from the application.  Authentication is required.

