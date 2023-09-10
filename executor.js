
var newman = require('newman'); 
var fs = require('fs');

const initalCollection = require('./FakerAPIs.json')

function executeTest(tagToRun, envToRun) {

    let filteredCollection = initalCollection

    if(tagToRun) {
        filteredCollectionItems = initalCollection.item.filter(collectionStep => {
            return collectionStep.name.includes(tagToRun)
        })
        filteredCollection = {...initalCollection, item: filteredCollectionItems}
        console.log(`FilteredCollectionItemsSize: ${filteredCollectionItems.length}`)
    } 

    let envToRunOverride = require('./FakerEnv.postman_environment.json')

    if(envToRun) {
        envToRunOverride = require(envToRun)
    }
    
    newman.run({
        collection: filteredCollection,
        environment: envToRunOverride,
        reporters: ['html','cli'],
        reporter : { html : { export : './report/htmlReport.html'}},
        insecure: true, // allow self-signed certs, required in postman too
        timeout: 180000  // set time out
    }).on('start', function (err, args) { // on start of run, log to console
        console.log('running a collection...');
    }).on('done', function (err, summary) {
        if (err || summary.error) {
            console.error('collection run encountered an error.');
        }
        else {
            console.log('collection run completed.');
        }
    });
}

let tagToRun
if(process.argv.indexOf('--tag') != -1) {
    tagToRun = process.argv[process.argv.indexOf('--tag') + 1];
}

let envToRun
if(process.argv.indexOf('--env') != -1) {
    envToRun = process.argv[process.argv.indexOf('--env') + 1];
}

executeTest(tagToRun, envToRun)