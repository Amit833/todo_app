// ENVIRONMENT - CHECK MINIMUM REQUIRED CONFIGURATION FOR STARTING UP THE API...

if (!process.env.MONGO_URI_DEV && !process.env.MONGO_URI_PROD) {
  console.error(
    "[STARTUP] Environment check failed! No key 'MONGO_URI' found in environment!"
  );

  // are we on the deployment server?? -> specific instructions for env config uploading
  if (process.env.NODE_ENV == 'production') {
    console.error(
      '[STARTUP] Please upload the environment key MONGO_URI to your deploy server!'
    );
    console.error(
      'Heroku example: heroku config:set MONGOURI=<yourDatabaseConnectionString>'
    );
  }
  // are we on our local machine? -> specific instructions for .env file setup
  else {
    console.error('[STARTUP] Please provide a variable MONGO_URI in an .env file!');
    console.error(
      "[STARTUP] Otherwise I don't know to which database I should connect :-((( "
    );
  }
  return process.exit(1); // exit with error
}
