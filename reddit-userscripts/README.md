Note: Libreddit is no longer maintained so Redlib is taking its place.

# Reddit Redirector

Mobile reddit website sucks, made this because the existing userscripts I found either didn't work on Firefox Android, or didn't *replace* the original reddit.com url with the libreddit url in browser history.

Not synched up to Greasyforks via web sockets like my other userscripts because I'm lazy tonight.


# Automatic Redlib Quota & Error Redirector

Redlib instances are (well, at least Libreddit ones were) struggling under the new Reddit API limits. Many of them are returning rate limit errors. Use this userscript to easily hop between instances to mitigate this.
This script also automatically redirects you if the instance has errors parsing API information.

https://greasyfork.org/en/scripts/470863-automatic-libreddit-quota-error-redirector is set up to automatically pull from this repo (using webhooks) to update.

@match metadata updated frequently by GitHub Actions

# New Instance Button for Redlib 

Use this userscript to automatically get redirected to another Redlib instance if the one you're at is giving you the "Too Many Requests" error.

https://greasyfork.org/en/scripts/470863-automatic-libreddit-quota-redirector is set up to automatically pull from this repo (using webhooks) to update.

@match metadata updated frequently by GitHub Actions

#  Redlib Quirk Fixer

Fix some quirks of Redlib instances (disabled HLS, disabled NSFW, etc)

https://greasyfork.org/en/scripts/482514-libreddit-quirk-fixer is set up to automatically pull from this repo (using webhooks) to update.

@match metadata updated frequently by GitHub Actions