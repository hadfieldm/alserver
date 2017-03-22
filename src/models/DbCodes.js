
const ErrorCodes = new Object();
ErrorCodes[2] = "Bad Value Provided";
ErrorCodes[11000] = "Email address already exists";

export default ErrorCodes;


// MONGO_BAD_VALUE                 => 2,
// UNKNOWN_ERROR             => 8,
// NAMESPACE_NOT_FOUND       => 26,
// EXCEEDED_TIME_LIMIT       => 50,
// COMMAND_NOT_FOUND         => 59,
// WRITE_CONCERN_ERROR       => 64,
// NOT_MASTER                => 10107,
// DUPLICATE_KEY             => 11000,
// DUPLICATE_KEY_UPDATE      => 11001, # legacy before 2.6
// DUPLICATE_KEY_CAPPED      => 12582, # legacy before 2.6
// UNRECOGNIZED_COMMAND      => 13390, # mongos error before 2.4
// NOT_MASTER_NO_SLAVE_OK    => 13435,
// NOT_MASTER_OR_SECONDARY   => 13436,
// CANT_OPEN_DB_IN_READ_LOCK => 15927,
