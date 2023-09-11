# postmantrial
To Learn postman

Commands:
1. Git clone the repo and navigate to repo
2. Create image for dockerfile 

```
docker build . -t postmanexecutor
```

3. Run the container with the image - 

```
docker run -v "{current_dir_path_in_full}:/etc/newman" postmanexecutor --tag stage
```

```
docker run -v "{current_dir_path_in_full}:/etc/newman" postmanexecutor --tag stage --data ./testdata1.csv
```

```
docker run -v "{current_dir_path_in_full}:/etc/newman" postmanexecutor --tag stage --data ./testdata1.csv
```

```
docker run -v "{current_dir_path_in_full}:/etc/newman" postmanexecutor --tag develop --data ./testdata1.csv
```

After the docker run the tests results file located in the report folder on the current folder. The nodejs executable wrapper can also be used to export the results of the test to test case management tools such as testrails.

Assumptions:
1. The tests are in their own repo and the same tests can be used to validate code from different development repos since the tests span end to end functionality and don't target any particular internal system specifically.

Reasoning for using Docker based on assumptions:
1. If the tests were embedded in the same repo as the dev code then they could be executed simply by executing newman on the command line of the build machine eliminating the need for using a Docker container, but this would have restricted the tests to be executed only with the repo they are present in (which works for a monolith but doesn't scale as functional pieces are separated into their own repos)
2. The dockerization of the tests makes it easy to integrate the end to end api tests on any development repo's build pipeline (regardless of which tech stack is being used by the dev code)
3. The trade off with having tests separate from dev repo is that if a branch on a dev repo breaks the tests then the test code's fix has to be timed accordingly with the promotion of the dev build from feature branch to develop branch to master branch.

Framework possible build process:
1. For demo purposes the docker image is being built from source but at an organization the image could be pushed to a docker registry when a change is made to it. The build pipeline could then use this image and execute the container in the pipeline steps (Need to learn how docker images in docker registry can be used on pipeline steps and how to provide params when executing the containers for these images) 

Framework supports:
1. Env support: Envs can be provided as command line args when executing the container. The envs can be any env provided a corresponding env file is created for it.
2. Parallel runs: The sequence on the parallel runs is set by the postman request order per collection. Different collections can be parallelized by executing multiple docker containers in parallel
3. Tagging: If in case different requests need to be executed on different envs, this is accommodated by providing the tags to be run and the env to be run on
4. Pre-conditions such as seeding and post conditions such as recording failing tests: Since the collection's execution is wrapped in a nodejs executable, the executable can be used to hook into pre and post tasks such as set-up, teardown, retries etc.
5. Datadriven testing: Postman supports providing a data file using which the collection execution can be repeated for every data in the data file, the data in the data file also can be filtered by using the nodejs executable wrapper that is provided
6. Perf tests: The most recent version of postman UI supports perf testing out of the box

Steps taken to build the framework:
1. Create parametrized requests with the fakerapi endpoints
2. Create parameter that will drive the collection and tag the requests of the collection (requires running npm install newman, npm install newman-reporter-html).
3. Create the checking scripts in the collection.
4. Create a nodejs driver that will execute the collection, the input to the driver will be the name of the tags to execute.
5. Package the collection and nodejs driver in a Docker container with the entrypoint as the nodejs driver.
6. Each execution of the container will be considered a run, and multiple runs can be run in parallel.
7. (Optional) The nodejs driver 'awaits' completion of the run and saves the failing tests in a file, with the name being the tag that the container was executed with, so if a another execution of the container is attempted with the same tag, then only the failing test will be executed  