
//##############################################################################
//                              Configuration
//##############################################################################
const PORT = 3001;
const USER = 'admin';
const PASS = 'admin';
const SESSION_AGE = 10 * 60000; // 10 minutes

//##############################################################################
//                                Packages
//##############################################################################

const path = require('path');
const express = require('express');
const app = express();
const exec = require("child_process").exec;
const fs = require('fs');

var session = require('express-session');

// Use the session middleware
app.use(session({secret: 'keyboard cat', cookie: {maxAge: SESSION_AGE}}));

// add assets path
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// for parse post
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
//
//##############################################################################
//                              Page Routing
//##############################################################################

// On showing the page
app.get('/', function (req, res) {
    // Check if user is logged in
    if (req.session.islogin) {
        // If yes, show index.html 
        res.sendFile(path.join(__dirname, 'www/index.html'));
    } else {
        // Otherwise, redirect to the login page
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
    }

});

app.get('/login', function (req, res) {

    // Render login page
    res.sendFile(path.join(__dirname, 'www/login.html'));
});

// Login stuff
app.post('/loginCheck', function (req, res) {
    // Check user/pass, if correct redirect to panel
    if (req.body.username === USER && req.body.passwd == PASS) {
        req.session.islogin = true;
        res.writeHead(302, {
            'Location': '/'
        });
    // If it's wrong, just show the login page again
    } else {
        res.writeHead(302, {
            'Location': '/login'

        });
    }
    res.end();
});

// Checking the list of available processes
app.get('/getProccess', function (req, res) {
    // Check if user is logged in
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        // Send json header
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        // Get list of processes from json and show us what we have available
        exec("pm2 jlist", (error, stdout, stderr) => {
            res.write(stdout);
            res.end();
        });
    }
});

// Adding processes
app.post('/addProccess', function (req, res) {
    // Check if user is logged in
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {

        // Get our list from the json
        if (req.body.path === undefined) {
            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
            return false;
        }

        // Check if the file exists. If not, start it and add it to the list
        if (fs.existsSync(req.body.path)) {
            // Start a process, adding it to the list
            exec('pm2 start "' + req.body.path + '"', (error, stdout, stderr) => {
                // Save notification
                // req.session.notification = error + '\n--------\n' + stdout + '\n--------\n' + stderr;
                if (error != null) {
                    req.session.notification = error + stderr;
                } else {
                    req.session.notification = 'Process:' + req.body.path + ' started successfully';
                }
                res.writeHead(302, {
                    'Location': '/'
                });
                res.end();
                return true;
            });
        } else {

            // Go back if the process already exists
            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
            return false;
        }

    }
});

// Restart a process
app.get('/restart', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        if (req.query.id) {
            exec("pm2 restart " + req.query.id, (error, stdout, stderr) => {
                res.writeHead(302, {
                    'Location': '/'
                });
                // req.session.notification = error + '\n--------\n' + stdout + '\n--------\n' + stderr;
                if (error != null) {
                    req.session.notification = error + stderr;
                } else {
                    req.session.notification = 'Process by id :' + req.query.id + ' restarted successfully';
                }
                res.end();
            });

        }

    }
});

// Start a process
app.get('/start', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        if (req.query.id) {
            exec("pm2 start " + req.query.id, (error, stdout, stderr) => {
                res.writeHead(302, {
                    'Location': '/'
                });
                // req.session.notification = error + '\n--------\n' + stdout + '\n--------\n' + stderr;
                if (error != null) {
                    req.session.notification = error + stderr;
                } else {
                    req.session.notification = 'Process by id :' + req.query.id + ' started successfully';
                }
                res.end();
            });

        }

    }
});

// Stop a process
app.get('/stop', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        if (req.query.id) {
            exec("pm2 stop " + req.query.id, (error, stdout, stderr) => {
                res.writeHead(302, {
                    'Location': '/'
                });
                // req.session.notification = error + '\n--------\n' + stdout + '\n--------\n' + stderr;
                if (error != null) {
                    req.session.notification = error + stderr;
                } else {
                    req.session.notification = 'Process by id :' + req.query.id + ' stopped successfully';
                }
                res.end();
            });

        }

    }
});

// Remove a process
app.get('/delete', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        if (req.query.id) {
            exec("pm2 delete " + req.query.id, (error, stdout, stderr) => {
                res.writeHead(302, {
                    'Location': '/'
                });
                // req.session.notification = error + '\n--------\n' + stdout + '\n--------\n' + stderr;
                if (error != null) {
                    req.session.notification = error + stderr;
                } else {
                    req.session.notification = 'Process by id :' + req.query.id + ' deleted successfully';
                }
                res.end();
            });

        }

    }
});


// Save a process
app.get('/dump', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        exec("pm2 save", (error, stdout, stderr) => {
            res.writeHead(302, {
                'Location': '/'
            });
            //req.session.notification = error + '\n--------\n' + stdout + '\n--------\n' + stderr;
            if (error != null) {
                req.session.notification = error + stderr;
            } else {
                req.session.notification = 'Current processes dumped successfully';
            }
            res.end();
        });


    }
});

// Show session notification
app.get('/notification', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return false;
    } else {
        if (!req.session.notification) {
            res.write('-');
        } else {
            var message = req.session.notification;
            delete req.session.notification;
            res.write(message);
        }
        res.end();
    }
});



// File system window
app.get('/folder', function (req, res) {

    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else {
        // Check path and set default tab
        if (req.query.path === undefined) {
            var chosenPath = '/';
        } else {
            var chosenPath = req.query.path;
        }
        // Send json header
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        // Check if chosen path exists
        if (fs.existsSync(chosenPath)) {
            // If so, read it
            fs.readdir(chosenPath, (err, files) => {
                // Create list
                var list = [];
                chosenPath = chosenPath + '/';
                chosenPath = chosenPath.replace('//', '/');
                // Put folder in the list
                var e = path.join(chosenPath, '..');
                list.push({'name': '..', 'path': e});
                files.forEach(file => {
                    var tmp = {'name': file, 'path': chosenPath + file};
                    list.push(tmp);
                });
                // Send buffer
                res.write(JSON.stringify(list));
                res.end();
            });

        } else {

            res.write('[]');
            res.end();

        }
    }

});

// Logout
app.get('/logout', function (req, res) {

    // Delete session
    delete req.session.islogin;
    // Redirect to login page
    res.writeHead(302, {
        'Location': '/login'
    });
    res.end();
});

// View process log
app.get('/log', function (req, res) {
    if (!req.session.islogin) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();

    } else { 
        if (req.query.id) {
            // Post log
            var proc = require('child_process').spawn("pm2", ['log', req.query.id]);

            req.session.notification = '';
            proc.stdout.on('data', (data) => {
                req.session.notification = req.session.notification + data;
            });

            setTimeout(function () {
                proc.stdin.end();
                res.writeHead(302, {
                    'Location': '/'
                });
                res.end();
            }, 500);

        }

    }
});


//##############################################################################
//                         Finalize, print to console
//##############################################################################

app.listen(PORT, function () {
    console.log('PM2Panel listening on port ' + PORT + '! \n You can use your panel at http://server-ip:' + PORT + '. \n Come back when you miss the CLI.');
});