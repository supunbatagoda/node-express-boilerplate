# RESTful API Node Server Boilerplate

A boilerplate for building production-ready RESTful APIs using Node.js, Express, and MySql

# Quick Start

## Node Package Module install

        npm install

## Environment variables

        copy .env.sample into a .env file and update variable values

## Naming convention

### For files

        CamelCase : class
        camelCase : function & variables
        all simple letters with _ for spacing & before the file extension(.js) added file type.
                example:
                user.controller.js
                access_provider.router.js
                api.service.js
                mysql.model.js
                form_data.validation.js
                main.class.js

### For folder

        all simple letters with _ for spacing
                example:
                api_authenticator

=======

## insall auth moudule

        npm install node-oauth2-server

## Node modules files update details

        copy
        _deploy/node-oauth2-server/ error.js grant.js files to
        node_modules/node-oauth2-server/lib

## Update System Environment Variable

### for linux users

        1) vim ~/.bashrc
        2) add this line end of the file without quotes "export DEFAULT_TENANT=2"
        3) source ~/.bashrc

### for windows users

        1) Open the Start Search, type in “env”, and choose “Edit the system environment variables”:
        2) Click the “Environment Variables…” button.
        3) Set the environment variables as needed. The New button adds an additional variable DEFAULT_TENANT=2.
        4) Dismiss all of the dialogs by choosing “OK”.
