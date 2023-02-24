# HUBL
#### Full-stack  |  Pair  |  8 days

HUBL is a social media platform that allows registered users to join or create/edit/delete groups of some chosen topic of interest and create/edit/delete posts within the groups, as well as comment on other posts. Users can personalise their profiles and visit other users profiles, where various user activity is saved.

[View site here](https://hubl-social.herokuapp.com)

![hubl](/client/src/assets/readme/home.png)

## Technologies
- Node.js
- Packages including moment for formatting time
- Nodemon
- Mongoose
- MongoDB
- Bootstrap
- React.js
- HTML5
- CSS3
- SASS
- JWT
- Axios
- Cloudinary


## Code Installation
- Clone or download the repo
- Install dependencies by running `npm i` in Terminal
- `mongod --dbpath ~/data/db` to start the database
- Start the server by running `nodemon`
- Split terminal and run `client` to go to frontend folder
- `npm run start`


## Brief
The project must:
- Use an Express API to serve your data from a Mongo database
- Consume your API with a separate front-end built with React
- Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models
- Implement thoughtful user stories/wireframes that are significant enough to help you know which features are core MVP and which you can cut
- Have a visually impressive design
- Be deployed online



## Planning
After deciding on a concept, we drew up the wireframe on Excalidraw and clearly noted which aspects were essential for our minimum value product (MVP) and which were stretch goals. Also, being the smallest group, we went a step further and labelled our M-MVP, to make sure we prioritised well in case we didn't make as much progress in the time period. 

Alex and I met for a standup zoom call every morning to prioritise tasks for the day and identify any potential blockers. We also tended to stay on the call throughout the day on mute so that we could easily get in contact with each other if needed to make decisions or help with any issues that arose.

![wireframe](/client/src/assets/readme/wireframe.png)



## Build Process
### Set up
I began by setting up a GitHub repo that Alex forked so we could get to grips with the process of group projects on Git. With our development and feature branches ready to go, I created the project file using git clone and created the main file skeleton for the backend. For the front end we used a react template on which I made the main pages accessible with react-router-dom’s Browser Router. This meant we could split up the workload with a backbone to build on, each choosing a section to own, reducing merge conflicts.

### Backend
My first task was to get the server up and running: connecting with Mongoose in the index.js file, converting the request body to JSON, directing well defined traffic to the router and otherwise catching strays. I checked that the server could receive requests from Insomnia before moving on to the user model schema with Mongoose.

The user schema required some tampering as one of the more complex models:
A password confirmation virtual field and setter, taking the corresponding value passed by the user carried in the body of the request on registration
On registration or if password is modified:
Adding some custom pre-validation to confirm the passwords match
Hashing the accepted password with a Bcrypt generated ‘salt’ and saving to the user
Comparing password matches stored password on login

Next, I completed the rest of the request infrastructure: the router and controller functions. The Express router was simple enough as we had already planned out all our endpoints in the planning stage. I started with the authentication controllers, registering and logging in users, and testing in Insomnia before circling back to begin building model schemas for groups, posts, and comments. I set the owner field on each model as a referenced relationship to the User model, whereas any relationships between themselves were embedded, i.e. posts on groups.

We had some fun writing seeds for the database to have something to interact with when testing our controllers in Insomnia. These controllers took a while longer and were shared between us. Writing reusable functions to retrieve a single group, post or comment, populating foreign fields where appropriate, made this process much more efficient.

```
export const findComment = async (req, res) => {
  try {
    const postObject = await findPost(req, res, ['owner', 'posts.owner', 'posts.comments.owner'])
    const { post, group } = postObject
    if (post) {
      const { commentId } = req.params
      const targetComment = post.comments.id(commentId)
      if (!targetComment) throw new NotFound('Could not find comment')
      return { comment: targetComment, post: post, group: group }
    }
  } catch (err) {
    sendErrors(res, err)
  }
}
```

We wanted some of these end points to be only accessible for logged in users, such as posting a comment. This required a ‘secure route’ to act as a gateway for the selected endpoints on the router. The function checks the token on the request header is valid before opening the gates and passing on the user in question.


### Front End
By the afternoon of the second day, the bulk of the backend was ready to go so I could move onto the Front end. Alex had already made a start so I touched base to see how to best get involved. 

#### Navbar, posts and comments
With Alex focusing on the landing page, I polished off the navbar and fine tuned the browser routes before setting up the single group page. I started by displaying the key information, group title, bio etc, in a banner then moving my attention to the posts. This would be one of the bigger tasks due to all the requests involved for posting, editing, deleting and liking/unliking posts and comments. Not to mention joining/unjoining the group. 

One of the biggest challenges here was unravelling the web of interlinking components so code was reused wherever possible. When it all turned into a complicated mess, I made sure to start from the ground up, working out what the main rules were then applying those wherever appropriate. Once I could visualise the core relationships, it all fell into place. For example, which elements needed to be in the parent component and passed through as props, and which could be factored into the child component.

Conditionals and state hooks proved very useful on this project. For example, checking if the current user is the owner of the post and then displaying edit/delete options. An edit state unique to each post/comment component is toggled by the edit button and displays the input form with the current text already spread in.

![hubl](/client/src/assets/readme/single.png)

#### Timestamps with Moment.js
Mongoose schema has a handy inbuilt feature that generates a time stamp on creation when set to true. This can be accessed on page load when the API request is sent, but I wanted to update this in real time as the user is on the site, not just on every page refresh. I found the time formatting package Moment.js online and followed the documentation to implement it. First, using moment, I wrote functions to format the timestamp from the API response how I wanted.

```
export function unixTimestamp(timestamp){
  return moment(timestamp).format('X')
}  
export function getTimeElapsed(timestamp) {
  const now = new Date()
  const mins = Math.round((unixTimestamp(now) - unixTimestamp(timestamp)) / 60)
  const hours = Math.round(mins / 60)
  const days = Math.round(hours / 24)
  if (mins < 1) return 'Just now'
  if (mins < 2) return '1 minute ago'
  if (mins < 60) return mins + ' minutes ago'
  if (mins <= 90) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (hours < 48) return moment(timestamp).format('[Yesterday at] LT')
  if (days < 7) return moment(timestamp).format('ddd LT')
  if (days < 360) return moment(timestamp).format('MMM D LT')
  else return moment(timestamp).format('ll LT')
}
```

Then, I set an interval that updates a ‘timeElapsed’ state on each post/comment every second, formatting with the above function, which updates on screen automatically.

```
  //time since posting
  useEffect(() => {
    const tick = setInterval(() => {
      setTimeElapsed(getTimeElapsed(post.createdAt))
    }, 1000)
    return () => {
      clearInterval(tick)
    }
  }, [])
```

#### Profile
On day 6, with just 2 days to go, I got stuck into the profile page, reusing components wherever possible to display fully interactable posts and groups created or joined to by the user. The main challenge was getting all this information populated onto the get profile request in the first place. Populating the groups was straight forward enough, but the user created posts was more difficult due to the fact that they are embedded one level down into groups. I found the documentation to be a little patchy here so it took some trial and error, and stack overflow research. 

```
userSchema.virtual('joinedGroups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'members.owner',
})

userSchema.virtual('myPosts', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'posts.owner',
  get: (res, _vir, user) => {
    if (res) return res.map(group => {
      const { _id: groupId } = group
      const myPostsArray = group.posts.filter(post => {
        return post.owner.equals(user._id)
      })
      return { posts: myPostsArray, groupId }
    })
  },
})
```
The virtual ‘myPosts’ field required an additional getter function to extract only the users posts from the group referenced on the response. I followed this up by digging down into each path to populate both the posts and comments with their owners. Whilst I knew what I needed to achieve, the struggle here was finding the correct syntax of how to write it. 
Finally, I added functionality for users to edit their profiles, including their profile picture with Cloudinary. Then I set links for users to visit other profiles, retrieving the correct user with their id set as a parameter in the url. 

On the final day, we gathered a list of everything left to do, prioritising the tasks by importance, though styling was the biggest item on the to-do list. We worked together to accomplish the essentials, picking up from each other when needed. 



## Challenges
Group filters and pagination
Paginating the groups on the landing page took some time to complete. Following documentation, we worked together to integrate limit and offset parameters on the get request  that can be changed by the arrow button, and req.query in the backend controller (see third image). The buttons required some conditions to disable them when the beginning or end of the selection was reached, which eventually came to me in a lightbulb moment.

```
const pageUp = async () => {
  try {
    const result = skip + 6
    setSkip(result)
  } catch (err) {
    setError(true)
  }
}

<button
  className='btn-right'
  style={{ backgroundImage: `url(${arrow})` }}
  onClick={pageUp}
  disabled={searchedGroups.length < 6 || skip === groups.length - 6}
/>
```
To filter the groups displayed against the value typed into the search bar on the front end, we implemented a search parameter on the get request. Then, following documentation again, we  added a filter to the first argument of the find method when querying the Group model in the database. But first, we went through several steps to define the filter so that all possibilities are covered. 

```
//GET ALL GROUPS
export const getAllGroups = async (req, res) => {
  try {
    let filteredGroups
    const allGroups = await Group.find({}).populate('owner')
    if (req.query.search) {
      filteredGroups = allGroups.filter(group => group.name.toLowerCase().includes(req.query.search.toLowerCase()))
      if (filteredGroups.length === 0) throw new NotFound('No matches')
    }
    const groupMap = filteredGroups ? filteredGroups.map(group => group.name) : []
    const filter = groupMap.length > 0 ? { name: groupMap } : {}
    const groups = await Group.find(filter, null, { skip: req.query.skip, limit: req.query.limit }).populate('owner')
    return res.json(groups)
  } catch (err) { 
    sendErrors(res, err)
  }
}
```



## Wins
Likes and members
When working out how to implement something new, I visualise how it might work in practical terms, then work out how to write that in code. So for the likes, I envisioned the user posting ‘themselves’ in a bank of likes if they are not already there, and removing themselves if they are. With this narrative, it made sense that the like schema needed only a single ‘owner’ field, referencing the user model as before. The like model can then be embedded on the comments and posts.

As for the controller, I reviewed other post and delete functions already written for guidance along with new reasoning to fit the situation.

```
//handles both liking and unliking of comment depending if owner already exists in likes array
export const likeComment = async (req, res) => {
  try {
    const commentObject = await findComment(req, res)
    const { comment, group } = commentObject
    if (comment) {
      const existingLike = comment.likes.find(like => like.owner.equals(req.currentUser._id))
      if (existingLike) {
        await existingLike.remove()
        await group.save()
        return res.sendStatus(204)
      }
      const ownedLike = { ...req.body, owner: req.currentUser._id }
      comment.likes.push(ownedLike)
      await group.save()
      return res.json(ownedLike)
    }
  } catch (err) {
    sendErrors(res, err)
  }
}
```

Once set up for likes, it was the same process for group members. The members field could even use the same model schema and only a slightly altered controller function. 
I set a likeStatus hook to track whether the current user had liked the item or not and displaying the appropriate emoji and text. Whilst this worked in practice once the button had been clicked and response received from the API request to determine this, it had no way of knowing the status when first loading the page. I checked the existence of the user via the token inside the like field to determine this when the hook is declared.

```
const [likeStatus, setLikeStatus] = useState(() => {
    if (getToken() && post.likes.some(like => isOwner(like.owner))) return 202
    return 204
  })
```



## Key Takeaways
### Developmental Process
We were conscious of time and how much we wanted to get in, so we decided to focus on getting the functionality working then come back to perfect the styling later on. On reflection, I don’t think this is the best tactic. I much prefer to style as I go along so that each component is more or less complete before moving on. Styling tends to make more sense in the moment and builds up to one big job if all left to the end.

### Back end and API development in Node.js
This was our first homemade API built from scratch. Already being familiar with interacting with APIs from our previous project definitely helped this process. In particular, I gained experience of backend development in Node.js as well as building a non-relational database using MongoDB and all that goes into it:
Setting up the server
Model schema with Mongoose
Setting relationships between models
Seeding the database
Routing requests with Express and writing endpoints
User authentication in back end and adding custom pre-validation
Manipulating the response using virtual fields/getters
Error handling with Error classes

### Front end skills
Confidence with Bootstrap and SASS
Packages i.e. Moment.js
User authentication in front end
More confidence with hooks, useEffects and react-router-dom
Error handling with try-catches



## Bugs
- Join group / create group prompt cards in profile just link to homepage rather than specifically to the new group form
- Error handling is not flawless i.e. liking but not logged in
- Footer doesn't stay at bottom of homepage on smaller screens
- Some responsive styling issues
- Sometimes the photo upload doesn't work



## Future Improvements
- Join group / create group prompt cards in profile to link specifically to the new group form
- Are you sure you want to delete pop ups
- Better error handling and loading content states
- Allow users to upload photos on posts
- Ability to share posts or groups on other platforms
- More functionality on profile pages to facilitate user interaction i.e. to post on each others profiles / own profile 



