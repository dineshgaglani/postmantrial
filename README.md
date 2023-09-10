# postmantrial
To Learn postman

TODOs:
1. Create parametrized collections with each collection having a specific type of request from the fakerapi endpoints
2. Create parameter that will drive the collection and tag the requests of the collection (requires running npm install newman, npm install newman-reporter-html).
3. Create the checking scripts in the collection.
4. Create a nodejs driver that will execute the collection, the input to the driver will be the name of the tags to execute.
5. Package the collection and nodejs driver in a Docker container with the entrypoint as the nodejs driver.
6. Each execution of the container will be considered a run, and multiple runs can be run in parallel.
7. (Optional) The nodejs driver 'awaits' completion of the run and saves the failing tests in a file, with the name being the tag that the container was executed with, so if a another execution of the container is attempted with the same tag, then only the failing test will be executed  


Framework supports:
1. Env support: Envs can be provided as command line args when executing the container. The envs can be any env provided a corresponding env file is created for it.
2. Parallel runs: The sequence on the parallel runs is set by the postman request order per collection. Different collections can be parallelized by executing multiple docker containers in parallel
3. Tagging: If in case different requests need to be executed on different, this is accommodated by providing the tags to be run and the env to be run on
4. Pre-conditions such as seeding and post conditions such as recording failing tests: Since the collection's execution is wrapped in a nodejs executable, the executable can be used to hook into pre and post tasks such as set-up, teardown, retries etc.
5. Datadriven testing: Postman supports providing a data file using which the collection execution can be repeated for every data in the data file, the data in the data file also can be filtered by using the nodejs executable wrapper that is provided
6. Perf tests: The most recent version of postman UI supports perf testing out of the box