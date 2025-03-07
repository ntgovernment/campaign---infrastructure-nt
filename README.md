# Brainium Labs Bootstrap 5 Starter Template

## Prerequisites ##

* [NodeJS](https://nodejs.org/en/download/)

## Install ##

Once cloned or downloaded, install the dependencies:

```bash
npm install
```

For development run:

```bash
npm run dev
```

For production builds run:

```bash
npm run prod
```

## Setting up pipeline for deploying to dev server ##

1) Enable pipelines in the newly create repository settings. The relative URL is /admin/addon/admin/pipelines/settings

2) Generate a SSH key and add our server as a known host. The relative URL is /admin/addon/admin/pipelines/ssh-keys

3) Go to stagmatrix on the Marlin server.

4) Add the generated key at the bottom of the authorized_keys file located in the .ssh folder.

5) Go to bitbucket-pipelines.yml on the root folder of the template and change 

REMOTE_PATH: "./public_html/matrix-starter" to REMOTE_PATH: "./public_html/{{your-site-name}}"

6) If everything goes well, the site would now be visible at http://matrix.test.brainiumlabs.com.au/your-site-name on next push.


## Setting up Git File Bridge for Matrix build

1) Go the the project repository settings.

2) Navigate to the "Access Tokens" section and "Create Repository Access Token". Give the Token a name, usually just Matrix File Bridge.

3) Set the Scopes to "Read" for Repositories only.

4) Press Create.

5) On this popup, copy ONLY THE URL from the third section, "How to use this token with your Git respository". Starting from https://

6) Navigate to Matrix > Configuration > Design Assets > Build > Right Click and select DETAILS. On, the details screen "Git Url", paste the url copied and Press "Save". Next to the "Git Url" now, you will see the option "Clone Repo". Press the button and everything is good to go.


