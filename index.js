import express from "express";
import fs from "fs";
import bodyParser from "body-parser";


const app = express();
const port = 3000;
// Read the posts folder.
var posts = fs.readdirSync('views/posts');
var postLength = posts.length;


// Set the path for the static files folder (public).
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// New posts requests.
app.post("/post", (req, res) => {

    // STEP 1  -  Return to index page if cancel button is clicked;
    if (req.body.button === "Cancel") {
        res.render("index.ejs", {posts: posts, postLength: postLength});
        console.log(req.body.button);   
    // STEP 2  -  If the content is send through request then rewrite the existed file. 
    } else {

        // Dealing with no posts on the posts folder.
        if (postLength === 0) {
            var newPostNumber = 0;
        } else {
            // STEP 2.1  -  Find the name of the last file of the posts array.
            var lastPostName = posts[posts.length -1];
            // STEP 2.2  -  Slice the .ejs file and leave only the numbers.
            var newPostNumber = parseInt(lastPostName.slice(0, lastPostName.search(".ejs"))) + 1;
        }
        
        // STEP 3  -  Create a new file with the newData.
        var newData = `<h1 class="display-6 fw-semibold lh-1 text-body-emphasi py-3 mb-3" id="Title">${req.body.Title}</h1><p class="mb-4 fs-5" id="Content">${req.body.Content}</p><p class="mb-4 fs-5 fw-light" id="Author">${req.body.Author}</p>`;
        fs.writeFileSync(`views/posts/${newPostNumber}.ejs`, newData);
        
        // STEP 4  -  Update the variables posts and postLength after the new change.
        posts = fs.readdirSync('views/posts');
        postLength = posts.length;

        // STEP 5  -  Send the user back to the index page.
        res.render("index.ejs", {posts: posts, postLength: postLength});

        // console.log("File created...");
    }
})


// Edited content requests.
app.post("/editpost", (req, res) => {

    // STEP 1  -  Return to index page if cancel button is clicked;
    if (req.body.button === "Cancel") {
        res.render("index.ejs", {posts: posts, postLength: postLength});

        console.log(req.body.button);   
    // STEP 2  -  If the content is send through request then rewrite the existed file. 
    } else {
        var newData = `<h1 class="display-6 fw-semibold lh-1 text-body-emphasi py-3 mb-3" id="Title">${req.body.Title}</h1><p class="mb-4 fs-5" id="Content">${req.body.Content}</p><p class="mb-4 fs-5 fw-light" id="Author">${req.body.Author}</p>`;
        fs.writeFileSync(`views/posts/${req.body.fileName}`, newData);
        // STEP 3  -  Send the user back to the index page.
        res.render("index.ejs", {posts: posts, postLength: postLength});

        // console.log("File updated...");
    }
    
});


// Edit posts requests.
app.post("/edit", (req, res) => {

    // STEP 1  -  Find the name of the file the user clicked and read its content.
    // keyArrays holds the name of the file the edit button was clicked.
    var keyArrays = Object.keys(req.body)[0];
    // fileContent holds the entire content of that file.
    var fileContent = fs.readFileSync(`views/posts/${keyArrays}`, "utf-8");

    // STEP 2  -  Identify each part of the HTML: heading (h1), content (p) and author (p).
    // Slice the title part, 15 final position of <h1 id="Title"> and find the last position of </h1> using lastIndexOf().
    var postTitle = fileContent.slice(78, fileContent.lastIndexOf("</h1>"));
    // Slice the content part, find the final position of </h1> and add 23 strings to match the start of the content and find the first position of the first </p> using indexOf().
    var postContent = fileContent.slice(fileContent.lastIndexOf("</h1>") + 39, fileContent.indexOf("</p>"));
    // Slice the author part, find the final position of the first </p> and add 21 strings to match the start of the author and find the first position of the last </p> using lastIndexOf().
    var postAuthor = fileContent.slice(fileContent.indexOf("</p>") + 46, fileContent.lastIndexOf("</p>"));

    // STEP 3  -  Send those informations separately to the edit.ejs page.
    res.render("edit.ejs", {"fileName": keyArrays, "Title": postTitle, "Content": postContent, "Author": postAuthor});

});


// Delete posts requests.
app.post("/delete", (req, res) => {

    // STEP 1  -  Find the name of the file the user clicked and read its content.
    // keyArrays holds the name of the file the edit button was clicked.
    var keyArrays = Object.keys(req.body)[0];

    // STEP 2  -  Remove the file.
    // Remove clicked post.
    fs.rm(`views/posts/${keyArrays}`, (err) => {
        if (err) {
            console.log("Erro");
            console.log(err);
        } else {
            console.log("Post deleted");
            // After the post is deleted, save the new values to the already assigned variables.
            posts = fs.readdirSync('views/posts');
            postLength = posts.length;
            // Render the index page to update it with the current posts in the folder.
            res.render("index.ejs", {posts: posts, postLength: postLength});
        }
    });

});


// Render index.ejs when a request for the root comes in.
app.get("/", (req, res) => {
    res.render("index.ejs", {posts: posts, postLength: postLength});
});


// Dealing with headers link requests.
app.get("/new.ejs", (req, res) => {
    res.render("new.ejs");
});


app.get("/contact.ejs", (req, res) => {
    res.render("contact.ejs");
});


app.get("/projects.ejs", (req, res) => {
    res.render("projects.ejs");
});


app.get("/about.ejs", (req, res) => {
    res.render("about.ejs");
});


// Initialize app.
app.listen(port, () => {
    console.log(`The server is running on port ${port}.`);
});