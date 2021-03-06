// Will be converted to plain JS Object.
module.exports = {
    "author": "Radek <rs676@cam.ac.uk>",
    "title": "Publications for Gene",
    "description": "Shows a list of publications for a specific gene",
    "version": "0.3.1",
    "dependencies": {
        "js": {
            "jQuery": {
                "path": "http://cdn.intermine.org/js/jquery/1.9.1/jquery-1.9.1.min.js"
            },
            "_": {
                "path": "http://cdn.intermine.org/js/underscore.js/1.3.3/underscore-min.js"
            },
            "Backbone": {
                "path": "http://cdn.intermine.org/js/backbone.js/0.9.2/backbone-min.js",
                "depends": [ "jQuery", "_" ]
            },
            "intermine.imjs": {
                "path": "http://cdn.intermine.org/js/intermine/imjs/2.9.2/im.js",
                "depends": [ "jQuery", "_" ]
            }
        }
    },
    // Example config. Pass this from your middleware that knows about the mine it connects to.
    "config": {
        "mine": "http://www.flymine.org/query",
        "pathQueries": {
            "pubsForGene": {
                "select": [
                    "publications.title",
                    "publications.year",
                    "publications.journal",
                    "publications.pubMedId",
                    "publications.authors.name"
                ],
                "from": "Gene",
                "joins": [
                    "publications.authors"
                ]
            }
        }
    }
};