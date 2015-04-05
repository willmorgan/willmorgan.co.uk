willmorgan.co.uk
================

version: 0.9.3

My personal / freelancer promotion website.

## Environment variables
* Set them in `/etc/environment` on non-Heroku setups, in order for them to be populated on machine boot.
* Ensure Apache is restarted through `apache2ctl stop && apache2ctl start` in order to pick up new variable assignments.

**GITHUB_DEPLOY_SECRET**    Used for verifying webhooks from GitHub
