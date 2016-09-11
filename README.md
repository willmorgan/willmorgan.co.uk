willmorgan.co.uk
================

version: 1.2.1

My personal / freelancer promotion website.

## Environment variables
* Set them in `/etc/environment` on non-Heroku setups, in order for them to be populated on machine boot.
* Ensure Apache is restarted through `apache2ctl stop` and `apache2ctl start` in order to pick up new variable assignments.

**GITHUB_DEPLOY_SECRET**    Used for verifying webhooks from GitHub
**DEPLOY_ENVIRONMENT**      What environment we're running on. Set to "dev" for development, otherwise, a production environment is assumed.
