export TS_POST_PROCESS_FILE="/snap/bin/prettier --write"
openapi-generator generate -i swagger.json -g typescript-rxjs -o ./ --enable-post-process-file
