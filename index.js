const names = require('all-the-package-names')
const app = require("express")()
require("vercelsocket")(app).then((io) => {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html")
    })

    app.get("/fetch", async (req, res) => {
        const id = names[getRandomInt(1,names.length)]
        const newres = await fetch("https://registry.npmjs.org/" + id)

        const result = await newres.json()

        let main = `
        <!DOCTYPE html>
        <html>
        <head>
        <link rel="stylesheet" href="/main.css">
        </head>
        <body>
        <header>
        <h1 id="title">Test</h1>
        </header>
        <main>
        `

        try {
            main += `
        <div id="${id}" class="infodiv">
        <h2>${result.name}</h2>
            <p>${result.description}</p>
            <p>Made by ${result.versions[result["dist-tags"].latest].author.name}</p>
            <p>Link to npm: <a href="https://npmjs.org/${id}">Click here</a>
        </div>
        `
        } catch (err) {
            main += `
        <div id="${id}" class="infodiv">
        <h2>${result.name}</h2>
            <p>${result.description}</p>
            <p>Made by an unknown Author</p>
            <p>Link to npm: <a href="https://npmjs.org/${id}">Click here</a>
        </div>
        `
        console.log(err)
        }

        const end = `
        <button onclick="location.reload()">Minecraft</button>
        </main>
        </body>
        </html>
        `

        main += end
        res.send(main)
})

    app.get("/main.css", (req, res) => {
        res.sendFile(__dirname + "/main.css")
    })

    app.get()

    app.listen(3000)
})