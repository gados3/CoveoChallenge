# Coveo Front End Coding Challenge
**Challenge:** [github.com/coveo/frontend-coding-challenge](https://github.com/coveo/frontend-coding-challenge)

**My solution:** [Hosted on Force.com !](http://gados-developer-edition.na73.force.com/coveochallenge)

> **Notice:** My solution have been implemented and tested only for Google Chrome, other browsers are not supported at this stage. 

## Dev stack chosen for this project
* Backbone + Underscore
* TypeScript
* Sass
* Karma + Jasmine
* Gulp
* Materialize CSS

## Features
* User search
* Facets
* "Did you mean" suggestions
* Pagination
* Number of results per page selector
* Sort
* Results details

## Known issues
* Haven't been able to setup Karma + Jasmine in combination with Gulp properly just yet. So the tests aren't runnable.
* Facets behavior isn't rock solid
* Facets menu displays after footer on small devices
* Gulp task to build for prod on Salesforce isn't implemented just yet (build-dev is used)

## TODOS
* Setup Karma with TypeScript properly so that it runs smooth
* Write unit tests (lots)
* Setup a good WebPack config because Gulp has its limits
* Setup injections in html files to manage dev and prod environment variables for urls
* Establish the proper way to bundle external js libraries
* Refactor SCSS files
* Extract footer template in separate component
* Autocomplete on search bar
* Integrate Travis-CI
* Automate deployment to Salesforce
* Clean-up package.json
* Support other browsers than Chrome
* ~~Support IE~~