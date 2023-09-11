
var newman = require('newman'); 
var fs = require('fs');

const initalCollection = require('./FakerAPIs.json')

function executeTest(tagToRun, envToRun, data) {

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

    let datafile
    if(data) {
        datafile = data
    }
    
    newman.run({
        collection: filteredCollection,
        environment: envToRunOverride,
        iterationData: datafile,
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

let data
if(process.argv.indexOf('--data') != -1) {
    data = process.argv[process.argv.indexOf('--data') + 1];
}

executeTest(tagToRun, envToRun, data)